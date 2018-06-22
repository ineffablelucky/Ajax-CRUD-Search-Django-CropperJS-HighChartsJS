
$(document).on('submit','#create_form', function(e){
    e.preventDefault();

    $.post("create/",
      { name : $("#name_id").val(),
        date : $("#create_form_dob").val(),
        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()

      }, function(data) {
            if (data.message === 'fail') {
                alert("Enter correct input");
            }

            else if (data.message === 'successful') {
                $("#name_id").val('');
                $("#create_form_dob").val('');
                $('.close').trigger('click');
                $("#table_id").append('<tr><td class="name">'+ data.name + '</td><td class="date">'+ data.date +'<td class="update" data-id='+ data.id + '><button>Update</button></td><td class="delete" data-id=' + data.id +'><button>Delete</button></td>');
         };


      });

});


$(document).on('click','.delete', function() {

    $('#myModal-DELETE').modal('show');

    let data_id = $(this).data("id");
    var parent_tag = $(this).parent();
    $( "#delete_form" ).data( "all-info", {id:data_id, parent_tag:parent_tag}); //appending id and parent to form

    let children_tag_text = parent_tag.children("td:nth-child(1)").text();
    $("#delete_question").text("Are you sure, you want to delete "+ children_tag_text +"?");

});


$(document).on("submit",'#delete_form', function(f){
    f.preventDefault();

    let data_id =  $( "#delete_form" ).data("all-info").id;
    let parent_tag = $( "#delete_form" ).data("all-info").parent_tag;

    $.post("delete/"+ data_id,
      {
        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()

      }, function(data) {
         $('.close').trigger('click');

         if (data.message === 'successful') {
            parent_tag.remove();
            }

         else if (data.message === 'fail'){
            alert("something went wrong. Refresh the page")
         }

    });

});


$(document).on('click','.update', function() {

    $('#myModal-EDIT').modal('show');
    let data_id = $(this).data("id");
    console.log(data_id)
    var parent_tag = $(this).parent();
    console.log(parent_tag);


    let children_tag_text = parent_tag.children("td:first-child").text();
    let children_tag_dob = parent_tag.children("td:nth-child(2)").text();
    console.log(children_tag_text);
    console.log(children_tag_dob);

    //$("#delete_question").text("Are you sure, you want to delete "+ children_tag_text +"?");
});




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
