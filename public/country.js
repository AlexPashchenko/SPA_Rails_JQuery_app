$(document).ready(function() {

  var country;
  var liId;
  var liIndex;


  $(function() {
    getCountry();
  });


  function getCountry() {
    $.ajax ({
      type: "GET",
      url: "/countries",
      success:function(data) {
        data.map(function(c) {
          $('#country').append("<option id=" + c.id +" class=country"+c.id+">" + c.title + "</option>");
          $('#countries_list').append("<li id =" + c.id + " class = \"countries"+c.id+"\"><span>" + c.title
           + "</span><button type=\"button\" class=\"info_btn\">"
           + "<span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button></li>");
        })
      },
      error:function(result) {
        alert("error reading countries");
      },
      dataType: 'json'
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
        alert("error");
      },
      dataType: 'json'
    });
    $('#country_create')[0].reset();
    $("#country_create").dialog( "close" );
    return false;
  });


  $('#country_delete').on('click', function() {
    $.ajax({
      url: "/countries/"+ liId,
      type: 'DELETE',
      async:false,
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      success: function() {
        $("#countries_list li").eq(liIndex).remove();
        console.log(liId);
        $(".country"+liId).remove();
      },
      error:function(result) {
        alert("error");
      },
      dataType: 'json'
    });
    $('#country_form')[0].reset();
    $("#country_form").dialog( "close" );
    return false;
  });


  $('#country_edit').on('click', function() {
    setCountry();
    $.ajax({
      type: "PUT",
      url: "/countries/"+ liId,
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
        alert("error");
      },
      dataType: 'json'
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


  $("#countries_list").on("click", 'button', function(event) {
    liId = $(this).parent().attr('id');
    liIndex = $(this).index();
    $.ajax({
      url: "/countries/"+ liId,
      type: 'GET',
      success: function (result) {
        $("#dialog").dialog( "open" );
        $("#dialog").html('Country name:  '+ result.title + "<br> ID: " +result.id);
      },
      error:function() {
        alert("Can't show this country");
      },
      dataType: 'json'
    });
    event.stopPropagation();
  });


  $("#countries_list").on("click", 'li', function() {
    liId = $(this).attr('id');
    liIndex = $(this).index();
    $("#country_form").dialog( "open" );
    $('#country_title').val($(this).text());
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


  function setHeader(xhr) {
    xhr.setRequestHeader ('access-token', $.cookie("access-token")),
    xhr.setRequestHeader('client', $.cookie("client")),
    xhr.setRequestHeader ('expiry',$.cookie("expiry")),
    xhr.setRequestHeader ('token-type',$.cookie("token-type")),
    xhr.setRequestHeader ('uid', $.cookie("uid"));
  }

});
