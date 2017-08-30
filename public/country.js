$(document).ready(function() {

  var country;

  $(function() {
    getCountry();
  });

  function getCountry() {
    $.ajax({
      type: "GET",
      url: "/countries",
      success:function(data) {
        data.map(function(c) {
          $('#country').append("<option id=" + c.id +">" + c.title + "</option>");
          $('#countries_list').append("<li id =" + c.id + ">" + c.title + "</li>");
        })
      },
      error:function(result) {
        alert("error reading countries");
      },
      dataType: 'json'
    });
  }

  $("#country_add").on("click", function() {
    $("#county_form").dialog( "open" )
  });
  $('#country_save').on('click', function() {
    setCountry();
      $.ajax({
          type: "POST",
          url: "/countries",
          data: {
            title: country.Title
          },
          success:function(result) {
            alert("Country Created");
          },
          error:function(result) {
            alert("error");
          },
          dataType: 'json'
      });
      // $('#county_form')[0].reset();
      $("#county_form").dialog( "close" );
      return false;

  });

  $("#county_form").dialog( {
    autoOpen: false,
    modal: true,
    close: function() {
      $("#county_form").dialog( "close" )
    }
  });

  $("#countries_list").on("click", 'li', function() {
    var index = $(this).index();
    $("#county_form").dialog( "open" );
    $('#country_title').val(this.innerHTML);
  });

  function setCountry() {
    country = {
      Title: $('#country_title').val()
    };
  }

});
