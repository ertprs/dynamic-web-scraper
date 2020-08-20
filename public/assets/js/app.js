let i = 1;

$(document).ready(function () {
  $(document).on("change", ".selector_type", function () {
    let idRow = $(this).data("id");
    if ($(this).val() == "tag") {
      $(`#selector_prefix${idRow}`).text('(eg. "h1")');
      $(`#selector${idRow}`).attr("placeholder", "h1");
      $(`#selector_type${idRow}`).val("tag");
    } else if ($(this).val() == "class") {
      $(`#selector_prefix${idRow}`).text('(eg. "author_name")');
      $(`#selector${idRow}`).attr("placeholder", "author_name");
      $(`#selector_type${idRow}`).val("class");
    }
  });

  $(document).on("change", ".selector_traversal_type", function () {
    let idRow = $(this).data("id");
    if ($(this).val() == "first") {
      $(`#selector_traversal_type${idRow}`).val("first");
    } else if ($(this).val() == "all") {
      $(`#selector_traversal_type${idRow}`).val("all");
    }
  });

  $("#form_scraper")
    .submit(function (e) {
      e.preventDefault();
    })
    .validate({
      invalidHandler: function (form, validator) {
        alert("Inputan tidak boleh kosong!");
      },
      submitHandler: function (form) {
        $(".btn_submit").attr("disabled", true);
        console.log("Scraping...");
        $.ajax({
          url: "/scraper",
          method: "POST",
          // hanya untuk input data tanpa dokumen
          data: $("#form_scraper").serialize(),
          success: function (res) {
            console.log(res);
            if (res.isError) {
              $("#hasil").val(res.msg);
            } else {
              $("#hasil").val(res);
            }
            $(".btn_submit").attr("disabled", false);
            // swal({
            //     title: 'Success!',
            //     text: data.message,
            //     type: 'success',
            //     timer: '1500'
            // })
          },
          error: function (err) {
            console.log(err);
            $(".btn_submit").attr("disabled", false);
            // var response = JSON.parse(err.responseText);
            // let str = ''
            // $.each(response.errors, function(key, value) {
            //     str += value + ', ';
            // });
            // swal({
            //     title: 'Oops...',
            //     text: str,
            //     type: 'error',
            //     timer: '3000'
            // })
          },
        });
      },
    });
});

function addAttr() {
  i++;
  $(".attributes_container").append(`
        <div class="row" id="row${i}">
            <div class="col-md-6">
                <div class="form-group">
                    <label>Attribut</label>
                    <input required name="attribute[]" id="attribute${i}" type="text" class="form-control attribute" placeholder="Judul">
                </div>
            </div>
            <div class="col-md-6">
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
                            <div class="col-3">
                                <label class="col-form-label" id="selector_prefix${i}">(eg. "h1")</label>
                            </div>
                            <div class="col-9 pl-0">
                                <input required name="selector[]" id="selector1" type="text"
                                    class="form-control selector" placeholder="h1">
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="offset-md-6 col-md-6">
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
