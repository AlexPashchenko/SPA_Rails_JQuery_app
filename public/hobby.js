$(document).ready(function() {
  var interestsArr = [];

  $(function() {
    getHobbies();
  });

  $("#hobby_form").dialog( {
    autoOpen: false,
    modal: true,
    close: function() {
      // form[0].reset();
        $("#hobby_form").dialog( "close" )
    }
  });

  $("#hobbies_list").on("click", 'li',function() {
    var index = $(this).index();
    $("#hobby_form").dialog( "open" );
    $('#hobby_title').val(this.innerHTML);
  });


  $(document).on('click','tr', function() {
    for(var i = 1; i < table.rows.length; i++) {
      table.rows[i].onclick = function() {
        rIndex = this.rowIndex;
        $(':checkbox').each(function() {
          $(this).prop("checked", false)
        });
        $("#firstname").val(this.cells[1].innerHTML);
        $("#lastname").val(this.cells[2].innerHTML);
        $("#age").val(this.cells[3].innerHTML);
        if(this.cells[4].innerText == 'male') {
          $("#maleGender").prop("checked", true)
        } else {
            $("#femaleGender").prop("checked", true)
          }
        let checkboxValues = this.cells[5].innerText.split(',');
        for(interest of interestsArr) {
          for(item of checkboxValues) {
            if(interest == item) {
              $('input[value='+ item+']').prop('checked', true);
            }
          }
        }
        $("#country").val(this.cells[6].innerHTML);
      };
    }
  });

  function getHobbies() {
    $.ajax({
      type: "GET",
      url: "/hobbies",
      success:function(data) {
        data.map(function(c) {
          $('#checkboxes').append("<label><input type = \"checkbox\" name =\"inter\" value = " + c.title
           + " id = " + c.id
           +">&nbsp"
           + c.title + "</label>" );
           interestsArr.push(c.title);
           $('#hobbies_list').append("<li id =" + c.id + ">" + c.title + "</li>");
        });
      },
      error:function(result) {
        alert("error reading hobbies");
      },
      dataType: 'json'
    });
  }
});
