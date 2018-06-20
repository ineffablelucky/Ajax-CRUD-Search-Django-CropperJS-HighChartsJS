$(document).on('submit','#create_form', function(e){
    e.preventDefault();

    $.post("create/",
      { name : $("#name_id").val(),
        date : $("#create_form_dob").val(),
        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()

      }, function(data){

         $('.close').trigger('click');
         $("#table_id").append('<tr><td>'+ data.name + '</td><td>'+ data.date +'</td><td></td><td><button data-toggle="modal" data-target="#myModal-'+ data.id +'">Delete</button></td></tr>{% include "ajax_submit_search_app/delete_modal.html" %}')
      })
});


/*
$(document).on('submit','#update_form', function(e){
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
