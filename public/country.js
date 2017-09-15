$(document).ready(function() {
  window.getCountry = getCountry;
  var country;
  var liId;
  var liIndex;

  $('#countries_tab').on('click', function(){
    getCountry();
  });

  function getCountry() {
    $('#country option').remove();
    $('#countries_list li').remove();
    $.ajax ({
      type: "GET",
      url: "/countries",
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success:function(data) {
        data.map(function(result) {
          $('#country').append("<option id=" + result.id +" class=country"+ result.id+">" + result.title + "</option>");
          $('#countries_list').append("<li id =" + result.id + " class = \"countries"+result.id+"\"><span>" + result.title
          + "</span><a class=country_edit> Edit </a>"
          +"<a class=country_delete> Delete </a></li>");
        })
      },
      error:function() {
        console.log("error reading countries");
      }
    });
  }

  $("#country_add").on("click", function() {
    $("#country_create").dialog( "open" )
  });

  $('#country_save').on('click', function() {
    setNewCountry();
    $.ajax({
      type: "POST",
      url: "/countries",
      dataType: 'json',
      data: {
        title: country.Title
      },
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      success:function(result) {
        alert("Country Created");
        $('#country').append("<option id=" + result.id +" class =country"+result.id+">" + result.title + "</option>");
        $("#countries_list").append("<li id =" +result.id +" class = \"countries"+result.id+"\"><span>"
         + result.title+"</span><button type=\"button\" class=\"info_btn\">"
         + "<span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button></li>")},
      error:function(result) {
        alert("Invalid data or unauthorized");
      }
    });
    $('#country_create')[0].reset();
    $("#country_create").dialog( "close" );
    return false;
  });

  $('#countries_list').on('click', 'a.country_delete', function(e) {
    e.preventDefault();
    e.stopPropagation();
    liId = $(this).closest('li').attr('id');
    var current_li = $(this).closest('li');
    $.ajax({
      url: "/countries/"+ liId,
      type: 'DELETE',
      async:false,
      dataType: 'json',
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      success: function() {
        current_li.remove();
        $(".country"+liId).remove();
      },
      error:function(result) {
        alert("Unauthorized");
      }
    });
  });

  $('#countries_list').on('click', 'a.country_edit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    liId = $(this).parent().attr('id');
    liIndex = $(this).parent().index();
    $('#country_form').dialog( "open" );
    $('#country_title').val($(this).closest('li').find('span').text());
  });

  $('#country_update').on('click', function() {
    setCountry();
    $.ajax({
      type: "PUT",
      url: "/countries/"+ liId,
      dataType: 'json',
      data: {
        title: country.Title
      },
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      success: function(result) {
        $("#countries_list li:eq("+liIndex+")> span").html( result.title);
        $(".country"+result.id).html( result.title);
      },
      error:function(result) {
        alert("Invalid data or unauthorized");
      }
    });
    $('#country_form')[0].reset();
    $("#country_form").dialog( "close" );
    liId = undefined;
    return false;
  });

  $("#country_create").dialog( {
    autoOpen: false,
    closeText: "",
    title: "Create new country",
    resizable: false,
    modal: true,
    close: function() {
      $('#country_create')[0].reset();
      $("#country_create").dialog( "close" )
    }
  });

  $("#country_form").dialog( {
    autoOpen: false,
    closeText: "",
    title: "Edit current country",
    resizable: false,
    modal: true,
    close: function() {
      $('#country_form')[0].reset();
      $("#country_form").dialog( "close" );
      liId = undefined;
    }
  });

  $("#countries_list").on("click", 'li', function(event) {
    liId = $(this).attr('id');
    $.ajax({
      url: "/countries/"+ liId,
      type: 'GET',
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success: function (result) {
        $("#dialog").dialog( "open" );
        $("#dialog").html('Country name:  '+ result.title + "<br> ID: " +result.id);
      },
      error:function() {
        alert("Can't show this country");
      }
    });
    event.stopPropagation();
  });

  function setNewCountry() {
    country = {
      Title: $('#country_name').val()
    };
  };

  function setCountry() {
    country = {
      Title: $('#country_title').val()
    };
  };
});
