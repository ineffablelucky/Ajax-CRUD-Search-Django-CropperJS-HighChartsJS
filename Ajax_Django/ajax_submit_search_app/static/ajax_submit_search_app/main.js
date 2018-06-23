
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

         else if (data.message === 'fail') {
            alert("something went wrong. Refresh the page")
         }
    });

});


$(document).on('click','.update', function() {

    $('#myModal-EDIT').modal('show');

    let data_id = $(this).data("id");
    var all_siblings = $(this).siblings();

    $('#editName').val($(this).siblings('.name').text());
    $('#update_form_dob').val($(this).siblings('.date').text());

    $( "#update_form" ).data( "all-info", {id:data_id, all_siblings:all_siblings});
});


$(document).on("submit", "#update_form", function(g) {
    g.preventDefault();

    let data_id =  $( "#update_form" ).data("all-info").id;
    let sibling_tags = $( "#update_form" ).data("all-info").all_siblings;

    $.ajax({
                 type:"POST",
                 url:"update/",
                 data: {
                        // from form
                        'id' : data_id,
                        'name' : $('#editName').val(),
                        'dob' : $('#update_form_dob').val(),
                        'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),
                        },
                 success: function(data){
                     console.log(data)
                 },
                 error: function(){
                    alert("No return , AJAX ERROR")
                 }
            });
});

