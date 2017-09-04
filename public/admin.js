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


  $("#loginform").dialog( {
    autoOpen: false,
    closeText: "",
    resizable: false,
    title: "Sign_in",
    modal: true,
    close: function() {
      $("#loginform")[0].reset();
      $("#loginform").dialog( "close" );
    }
  });

  $("#signbtn").on("click", function() {
    $("#loginform").dialog( "open" )
  });

  $('#login_submit').on('click', function() {
    setAutorization();
    $.ajax({
      type: "POST",
      url: "/admins/sign_in",
      data: {
        email: admin.Email,
        password: admin.Password
        },
        success:function(result) {
          alert("Sign_in");
        },
        error:function(result) {
          alert("error");
        },
        dataType: 'json'
    });
    $('#loginform')[0].reset();
    $("#loginform").dialog( "close" );
    return false;
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

  $("#admins_list").on("click", 'li', function() {
    liId = $(this).attr('id');
    liIndex = $(this).index();
    $("#admin_form").dialog( "open" );
    $('#admin_email').val(this.innerHTML);
    // getPassword();
  });

  $('#admin_delete').on('click', function() {
    $.ajax({
      url: "/admins/"+ liId,
      type: 'DELETE',
      success: function () {
        $("#admins_list li").eq(liIndex).remove();
      },
      error:function() {
        alert("Can\'t delete last admin");
      },
      dataType: 'json'
    });
    $('#admin_form')[0].reset();
    $("#admin_form").dialog( "close" );
    liId = undefined;
    return false;
  });

  $('#admin_edit').on('click', function(){
    setAdmin();
    $.ajax({
      type: "PUT",
      url: "/admins/"+ liId,
      data: {
        email: admin.Email,
        password: admin.Password,
        current_password: admin.Current_Password
      },
      success: function(result) {
        $("#admins_list li:eq("+liIndex+")").html( result.email);
      },
      error:function(result) {
        alert("error");
      },
      dataType: 'json'
    });
    $('#admin_form')[0].reset();
    $("#admin_form").dialog( "close" );
    liId = undefined;
    return false;
  });

  function getPassword() {
    $.ajax({
      type: "GET",
      url: "/admins/" + liId,
      success: function(result) {
        $('#admin_email').val(result.email);
      },
      error: function() {
        alert( "Can\'t get password");
      },
      dataType: 'json'
    });
  }

  function setNewAdmin() {
    admin = {
      Email: $("#new_admin_email").val(),
      Password: $("#new_admin_password").val()
    };
  }

  function setAdmin() {
    admin = {
      Email: $('#admin_email').val(),
      Password: $('#admin_password').val(),
      Current_Password: $("#current_password").val()
    };
  }
  function setAutorization() {
    admin = {
      Email: $('#email_input').val(),
      Password: $('#password_input').val()
    };
  }
});
