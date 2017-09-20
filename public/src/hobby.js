  window.getHobbies = getHobbies;
  var interestsArr = [];
  var hobby;
  var liId;
  var liIndex;

  $('#hobbies_tab').on('click', function(){
    getHobbies();
  });

  $("#dialog").dialog({
    autoOpen: false,
    closeText: "",
    resizable: false,
    draggable: false,
    modal: true,
    close: function() {
      $("#dialog").dialog( "close" )
    }
  });

  $("#hobbyclose").on('click', function() {
    $(this).closest('form').hide();
    $("#hobbies_container").show();
    $(this).closest('form')[0].reset();
  });

  $("#newhobbyclose").on('click', function() {
    $(this).closest('form').hide();
    $("#hobbies_container").show();
    $(this).closest('form')[0].reset();
  });

  $("#hobbies_list").on("click", 'li', function(event) {
    liId = $(this).attr('id');
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
            + "</span><a class=hobby_edit><span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a>"
            +"<a class=hobby_delete>  <span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></li>");
        });
      },
      error:function() {
        console.log("Can't reading hobbies  from DB");
      }
    });
  }

  $("#hobby_add").on("click", function() {
    $("#hobby_create").show();
    $("#hobbies_container").hide();
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
        + " </span><a class=hobby_edit> <span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a>"
        +"<a class=hobby_delete>  <span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></li>");
        $('#hobby_create')[0].reset();
        $("#hobby_create").hide();
        $("#hobbies_container").show();
        return false;

      },
      error:function() {
        alert("Invalid data or unauthorized");
      }
    });
  });

  $('#hobbies_list').on('click', 'a.hobby_delete', function(e) {
    e.preventDefault();
    e.stopPropagation();
    liId = $(this).closest('li').attr('id');
    var current_li = $(this).closest('li');
    $.ajax({
      url: "/hobbies/"+ liId,
      type: 'DELETE',
      dataType: 'json',
      beforeSend : function(xhr) {
        setHeader(xhr)
      },
      success: function() {
        $("#hobby" + liId).remove();
        current_li.remove();
      },
      error:function() {
        alert("Unauthorized");
      }
    });
  });

  $('#hobbies_list').on('click', 'a.hobby_edit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    liId = $(this).parent().attr('id');
    liIndex = $(this).parent().index();
    $("#hobbies_container").hide();
    $('#hobby_form').show();
    $('#hobby_title').val($(this).closest('li').find('span').text());
  });

  $('#hobby_update').on('click', function(){
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
        $('#hobby_form')[0].reset();
        $("#hobbies_container").show();
        $('#hobby_form').hide();
      },
      error:function() {
        alert("Invalid data or unauthorized");
      }
    });
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
