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

  $("#adminclose").on('click', function() {
    $(this).closest('form').hide();
    $("#admins_container").show();
    $(this).closest('form')[0].reset();
  });

  $("#newadminclose").on('click', function() {
    $(this).closest('form').hide();
    $("#admins_container").show();
    $(this).closest('form')[0].reset();
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
        $('#table').show();
        $("#tabs-min").show();
        $("#tabs-min").tabs();
        $("#loginform").hide( );
        $('#loginform')[0].reset();
        getUsers();
      },
      error:function() {
        alert("Invalid data");
        $('#password_input').val('')
      }
    });
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
        $("#loginform").show();
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
          + "</span><a class=admin_edit>  <span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a>"
          +"<a class=admin_delete><span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></li>");
        })
      },
      error:function() {
        console.log("error reading admins");
      }
    });
  }

  $("#admin_add").on("click", function() {
    $("#admins_container").hide();
    $("#admin_create")[0].reset();
    $("#admin_create").show();
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
        $("#admins_list").append("<li id =" +result.id +" class =admins"+result.id+"><span>" + result.email
         + "</span><a class=admin_edit>  <span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a>"
         +"<a class=admin_delete><span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></li>");
         $("#admin_create").hide();
         $("#admins_container").show();
         $('#admin_create')[0].reset();
      },
      error:function() {
        alert("Invalid data");
         $('#admin_create')[0].reset();
      }
    });
  });

  $("#admins_list").on("click", 'li', function(event) {
    liId = $(this).attr('id');
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

  $("#admins_list").on("click", 'a.admin_edit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    liId = $(this).parent().attr('id');
    liIndex = $(this).parent().index();
    $("#admins_container").hide();
    $("#admin_form").show();
    $('#admin_email').val($(this).closest('li').find('span').text());
  });

  $("#admins_list").on("click", 'a.admin_delete', function(e) {
    e.preventDefault();
    e.stopPropagation();
    liId = $(this).closest('li').attr('id');
    var current_li = $(this).closest('li');
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
        alert("Can\'t delete this admin");
      }
    });
  });

  $('#admin_update').on('click', function(){
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
        $.cookie("uid", result.email);
        $("#admins_list li:eq("+liIndex+") > span").html(result.email);
        $('#admin_form')[0].reset();
        $("#admins_container").hide();
        $("#admin_form").show();
        liId = undefined;
        return false;
      },
      error:function(result) {
        alert("Invalid data");
        $('#admin_password').val('');
        $('#admin_password_confirm').val('');
        $("#current_password").val('');
      }
    });
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
