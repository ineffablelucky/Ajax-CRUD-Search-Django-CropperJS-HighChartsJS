//
// {% include 'ajax_submit_search_app/update_modal.html' %}
// {% include "ajax_submit_search_app/delete_modal.html" %}
//

$(document).on('submit','#create_form', function(e){
    e.preventDefault();

    $.post("create/",
      { name : $("#name_id").val(),
        date : $("#create_form_dob").val(),
        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()

      }, function(data) {
         $('.close').trigger('click');
         $("#table_id").append('<tr><td class="name">'+ data.name + '</td><td class="date">'+ data.date +'<td class="update" data-id='+ data.id + '><button>Update</button></td><td class="delete" data-id=' + data.id +'><button>Delete</button></td>');
      });
});


$(document).on('click','.delete', function(f) {
    $('#myModal-DELETE').modal('show');
    console.log(this)
    var data_id = $(this).attr("data-id")
    console.log(data_id)
    var parent_tag = $(this).parent()
    console.log(parent_tag)
})

/*
$(document).on('submit','#update_form', function(e) {
    e.preventDefault();

    $.post('',
      { name : $("#name_id").val(),
        date : $("#create_form_dob").val(),
        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()

      }, function(data) {

         $('.close').trigger('click');
         //$("#table_id").append('<tr><td>'+ data.name + '</td><td>'+ data.date +'</td><td></td><td><button data-toggle="modal" data-target="#myModal-'+ data.id +'">Delete</button></td></tr>{% include "ajax_submit_search_app/delete_modal.html" %}')
      })

});
*/
