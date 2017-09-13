$(document).ready(function() {
  window.getAdmins = getAdmins;
  window.setHeader = setHeader;

  var liId;
  var liIndex;
  var admin;
  var token;

  $('#admins_tab').on('click', function(){
    getAdmins()
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
    $("#loginform").dialog( "open" );
  });

  $('#login_submit').on('click', function() {
    setAutorization();
    $.ajax({
      type: "POST",
      url: "/auth/sign_in",
      dataType: 'json',
      data: {
        email: admin.Email,
        password: admin.Password
      },
      success:function(output, status, xhr) {
        saveTokenInCookee(xhr);
        $('#signout').show();
        $('#signbtn').hide();
        $('#table').show();
        $("#tabs-min").show();
        $("#tabs-min").tabs();
        $("#loginform").dialog( "close" );
        $('#loginform')[0].reset();
        getUsers();
        getAdmins();
        getCountry();
        getHobbies();
      },
      error:function() {
        alert("Invalid data");
      }
    });
    $('#loginform')[0].reset();
    return false;
  });


  $('#signout').on('click', function() {
    $.ajax({
      type: "DELETE",
      url: "/auth/sign_out",
      dataType: 'json',
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      success:function() {
        RemoveCookies();
        $('#table').hide();
        $("#tabs-min").hide();
        $("#loginform").dialog( "open" );
      }
    });
    return false;
  });


  function getAdmins() {
    $('#admins_list li').remove();
    $.ajax({
      type: "GET",
      url: "/admins",
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success:function(data) {
        data.map(function(result) {
          $('#admins_list').append("<li id =" + result.id + "><span>" + result.email
           + "</span><button type=\"button\" class=\"info_btn\">"
           + "<span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button></li>");
        })
      },
      error:function() {
        console.log("error reading admins");
      }
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
      dataType: 'json',
      data: {
        email: admin.Email,
        password: admin.Password,
        password_confirmation: admin.Password_Confirm
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
        alert("Invalid data or unauthorized");
      }
    });
    $('#admin_create')[0].reset();
    $("#admin_create").dialog( "close" );
    return false;
  });


  $("#admins_list").on("click", 'button', function(event) {
    liId = $(this).parent().attr('id');
    liIndex = $(this).index();
    console.log(liId);
    $.ajax({
      url: "/admins/"+ liId,
      type: 'GET',
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success: function (result) {
        $("#dialog").dialog( "open" );
        $("#dialog").html('Admin email:  '+ result.email + "<br> ID: " +result.id);
      },
      error:function() {
        alert("Can't show this admin");
      }
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
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success: function () {
        $("#admins_list li").eq(liIndex).remove();
      },
      error:function() {
        alert("Can\'t delete last admin or unauthorized");
      }
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
      dataType: 'json',
      beforeSend : function(xhr) {
        setHeader(xhr);
      },
      data: {
        email: admin.Email,
        password: admin.Password,
        password_confirmation: admin.Password_Confirm,
        current_password: admin.Current_Password
      },
      success: function(result) {
        $("#admins_list li:eq("+liIndex+") > span").html(result.email);
      },
      error:function(result) {
        alert("Invalid data or unauthorized");
      }
    });
    $('#admin_form')[0].reset();
    $("#admin_form").dialog( "close" );
    liId = undefined;
    return false;
  });


  function setNewAdmin() {
    admin = {
      Email: $("#new_admin_email").val(),
      Password: $("#new_admin_password").val(),
      Password_Confirm: $("#new_admin_password_confirm").val()
    };
  };

  function setAdmin() {
    admin = {
      Email: $('#admin_email').val(),
      Password: $('#admin_password').val(),
      Password_Confirm: $('#admin_password_confirm').val(),
      Current_Password: $("#current_password").val()
    };
  };


  function setHeader(xhr) {
    xhr.setRequestHeader ('access-token', $.cookie("access-token")),
    xhr.setRequestHeader('client', $.cookie("client")),
    xhr.setRequestHeader ('expiry',$.cookie("expiry")),
    xhr.setRequestHeader ('token-type',$.cookie("token-type")),
    xhr.setRequestHeader ('uid', $.cookie("uid"));
  };


  function saveTokenInCookee(xhr) {
    $.cookie("access-token", xhr.getResponseHeader('access-token'));
    $.cookie("client", xhr.getResponseHeader('client'));
    $.cookie("expiry", xhr.getResponseHeader('expiry'));
    $.cookie("token-type", xhr.getResponseHeader('token-type'));
    $.cookie("uid", xhr.getResponseHeader('uid'));
  };


  function RemoveCookies() {
    $.removeCookie("access-token");
    $.removeCookie("client");
    $.removeCookie("expiry");
    $.removeCookie("token-type");
    $.removeCookie("uid");
  };


  function setAutorization() {
    admin = {
      Email: $('#email_input').val(),
      Password: $('#password_input').val()
    };
  };
});
