$(document).ready(function() {

  var liId;
  var liIndex;
  var admin;

  $( function() {
    getAdmins();
  });

  $("#admin_create").dialog( {
    autoOpen: false,
    closeText: "",
    title: "Create new admin",
    resizable: false,
    modal: true,
    close: function() {
      $('#admin_create')[0].reset();
      $("#admin_create").dialog( "close" )
    }
  });

  $("#admin_form").dialog( {
    autoOpen: false,
    closeText: "",
    title: "Edit current admin",
    resizable: false,
    modal: true,
    close: function() {
      $('#admin_form')[0].reset();
      $("#admin_form").dialog( "close" );
      liId = undefined;
    }
  });


  function getAdmins() {
    $.ajax({
      type: "GET",
      url: "/admins",
      success:function(data) {
        data.map(function(c) {
          $('#admins_list').append("<li id =" + c.id + ">" + c.email + "</li>");
        })
      },
      error:function(result) {
        alert("error reading admins");
      },
      dataType: 'json'
    });
  }

  $("#admin_add").on("click", function() {
    $("#admin_create").dialog( "open" )
  });

  $('#admin_save').on('click', function() {
    setNewAdmin();
    $.ajax({
      type: "POST",
      url: "/admins",
      data: {
        email: admin.Email,
        password: admin.Password
      },
      success:function(result) {
        alert("Admin Created");
        $("#admins_list").append("<li id =" +result.id +" class =admins"+result.id+">" + result.email + "</li>")
      },
      error:function(result) {
        alert("error");
      },
      dataType: 'json'
    });
    $('#admin_create')[0].reset();
    $("#admin_create").dialog( "close" );
    return false;
  });




  function setNewAdmin() {
    admin = {
      Email: $("#new_admin_email").val(),
      Password: $("#new_admin_password").val()
    };
  }

  function setCountry() {
    admin = {
      Email: $('#admin_email').val(),
      Password: $('#admin_password').val()
    };
  }
});
