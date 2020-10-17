let i = 1;
let data = {};
$(document).ready(function () {
  if($(".datepicker").length != 0){
    $('.datepicker').datetimepicker({
       format: 'MM/DD/YYYY',
       icons: {
           time: "now-ui-icons tech_watch-time",
           date: "now-ui-icons ui-1_calendar-60",
           up: "fa fa-chevron-up",
           down: "fa fa-chevron-down",
           previous: 'now-ui-icons arrows-1_minimal-left',
           next: 'now-ui-icons arrows-1_minimal-right',
           today: 'fa fa-screenshot',
           clear: 'fa fa-trash',
           close: 'fa fa-remove'
       }
    });
    let d = new Date();

    let month = d.getMonth()+1;
    let day = d.getDate();

    let output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear() 
    $(".datepicker").val(output)
  }
  
  $(".btn_download").hide();
  $(document).on("change", "#_page", function () {
    let str = ``;
    $(".btn_submit").attr("disabled", true);
    $(".btn_download").hide();
    $(".contents_count").text("Tunggu sebentar,");
    $(".process_description").html(
      '<i class="now-ui-icons loader_refresh spin"></i> Indexing contents...'
    );
    $(".contents_container").html(str);
    $("#_page").attr("readonly", "readonly").attr("disabled", true);
    $.ajax({
      url: "/sites/detikcom/indeks",
      method: "POST",
      timeout: 0,
      // hanya untuk input data tanpa dokumen
      data: {
        date: $("#_date").val(),
        sub_channel: $("#_sub_channel").val(),
        page: $("#_page").val(),
      },
      success: function (res) {
        console.log(res);
        if (res.isError) {
          console.log("Scraping failed.");
          $("#result").val(res.msg);
        } else {
          console.log("Successfull scraping.");
          $(".contents_count").text(res.content_links.length);
          $(".process_description").text("Artikel ditemukan.");
          $("#_date").val(res.input.date);
          $("#_sub_channel").val(res.input.sub_channel);
          let strPages = "";
          for (let i = 0; i < Math.max(...res.input.pages); i++) {
            let _val = i + 1 != 1 ? "/" + (i + 1) : "";
            strPages += `<option value="${_val}">Halaman ${i + 1}</option>`;
          }
          $("#_page").html(strPages);
          $("#_page")
            .attr("readonly", false)
            .attr("disabled", false)
            .val(res.input.page);
          $(".btn_download").attr("href", `/scraper/${res.objectId}/download`);
          $(".btn_download").show();
          $.each(res.content_links, (k, v) => {
            str += `<div class="col-12 mb-3 card">
                        <div class="row card-body">
                            <div class="col-md-8">
                                <p class="mb-0">${res.content_titles[k]}</p>
                                <span class="pl-0">${res.content_dates[k]}</span>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-success btn-small btn_download_content" data-link="${res.content_links[k]}"><i class="now-ui-icons arrows-1_cloud-download-93"></i> Unduh (.owl)</button>
                            </div>
                        </div>
                    </div>`;
          });
          $(".contents_container").html(str);
        }
        $(".btn_submit").attr("disabled", false);
      },
      error: function (err) {
        console.log(err);
        $(".contents_count").text("Something went wrong,");
        $(".process_description").text("Failed to scraping");
        $(".btn_submit").attr("disabled", false);
      },
    });
  });

  $("#form_indeks")
    .submit(function (e) {
      e.preventDefault();
    })
    .validate({
      invalidHandler: function (form, validator) {
        alert("Inputan tidak boleh kosong!");
      },
      submitHandler: function (form) {
        console.log("Sedang mengekstrak data...");
        let str = ``;
        $(".btn_submit").attr("disabled", true);
        $(".btn_download").hide();
        $(".contents_count").text("Tunggu sebentar,");
        $(".process_description").html(
          '<i class="now-ui-icons loader_refresh spin"></i> Indexing contents...'
        );
        $(".contents_container").html(str);
        $("#_page").attr("readonly", "readonly").attr("disabled", true);
        $.ajax({
          url: "/sites/detikcom/indeks",
          method: "POST",
          timeout: 0,
          // hanya untuk input data tanpa dokumen
          data: $("#form_indeks").serialize(),
          success: function (res) {
            console.log(res);
            if (res.isError) {
              console.log("Scraping failed.");
              $("#result").val(res.msg);
            } else {
              console.log("Successfull scraping.");
              $(".btn_submit").attr("disabled", false);
              $(".contents_count").text(res.content_links.length);
              $(".process_description").text("Artikel ditemukan.");
              $("#_date").val(res.input.date);
              $("#_sub_channel").val(res.input.sub_channel);
              let strPages = "";
              for (let i = 0; i < Math.max(...res.input.pages); i++) {
                let _val = i + 1 != 1 ? "/" + (i + 1) : "";
                strPages += `<option value="${_val}">Halaman ${i + 1}</option>`;
              }
              $("#_page").html(strPages);
              $("#_page")
                .attr("readonly", false)
                .attr("disabled", false)
                .val(res.input.page);
              $(".btn_download").attr(
                "href",
                `/scraper/${res.objectId}/download`
              );
              $(".btn_download").show();
              $.each(res.content_links, (k, v) => {
                str += `<div class="col-12 mb-3 card">
                            <div class="row card-body">
                                <div class="col-md-8">
                                    <p class="mb-0">${res.content_titles[k]}</p>
                                    <span class="pl-0">${res.content_dates[k]}</span>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-success btn-small btn_download_content" data-link="${res.content_links[k]}"><i class="now-ui-icons arrows-1_cloud-download-93"></i> Unduh (.owl)</button>
                                </div>
                            </div>
                        </div>`;
              });
              $(".contents_container").html(str);
            }
            $(".btn_submit").attr("disabled", false);
          },
          error: function (err) {
            console.log(err);
            $(".contents_count").text("Something went wrong,");
            $(".process_description").text("Failed to scraping");
            $(".btn_submit").attr("disabled", false);
          },
        });
      },
    });

  $(document).on("click", ".btn_download_content", function () {
    $('.modal_scrape').modal("show")
    $('#url').val($(this).data("link"))
  });

  $(".btn_download").hide();
  $(document).on("change", ".selector_type", function () {
    let idRow = $(this).data("id");
    if ($(this).val() == "tag") {
      $(`#selector_prefix${idRow}`).text('(eg. "h1")');
      $(`#selector${idRow}`).attr("placeholder", "h1");
      $(`#selector_type${idRow}`).val("tag");
    } else if ($(this).val() == "class") {
      $(`#selector_prefix${idRow}`).text('(eg. "detail__author")');
      $(`#selector${idRow}`).attr("placeholder", "detail__author");
      $(`#selector_type${idRow}`).val("class");
    }
  });
  
  $(document).on("change", ".advanced_option", function () {
    if ($(this).val() == "default") {
      $('.description').text('Secara default, atribut yang akan diekstrak adalah: Judul, Author, dan Detail konten.')
      $('#extraction_type').val("default")
      $('.advanced_form').html('')
    } else if ($(this).val() == "advanced") {
      $('.description').text('Anda dapat mengatur sendiri atribut yang akan diekstrak.')
      $('#extraction_type').val("advanced")
      $('.advanced_form').html(`
        <div class="row">
            <div class="col-12 attributes_container">
                <div class="row" id="row1">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Atribut</label>
                            <input required name="attribute[]" id="attribute1" type="text"
                                class="form-control attribute" placeholder="Judul">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="row">
                            <input type="hidden" value="tag" name="selector_type[]" id="selector_type1">
                            <div class="col-12">
                                <label>Jenis Selector</label>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <div class="form-check form-check-inline">
                                        <input data-id="1" class="form-check-input selector_type"
                                            type="radio" name="selector_type_option1"
                                            id="selector_type_tag1" value="tag" checked>
                                        <label class="pl-1 form-check-label" for="selector_type_tag1">
                                            Tag
                                        </label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input data-id="1" class="form-check-input selector_type"
                                            type="radio" name="selector_type_option1"
                                            id="selector_type_class1" value="class">
                                        <label class="pl-1 form-check-label" for="selector_type_class1">
                                            Class
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-12">
                                            <label>Selector Tag</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-4">
                                            <label class="col-form-label" id="selector_prefix1">(eg.
                                                "h1")</label>
                                        </div>
                                        <div class="col-8 pl-0">
                                            <input required name="selector[]" id="selector1" type="text"
                                                class="form-control selector" placeholder="h1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="offset-md-3 col-md-9">
                        <div class="row">
                            <input type="hidden" value="first" name="selector_traversal_type[]"
                                id="selector_traversal_type1">
                            <div class="col-12">
                                <label>Penulusuran Elemen</label>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <div class="form-check form-check-inline">
                                        <input data-id="1"
                                            class="form-check-input selector_traversal_type"
                                            type="radio" name="selector_traversal_type_option1"
                                            id="selector_traversal_type_first1" value="first" checked>
                                        <label class="pl-1 form-check-label"
                                            for="selector_traversal_type_first1">
                                            Elemen pertama
                                        </label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input data-id="1"
                                            class="form-check-input selector_traversal_type"
                                            type="radio" name="selector_traversal_type_option1"
                                            id="selector_traversal_type_all1" value="all">
                                        <label class="pl-1 form-check-label"
                                            for="selector_traversal_type_all1">
                                            Semua elemen
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-danger pull-right" type="button"
                            onclick="removeAttr(1)">Hapus
                            attribute</button>
                    </div>
                    <div class="col-md-12">
                        <hr>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-success pull-right" type="button" onclick="addAttr()">Tambah
                    attribute</button>
            </div>
        </div>`)}
  });

  $(document).on("change", ".selector_traversal_type", function () {
    let idRow = $(this).data("id");
    if ($(this).val() == "first") {
      $(`#selector_traversal_type${idRow}`).val("first");
    } else if ($(this).val() == "all") {
      $(`#selector_traversal_type${idRow}`).val("all");
    }
  });

  function isValid() {
    if ($('.advanced_option').val() == "default") {
      return true;
    } else if ($('.advanced_option').val() == "advanced") {
      let isvalid = true;
      let attributes = $(".attributes");
      $.each(attributes, (k, v) => {
        if (v.value == "") {
          isvalid = false;
        }
      });
      let selector = $(".selector");
      $.each(selector, (k, v) => {
        if (v.value == "") {
          isvalid = false;
        }
      });
      return isvalid;
    }
  }

  $("#form_scraper")
    .submit(function (e) {
      e.preventDefault();
    })
    .validate({
      invalidHandler: function (form, validator) {
        alert("Inputan tidak boleh kosong!");
      },
      submitHandler: function (form) {
        if (!isValid()) {
          alert("Inputan tidak boleh kosong!");
          return false;
        }
        console.log("Sedang mengekstrak data...");
        $("#result").val("");
        $(".btn_submit").attr("disabled", true);
        $(".btn_submit").html(`<i class="now-ui-icons loader_refresh spin"></i> Scraping...`);
        $(".btn_download").hide();
        $(".objectId").val("");
        $.ajax({
          url: "/sites/detikcom/scrape",
          method: "POST",
          // hanya untuk input data tanpa dokumen
          data: $("#form_scraper").serialize(),
          success: function (res) {
            console.log(res);
            if (res.isError) {
              console.log("Scraping failed.");
              $("#result").val(res.msg);
            } else {
              console.log("Successfull scraping.");
              window.open(`/scraper/${res.objectId}/download`, '_blank');
            }
            $(".btn_submit").attr("disabled", false);
            $(".btn_submit").html("Scrape now!");
          },
          error: function (err) {
            console.log(err);
            $(".btn_submit").attr("disabled", false);
          },
        });
      },
    });
});

