$(document).ready(function() {

  var country;
  var liId;
  var liIndex;

  $(function() {
    getCountry();
  });

  function getCountry() {
    $.ajax({
      type: "GET",
      url: "/countries",
      success:function(data) {
        data.map(function(c) {
          $('#country').append("<option id=" + c.id +" class=country"+c.id+">" + c.title + "</option>");
          $('#countries_list').append("<li id =" + c.id + " class = \"countries"+c.id+"\">" + c.title + "</li>");
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
      success:function(result) {
        alert("Country Created");
        $('#country').append("<option id=" + result.id +" class =country"+result.id+">" + result.title + "</option>");
        $("#countries_list").append("<li id =" +result.id +" class = \"countries"+result.id+"\">" + result.title + "</li>")
      },
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
    debugger;
    $.ajax({
      url: "/countries/"+ liId,
      type: 'DELETE',
      error:function(result) {
        alert("error");
      },
      dataType: 'json'
    });
    $("#countries_list li").eq(liIndex).remove();
    $(".country"+liId).remove();
    $('#country_form')[0].reset();
    $("#country_form").dialog( "close" );
    liId = undefined;
    return false;
  });

  $('#country_edit').on('click', function(){
    setCountry();
    $.ajax({
      type: "PUT",
      url: "/countries/"+ liId,
      data: {
        title: country.Title
      },
      success: function(result) {
        $("#countries_list li:eq("+liIndex+")").html( result.title);
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

  $("#countries_list").on("click", 'li', function() {
    liId = $(this).attr('id');
    liIndex = $(this).index();
    $("#country_form").dialog( "open" );
    $('#country_title').val(this.innerHTML);
  });

  function setNewCountry() {
    country = {
      Title: $('#country_name').val()
    };
  }

  function setCountry() {
    country = {
      Title: $('#country_title').val()
    };
  }
});
