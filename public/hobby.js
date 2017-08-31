$(document).ready(function() {

  var interestsArr = [];
  var hobby;
  var liId;
  var liIndex;

  $(function() {
    getHobbies();
  });

  $("#hobby_form").dialog( {
    autoOpen: false,
    closeText: "",
    resizable: false,
    title: "Edit current hobby",
    modal: true,
    close: function() {
      $("#hobby_form").dialog( "close" )
    }
  });

  $("#hobby_create").dialog( {
    autoOpen: false,
    closeText: "",
    title: "Create new hobby",
    resizable: false,
    modal: true,
    close: function() {
      $('#hobby_create')[0].reset();
      $("#hobby_create").dialog( "close" )
    }
  });

  $("#hobbies_list").on("click", 'li',function() {
    liId = $(this).attr('id');
    liIndex = $(this).index();
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
          $('#checkboxes').append("<label id =hobby" + c.id+"><input type = \"checkbox\" name =\"inter\" value = " + c.title
           + " id =" + c.id
           +">&nbsp<span id =name" + c.id+">"
           + c.title + "</span></label>" );
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

  $("#hobby_add").on("click", function() {
    $("#hobby_create").dialog( "open" )
  });

  $('#hobby_save').on('click', function() {
    setNewHobby();
    $.ajax({
      type: "POST",
      url: "/hobbies",
      data: {
        title: hobby.Title
      },
      success:function(result) {
        interestsArr.push(result.title);
        $("#checkboxes").append("<label id =hobby" + result.id +"><input type = \"checkbox\" name =\"inter\" value = " + result.title
         + " id =" + result.id
         +">&nbsp<span id =name" + result.id+">"
         + result.title + "</span></label>" );
        $("#hobbies_list").append("<li id =" + result.id + ">" + result.title + "</li>")
      },
      error:function(result) {
        alert("error");
      },
      dataType: 'json'
    });
    $('#hobby_create')[0].reset();
    $("#hobby_create").dialog( "close" );
    return false;
  });

  $('#hobby_delete').on('click', function() {
    $.ajax({
      url: "/hobbies/"+ liId,
      type: 'DELETE',
      error:function(result) {
        alert("error");
      },
      dataType: 'json'
    });
    $("#hobbies_list li").eq(liIndex).remove();
    $("#hobby" + liId).remove();
    $('#hobby_form')[0].reset();
    $("#hobby_form").dialog( "close" );
    liId = undefined;
    return false;
  });

  $('#hobby_edit').on('click', function(){
    setHobby();
    $.ajax({
      type: "PUT",
      url: "/hobbies/"+ liId,
      data: {
        title: hobby.Title
      },
      success: function(result) {
        $("#hobbies_list li:eq("+liIndex+")").html( result.title);
        $("#name" + result.id).html(result.title);
      },
      error:function(result) {
        alert("error");
      },
      dataType: 'json'
    });
    $('#hobby_form')[0].reset();
    $("#hobby_form").dialog( "close" );
    liId = undefined;
    return false;
  });

  function setNewHobby() {
    hobby = {
      Title: $('#hobby_name').val()
    };
  }
  function setHobby() {
    hobby = {
      Title: $('#hobby_title').val()
    };
  }

});
