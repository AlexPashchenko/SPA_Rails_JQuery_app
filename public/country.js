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
          + "</span><a class=country_edit> <span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a>"
          +"<a class=country_delete> <span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></li>");
        })
      },
      error:function() {
        console.log("error reading countries");
      }
    });
  }

  $("#countryclose").on('click', function() {
    $(this).closest('form').hide();
    $("#countries_container").show();
    $(this).closest('form')[0].reset();
  });

  $("#newcountryclose").on('click', function() {
    $(this).closest('form').hide();
    $("#countries_container").show();
    $(this).closest('form')[0].reset();
  });

  $("#country_add").on("click", function() {
    $("#country_create")[0].reset();
    $("#country_create").show();
    $("#countries_container").hide();
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
        $('#country').append("<option id=" + result.id +" class =country"+result.id+">" + result.title + "</option>");
        $("#countries_list").append("<li id =" +result.id +" class = \"countries"+result.id+"\"><span>"
         + result.title
         + " </span><a class=country_edit> <span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a>"
         +"<a class=country_delete> <span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></li>");
        $('#country_create')[0].reset();
        $("#country_create").hide();
        $("#countries_container").show();
        return false;
       },
      error:function(result) {
        alert("Invalid data");
      }
    });
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
    $("#countries_container").hide();
    $('#country_form').show();
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
        $('#country_form')[0].reset();
        $("#countries_container").show();
        $('#country_form').hide();
        liId = undefined;
        return false;
      },
      error:function(result) {
        alert("Invalid data");
      }
    });
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
