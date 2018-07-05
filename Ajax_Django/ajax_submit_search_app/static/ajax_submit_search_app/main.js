new_img = new Image(); // cropper variables

$( document ).ready(function() {

// cropper variables start
var image = document.getElementById('hidden_image_tag');
var input = document.getElementById('create_form_image');
var $alert = $('.alert');
var $modal = $('#modal');
// cropper variables ends


// HIgh CHart starts
function highChartFunc(data_list) {

    Highcharts.chart('high-container', {
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 25,
                depth: 70
            }
        },
        title: {
            text: '3D chart'
        },
        //subtitle: {
         //   text: 'Notice the difference between a 0 value and a null point'
       // },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        xAxis: {
            categories: Highcharts.getOptions().lang.shortMonths,
            labels: {
                skew3d: true,
                style: {
                    fontSize: '16px'
                }
            }
        },
        yAxis: {
            title: {
                text: null
            }
        },
        series: [{
            name: 'Birthday Frequency',
            data: data_list
        }]
    });
 }

//frequency = [2, 31, null, 4, 0, 5, 1, 4, 6, 3]
highChartFunc(frequency) // frequency variable defined in 'name_list.html' script tag.

// HIgh CHart ends1



// Cropper JS starts
$("#create_form_image").change(function (e) {
    // reference:  https://github.com/fengyuanchen/cropperjs/blob/master/examples/upload-cropped-image-to-server.html
     var files = e.target.files;

     var done = function (url) {
          input.value = '';
          image.src = url;
            $alert.hide();
          $modal.modal('show')
        };
        var reader;
        var file;
        var url;

        if (files && files.length > 0) {
          file = files[0];

          if (URL) {
            done(URL.createObjectURL(file));
          } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
              done(reader.result);
            };
            reader.readAsDataURL(file);
          }
        }

        $modal.on('shown.bs.modal', function () {
        cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 3,
        });
      }).on('hidden.bs.modal', function () {
        cropper.destroy();
        cropper = null;
      });
 });

document.getElementById('crop').addEventListener('click', function () {
        var initialAvatarURL;
        var canvas;

        $modal.modal('hide');

        if (cropper) {
          canvas = cropper.getCroppedCanvas({
            width: 160,
            height: 160,
          });

        }

        $("#create_form").data("info", {crop_image:canvas.toDataURL()});
          new_img.src = canvas.toDataURL();
});
// Cropper JS ends


// Create AJAX starts
$(document).on('submit','#create_form', function(e){

    e.preventDefault();

    formData = new FormData(document.getElementById('create_form'))
    formData.append('cropped_img', new_img.src) // new_img from cropper 'crop' event listener

    $.ajax({
                 type:"POST",
                 url:"create/",
                 data: formData,
                 cache: false,
                 processData: false,
                 contentType: false,
                 success: function(data){
                     if (data.message === 'fail') {
                        alert("Enter correct input; incorrect image or date format");
                     }

                     else if (data.message === 'successful') {

                        $("#name_id").val('');
                        $("#create_form_dob").val('');
                        $('.close').trigger('click');
                        highChartFunc(data.frequency);


                        $("#table_id").append('<tr><td class="name">'+
                            data.name + '</td><td class="date">'+
                            data.date +'<td class="update" data-id='+
                            data.id + '><button>Update</button></td><td class="delete" data-id=' +
                            data.id +'><button>Delete</button></td>');

                     };
                 },
                 error: function(){
                    alert("No return from server , maybe incorrect image or date format ");
                 }
        });
});
// Create AJAX ends


// DElete AJAX starts
$(document).on('click','.delete', function() {

    $('#myModal-DELETE').modal('show');

    $( "#delete_form" ).data( "all-info", {id:$(this).data("id"), parent_tag:$(this).parent()}); //appending id and parent to form

    let children_tag_text = $(this).parent().children("td:nth-child(1)").text();
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
            highChartFunc(data.frequency);
            }

         else if (data.message === 'fail') {
            alert("something went wrong. Refresh the page")
         }
    });

});
// DElete AJAX ends


// Update Ajax starts
$(document).on('click','.update', function() {

    $('#myModal-EDIT').modal('show');

    $('#editName').val($(this).siblings('.name').text());
    $('#update_form_dob').val($(this).siblings('.date').text());

    $( "#update_form" ).data( "all-info", {id:$(this).data("id"), all_siblings:$(this).siblings()});
});


$(document).on("submit", "#update_form", function(g) {
    g.preventDefault();

    let data_id =  $( "#update_form" ).data("all-info").id;
    let sibling_tags = $( "#update_form" ).data("all-info").all_siblings;

    $.ajax({
                 type:"POST",
                 url:"update/",
                 data: {
                        // from html form
                        'id' : data_id,
                        'name' : $('#editName').val(),
                        'dob' : $('#update_form_dob').val(),
                        'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),
                        },
                 success: function(data){
                     if (data.message === 'successful') {
                        $('.close').trigger('click');
                        highChartFunc(data.frequency);

                        sibling_tags[0].innerHTML = data.name;
                        sibling_tags[1].innerHTML = data.date;

                     }
                     else if (data.message === 'fail') {
                      alert("Not a correct Input.");
                     }

                 },
                 error: function(){
                    alert("No return from server , AJAX ERROR");
                 }
        });
});
// Update Ajax ends

$("#search_bar").keyup(function(){

        $.ajax({
               type: "POST",
               url: "search/",
               data: {
                    'search_input': $("#search_bar").val(),
                    'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),
               },
               success: function(data){

                    if (data.message === 'No Results') {
                        $("#table_id").children('tr').remove();
                        $('#No-result-tag').html("No results found.");
                    }

                    else if (data.message === 'successful') {
                        $('#No-result-tag').html("");
                        $("#table_id").children('tr').remove();

                        var json_result = JSON.parse(data.result);

                        $.each(json_result, function(index, value){
                            $("#table_id").append('<tr><td class="name">'+ value.fields.name + '</td><td class="date">'+ value.fields.dob +'<td class="update" data-id='+ value.pk + '><button>Update</button></td><td class="delete" data-id=' + value.pk +'><button>Delete</button></td>');
                        });

                    }
               }

        });
});



});
