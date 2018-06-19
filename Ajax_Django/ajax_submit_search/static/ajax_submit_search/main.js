$(document).on('submit','#create_form', function(e){
    //e.preventDefault();

    $.post('create/',
     { name : $("#name_id").val(),
       date : $("#create_form_dob").val(),
       csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
     }, function(data, )
   )
});
/*
$(document).ready(function(){
    $('a').click(function(e){
        e.preventDefault();

        $.post('create/',
        {   name : $("#name_id").val(),
            date : $("#create_form_dob").val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }, function(data, textStatus, xhr){

            }
        )
    });
})
*/