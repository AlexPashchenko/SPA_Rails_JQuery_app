$(document).ready(function() {
  window.getHobbies = getHobbies;
  var interestsArr = [];
  var hobby;
  var liId;
  var liIndex;

  $('#hobbies_tab').on('click', function(){
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

  $("#dialog").dialog({
    autoOpen: false,
    closeText: "",
    resizable: false,
    modal: true,
    close: function() {
      $("#dialog").dialog( "close" )
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

  $("#hobbies_list").on("click", 'button', function(event) {
    liId = $(this).parent().attr('id');
    liIndex = $(this).index();
    $.ajax({
      url: "/hobbies/"+ liId,
      type: 'GET',
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success: function (result) {
        $("#dialog").dialog( "open" );
        $("#dialog").html('Hobby name:  '+ result.title + "<br> ID: " +result.id);
      },
      error:function() {
        alert("Can't show this hobby");
      }
    });
    event.stopPropagation();
  });

  $("#hobbies_list").on("click", 'li',function() {
    liId = $(this).attr('id');
    liIndex = $(this).index();
    $("#hobby_form").dialog( "open" );
    $('#hobby_title').val($(this).text());
  });

  $(document).on('click', 'tr', function ()  {
    for(var i = 1; i < table.rows.length; i++) {
      rIndex = this.rowIndex;
      rId = this.cells[0].innerHTML
      $(':checkbox').each(function() {
        $(this).prop("checked", false)
      });
      $("#firstname").val($(this).closest('tr').find('td').eq(1).text());
      $("#lastname").val($(this).closest('tr').find('td').eq(2).text());
      $("#age").val($(this).closest('tr').find('td').eq(3).text());
      if($(this).closest('tr').find('td').eq(4).text() == 'male') {
        $("#maleGender").prop("checked", true)
      } else {
         $("#femaleGender").prop("checked", true)
      }
      let checkboxValues = $(this).closest('tr').find('td').eq(5).text().split(',');
      for(interest of interestsArr) {
        for(item of checkboxValues) {
          if(interest == item) {
            $('input[value='+ item+']').prop('checked', true);
          }
        }
      }
      $("#country").val($(this).closest('tr').find('td').eq(6).text());
    };
  });

  function getHobbies() {
    $('#hobbies_list li').remove();
    $('#checkboxes label').remove();
    $.ajax({
      type: "GET",
      url: "/hobbies",
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success:function(data) {
        data.map(function(result) {
          $('#checkboxes').append("<label id =hobby" + result.id+"><input type = \"checkbox\" name =\"inter\" value = " + result.title
           + " id =" + result.id
           +">&nbsp<span id =name" + result.id+">"
           + result.title + "</span></label>" );
           interestsArr.push(result.title);
           $('#hobbies_list').append("<li id =" + result.id + "><span>" + result.title
            + "</span><button type=\"button\" class=\"info_btn\">"
            + "<span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button></li>");
        });
      },
      error:function() {
        console.log("Can't reading hobbies  from DB");
      }
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
      dataType: 'json',
      beforeSend : function(xhr) {
        setHeader(xhr)
      },
      data: {
        title: hobby.Title
      },
      success:function(output) {
        interestsArr.push(output.title);
        $("#checkboxes").append("<label id =hobby" + output.id +"><input type = \"checkbox\" name =\"inter\" value = " + output.title
         + " id =" + output.id
         +">&nbsp<span id =name" + output.id+">"
         + output.title + "</span></label>" );
        $("#hobbies_list").append("<li id =" + output.id + "><span>" + output.title
         + "</span><button type=\"button\" class=\"info_btn\">"
         + "<span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button></li>");
      },
      error:function() {
        alert("Invalid data or unauthorized");
      }
    });
    $('#hobby_create')[0].reset();
    $("#hobby_create").dialog( "close" );
    return false;
  });

  $('#hobby_delete').on('click', function() {
    $.ajax({
      url: "/hobbies/"+ liId,
      type: 'DELETE',
      dataType: 'json',
      beforeSend : function(xhr) {
        setHeader(xhr)
      },
      success: function() {
        $("#hobbies_list li").eq(liIndex).remove();
        $("#hobby"+ liId).remove();
      },
      error:function() {
        alert("Unauthorized");
      }
    });
    $('#hobby_form')[0].reset();
    $("#hobby_form").dialog( "close" );
    return false;
  });

  $('#hobby_edit').on('click', function(){
    setHobby();
    $.ajax({
      type: "PUT",
      url: "/hobbies/"+ liId,
      dataType: 'json',
      data: {
        title: hobby.Title
      },
      beforeSend :function(xhr){
        setHeader(xhr)
      },
      success: function(result) {
        $("#hobbies_list li:eq("+liIndex+") > span").html(result.title);
        $("#name" + result.id).html(result.title);
      },
      error:function() {
        alert("Invalid data or unauthorized");
      }
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
  };

  function setHobby() {
    hobby = {
      Title: $('#hobby_title').val()
    };
  };
});