function addAttr() {
  i++;
  $(".attributes_container").append(`
        <div class="row" id="row${i}">
            <div class="col-md-3">
                <div class="form-group">
                    <label>Attribut</label>
                    <input required name="attribute[]" id="attribute${i}" type="text" class="form-control attribute" placeholder="Judul">
                </div>
            </div>
            <div class="col-md-9">
              <div class="row">
                <input type="hidden" value="tag" name="selector_type[]" id="selector_type${i}">
                <div class="col-12">
                    <label>Jenis Selector</label>
                </div>
                <div class="col-12">
                    <div class="form-group">
                      <div class="form-check form-check-inline">
                          <input data-id="${i}" class="form-check-input selector_type" type="radio" name="selector_type_option${i}"
                              id="selector_type_tag${i}" value="tag" checked>
                          <label class="pl-1 form-check-label" for="selector_type_tag${i}">
                              Tag
                          </label>
                      </div>
                      <div class="form-check form-check-inline">
                          <input data-id="${i}" class="form-check-input selector_type" type="radio" name="selector_type_option${i}"
                              id="selector_type_class${i}" value="class">
                          <label class="pl-1 form-check-label" for="selector_type_class${i}">
                              Class
                          </label>
                      </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-12">
                                <label>Selector Tag</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <label class="col-form-label" id="selector_prefix${i}">(eg. "h1")</label>
                            </div>
                            <div class="col-8 pl-0">
                                <input required name="selector[]" id="selector${i}" type="text"
                                    class="form-control selector" placeholder="h1">
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="offset-md-3 col-md-9">
              <div class="row">
                  <input type="hidden" value="first" name="selector_traversal_type[]" id="selector_traversal_type${i}">
                  <div class="col-12">
                      <label>Penulusuran Elemen</label>
                  </div>
                  <div class="col-12">
                      <div class="form-group">
                          <div class="form-check form-check-inline">
                              <input data-id="${i}" class="form-check-input selector_traversal_type" type="radio" name="selector_traversal_type_option${i}"
                                  id="selector_traversal_type_first${i}" value="first" checked>
                              <label class="pl-1 form-check-label" for="selector_traversal_type_first${i}">
                                  Elemen pertama
                              </label>
                          </div>
                          <div class="form-check form-check-inline">
                              <input data-id="${i}" class="form-check-input selector_traversal_type" type="radio" name="selector_traversal_type_option${i}"
                                  id="selector_traversal_type_all${i}" value="all">
                              <label class="pl-1 form-check-label" for="selector_traversal_type_all${i}">
                                  Semua elemen
                              </label>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            <div class="col-12">
                <button class="btn btn-danger pull-right" type="button" onclick="removeAttr(${i})">Hapus attribute</button>
            </div>
            <div class="col-md-12">
                <hr>
            </div>
        </div>
    `);
  console.log("Tambah attribute");
}

function removeAttr(idx) {
  $(`.attributes_container #row${idx}`).remove();
  i--;
  console.log("Hapus attribute");
}

function downloadResult() {
  let objectId = $(".objectId").val();
  alert("Feature download is under developing.\n" + objectId);
}
