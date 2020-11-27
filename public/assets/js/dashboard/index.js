$(document).ready(function() {
    $("#modal-form form").submit(function(e) {
        e.preventDefault()
    }).validate({
        invalidHandler: function(form, validator) {
            alert("Inputan tidak boleh kosong!");
        },
        submitHandler: function(form) {
            var id = $('#id').val();
            if (save_method == 'add') url = "/api/scrapes";
            else url = "/api/scrapes/" + id;
            $.ajax({
                url: url,
                type: $('#_method').val(),
                // hanya untuk input data tanpa dokumen
                data : $('#modal-form form').serialize(),
                success: function(res) {
                    console.log(res)
                    $('#modal-form').modal('hide');
                    swal({
                        title: 'Success!',
                        confirmButtonColor: '#f96332',
                        text: res.message,
                        type: 'success',
                        timer: '1500'
                    });
                    // TODO: HAPUS SCRAPE, dan GANTI '-' JADI SPASI dan sebaliknya
                    location.reload();
                },
                error: function(err) {
                    console.log(err)
                    swal({
                        title: 'Oops...',
                        confirmButtonColor: '#f96332',
                        text: err.message,
                        type: 'error',
                        timer: '1500'
                    })
                }
            });
        },
    });
})

function deleteData(id) {
    swal({
        title: 'Apakah Anda yakin?',
        text: "Data akan dihapus!",
        type: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#888',
        confirmButtonColor: '#f96332',
        confirmButtonText: 'Ya, hapus data',
        cancelButtonText: 'Batal'
    }).then(function() {
        $.ajax({
            url: "/api/scrapes/" + id,
            type: "DELETE",
            success: function(res) {
                console.log(res);
                swal({
                    title: 'Success!',
                    confirmButtonColor: '#f96332',
                    text: res.message,
                    type: 'success',
                    timer: '3000'
                });
                location.reload();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                let err = JSON.parse(xhr.responseText);
                swal({
                    title: 'Oops...',
                    confirmButtonColor: '#f96332',
                    text: err.message,
                    type: 'error',
                    timer: '5000'
                });
            }
        });
    });
}

function editData(id) {
    save_method = 'update';
    $('input[name=_method]').val('PUT');
    $('#modal-form form')[0].reset();
    $.ajax({
        url: "/api/scrapes/" + id,
        type: "GET",
        dataType: "JSON",
        success: function(res) {
            console.log(res)
            $('#modal-form').modal('show');
            $('.modal-title').text('Edit Data');
            $('#id').val(res.data.id);
            $('#url').val(res.data.content.json.url);
            $('#title').val(res.data.content.json.title);
            let strDataForm = ``;
            res.data.content.json.attributes.forEach(attr => {
                strDataForm += `<div class="form-group mb-2">
                                    <label class="font-disabled">${attr.name}</label>
                                    <input placeholder="Masukkan nama atribut" value="${attr.name}" type="text" class="form-control" id="${attr.name}_attribute_name" name="attribute_names[]" required>
                                    <textarea placeholder="Masukkan isi atribut" class="form-control" id="${attr.name}_attribute_value" name="attribute_values[]" required cols="30" rows="10">${attr.value}</textarea>
                                </div>`;
            });
            $('.data_form').html(strDataForm);
        },
        error: function(err) {
            console.log(err)
            alert("Data not found!");
        }
    });
}