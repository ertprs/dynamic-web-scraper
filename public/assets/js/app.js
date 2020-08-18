$(document).ready(function () {
  $("#form_scraper")
    .submit(function (e) {
      e.preventDefault();
    })
    .validate({
      invalidHandler: function (form, validator) {
        alert("Inputan tidak boleh kosong!");
      },
      submitHandler: function (form) {
        $.ajax({
          url: "/scraper",
          method: "POST",
          // hanya untuk input data tanpa dokumen
          data: $("#form_scraper").serialize(),
          // data: new FormData($("#form_scraper")[0]),
          success: function (res) {
            console.log(res);
            $("#hasil").val(res);
            // swal({
            //     title: 'Success!',
            //     text: data.message,
            //     type: 'success',
            //     timer: '1500'
            // })
          },
          error: function (err) {
            console.log(err);
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

let i = 1;

function addAttr() {
  i++;
  $(".attributes_container").append(`
        <div class="row" id="row${i}">
            <div class="col-md-6">
                <div class="form-group">
                    <label>Nama Data</label>
                    <input required name="data_name[]" id="data_name${i}" type="text" class="form-control data_name" placeholder="Judul">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>Selector Tag</label>
                    <input required name="selector_tag[]" id="selector_tag${i}" type="text" class="form-control selector_tag" placeholder="h1">
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
