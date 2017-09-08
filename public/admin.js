$(document).ready(function() {

  var liId;
  var liIndex;
  var admin;
  var token;

  $( function() {
    getAdmins();
  });

  $(function() {
    if ( $.cookie("access-token") == undefined) {
      $('#signbtn').show();
      $('#signout').hide();
    }
    else {
      $('#signbtn').hide();
      $('#signout').show();
    }
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
      url: "/auth/sign_in",
      data: {
        email: admin.Email,
        password: admin.Password
      },
      success:function(output, status, xhr) {
        saveTokenInCookee(xhr);
        $('#signout').show();
        $('#signbtn').hide();
      },
      error:function() {
        alert("error");
      },
      dataType: 'json'
    });
    $('#loginform')[0].reset();
    $("#loginform").dialog( "close" );
    return false;
  });


  $('#signout').on('click', function() {
    $.ajax({
      type: "DELETE",
      url: "/auth/sign_out",
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      success:function() {
        RemoveCookies();
        alert("You are signed_out");
        $('#signout').hide();
        $('#signbtn').show();
      },
      dataType: 'json'
    });
    return false;
  });


  function getAdmins() {
    $.ajax({
      type: "GET",
      url: "/admins",
      success:function(data) {
        data.map(function(c) {
          $('#admins_list').append("<li id =" + c.id + ">" + c.email
           + "<button type=\"button\" class=\"info_btn\">"
           + "<span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button></li>");
        })
      },
      error:function() {
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
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      success:function(result) {
        alert("Admin Created");
        $("#admins_list").append("<li id =" +result.id +" class =admins"+result.id+">" + result.email
         + "<button type=\"button\" class=\"info_btn\">"
         + "<span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button></li>");
      },
      error:function() {
        alert("error");
      },
      dataType: 'json'
    });
    $('#admin_create')[0].reset();
    $("#admin_create").dialog( "close" );
    return false;
  });

  $("#admins_list").on("click", 'button', function(event) {
    liId = $(this).parent().attr('id');
    liIndex = $(this).index();
    $.ajax({
      url: "/admins/"+ liId,
      type: 'GET',
      success: function (result) {
        $("#dialog").dialog( "open" );
        $("#dialog").html('Admin email:  '+ result.email + "<br> ID: " +result.id);
      },
      error:function() {
        alert("Can't show this admin");
      },
      dataType: 'json'
    });
    event.stopPropagation();
  });

  $("#admins_list").on("click", 'li', function() {
    liId = $(this).attr('id');
    liIndex = $(this).index();
    $("#admin_form").dialog( "open" );
    $('#admin_email').val($(this).text());
  });

  $('#admin_delete').on('click', function() {
    $.ajax({
      url: "/admins/"+ liId,
      type: 'DELETE',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
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
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
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

  function setHeader(xhr) {
    xhr.setRequestHeader ('access-token', $.cookie("access-token")),
    xhr.setRequestHeader('client', $.cookie("client")),
    xhr.setRequestHeader ('expiry',$.cookie("expiry")),
    xhr.setRequestHeader ('token-type',$.cookie("token-type")),
    xhr.setRequestHeader ('uid', $.cookie("uid"));
  }

  function saveTokenInCookee(xhr) {
    $.cookie("access-token", xhr.getResponseHeader('access-token'));
    $.cookie("client", xhr.getResponseHeader('client'));
    $.cookie("expiry", xhr.getResponseHeader('expiry'));
    $.cookie("token-type", xhr.getResponseHeader('token-type'));
    $.cookie("uid", xhr.getResponseHeader('uid'));
  }
  function RemoveCookies() {
    $.removeCookie("access-token");
    $.removeCookie("client");
    $.removeCookie("expiry");
    $.removeCookie("token-type");
    $.removeCookie("uid");
  }

  function setAutorization() {
    admin = {
      Email: $('#email_input').val(),
      Password: $('#password_input').val()
    };
  }
});
