  window.getUsers = getUsers;

  var interestsArr = [];
  var user;
  var maxId;
  var table = document.getElementById('table');

  $(function() {
    checkAuthorize();
  });

  $('#users_tab').on('click', function(){
    getUsers();
  });

  $("#btncreate").on("click", function() {
    openForm();
  });

  function openForm() {
    $("#frm")[0].reset();
    $("#frm").show();
    $("#users_container").hide();
    $("#btnupdate").hide();
    $("#btnsave").show();
  };

  $("#usersclose").on('click', function() {
    closeForm();
  });

  function closeForm() {
    $('.form').hide();
    $("#users_container").show();
    $('.form')[0].reset();
  }

  var getUsers = function() {
    $('#table tbody').remove();
    $.ajax({
      type: "GET",
      url: "/users",
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success:function(data) {
        data.map(function(result) {
          var eachrow = "<tbody id="+result.id +"><tr>"
                   + "<td>" + result.id + "</td>"
                   + "<td>" + result.first_name + "</td>"
                   + "<td>" + result.last_name + "</td>"
                   + "<td>" + result.age + "</td>"
                   + "<td>" + result.gender + "</td>"
                   + "<td>" + result.hobbies_attributes + "</td>"
                   + "<td>" + result.title + "</td>"
                   + "<td><a class=editing><span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a> "
                   + " <a class=deleting> <span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></td>"
                   + "</tr></tbody>";
          $('#table').prepend(eachrow);
        });
        Pagination();
      },
      error:function() {
        console.log("error reading users");
      }
    });
  };

    //set user object
  function setUser() {
    user = {
      FirstName : $("#firstname").val(),
      LastName : $('#lastname').val(),
      Age : $("#age").val(),
      Gender : $(':radio[name=gender]:checked').val(),
      Interests : $(':checkbox[name=inter]:checked').map(function() {
        return $(this).val();
      }).get(),
      Country :  $("#country").val()
    };
    return user;
  }

    //validation of form data
  function validateForm() {
    if( $("#firstname").val() == '' | $('#lastname').val() == '' | $("#age").val() == '' | $("#age").val() >111) {
      // alert(":Incorrect Name or Age");
      return false;
    }
    else if (!$('input[name=gender]:checked').val()) {
      // alert(":Select your gender");
      return false;
    }
    else {
      return true;
    }
  };

  function addrow() {
    $('#table').prepend("<tbody id ="+ maxId +"><tr><td>" + maxId + "</td><td>"
                                     + user.FirstName + "</td><td>"
                                     + user.LastName +"</td><td>"
                                     + user.Age +"</td><td>"
                                     + user.Gender +"</td><td>"
                                     + user.Interests +"</td><td>"
                                     + user.Country + "</td>"
                                     + "<td><a class=editing><span class=\" glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></a>"
                                     +" <a class=deleting> <span class=\" glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></td>"
                                     + "</tr></tbody>");
  }

       //save function
  $('#btnsave').on('click', function() {
    setUser();
    if (validateForm()=== true) {
      $.ajax( {
        type: "POST",
        url: "/users",
        dataType: 'json',
        data: {
          first_name: user.FirstName,
          last_name: user.LastName,
          age: user.Age,
          gender: user.Gender,
          hobby_ids: $(':checkbox:checked').map(function() {
            return $(this).attr('id');
          }).get(),
          country_id: $("#country").children(":selected").attr("id")
        },
        beforeSend :  function(xhr) {
          setHeader(xhr);
        },
        success: function (result) {
          maxId = result.id;
          addrow();
          Pagination();
        },
        error:function() {
          alert("Invalid data or unauthorized");
        }
      });
      $('#frm')[0].reset();
      $("#frm").hide()
      $("#users_container").show();
      return false;
    }
  });

    // sortable function
  $('#table').sortable( {
    nested: true,
    containerPath: "td",
    containerSelector: '.table',
    items: 'tbody',
    itemPath: '> tbody',
    itemSelector: 'tr',
    placeholder: '',
    revert: true,
    stop:function() {
      $.map($(this).find('tbody tr'), function(element) {
        var itemID = element.cells[0].innerHTML;
        var itemIndex = $(element).parent('tbody').index();
        $.ajax( {
          url: "/users/" + itemID,
          type: 'PUT',
          dataType: 'json',
          data: {
            order_num: itemIndex
          },
          beforeSend :  function(xhr) {
            setHeader(xhr);
          },
          error:function() {
            alert("error");
          }
        });
      });
    }
  });

        //deleting function
  $('#table').on('click', 'a.deleting', function (e)  {
    e.preventDefault();
    var rowId = $(this).closest('tbody').attr('id');
    var current_row = $(this).closest('tbody');
    $.ajax({
      url: "/users/"+ rowId,
      type: 'DELETE',
      dataType: 'json',
      beforeSend :  function(xhr) {
        setHeader(xhr);
      },
      success: function() {
        current_row.remove();
        Pagination();
      },
      error:function() {
        alert("Unauthorized");
      }
    });
  });

  $('#table').on('click', 'a.editing', function (e)  {
    e.preventDefault();
    $("#frm").show()
    $("#users_container").hide();
    $("#btnupdate").show();
    $("#btnsave").hide();
  });

        //editing of selected table row
  function editSelectedRow() {
    table.rows[rIndex].cells[1].innerHTML = $("#firstname").val();
    table.rows[rIndex].cells[2].innerHTML = $("#lastname").val();
    table.rows[rIndex].cells[3].innerHTML = $("#age").val();
    table.rows[rIndex].cells[4].innerHTML = $(':radio[name=gender]:checked').val();
    table.rows[rIndex].cells[5].innerHTML = $(':checkbox[name=inter]:checked').map(function() {
      return $(this).val();
    }).get();
    table.rows[rIndex].cells[6].innerHTML = $("#country").val();
  }

    // edit function
  $("#btnupdate").on('click', function() {
    setUser();
    if (validateForm()=== true) {
      $.ajax({
        type: "PUT",
        url: "/users/"+ table.rows[rIndex].cells[0].innerHTML,
        dataType: 'json',
        async: false,
        data: {
          first_name: user.FirstName,
          last_name: user.LastName,
          age: user.Age,
          gender: user.Gender,
          hobby_ids: $(':checkbox:checked').map(function() {
            return $(this).attr("id");
          }).get(),
          country_id: $("#country").children(":selected").attr("id")
        },
        beforeSend :  function(xhr) {
          setHeader(xhr);
        },
        success:function() {
          editSelectedRow();
        },
        error:function() {
          alert("Invalid data or unauthorized");
        }
      });
      $('#frm')[0].reset();
      $("#frm").hide()
      $("#users_container").show();
      rIndex = undefined;
    }
  });

      //Pagination function
  function Pagination() {
    $('#pages').remove();
    var totalRows = $('#table').find('tbody tr:has(td)').length;
    var recordPerPage = 10;
    var totalPages = Math.ceil(totalRows / recordPerPage);
    var $pages = $('<div id="pages" class="pagin" ></div>');
    for (i = 0; i < totalPages; i++) {
      $('<button type="button" class="pagination">&nbsp;' + (i + 1) + '</button>').appendTo($pages);
    }
    $pages.appendTo('#pagin');
    $('.pagination').hover(
      function() { $(this).addClass('focus'); },
      function() { $(this).removeClass('focus'); }
    );
    $('table').find('tbody tr:has(td)').hide();
    var tr = $('table tbody tr:has(td)');
    for (var i = 0; i <= recordPerPage - 1; i++) {
      $(tr[i]).show();
    };
    $('.pagination').on('click', function(event) {
    $('#table').find('tbody tr:has(td)').hide();
      var nBegin = ($(this).text() - 1) * recordPerPage;
      var nEnd = $(this).text() * recordPerPage - 1;
      for (var i = nBegin; i <= nEnd; i++) {
        $(tr[i]).show();
      }
    });
  };

  function checkAuthorize() {
    if ($.cookie("access-token") == undefined) {
      $("#loginform").dialog( "open" );
    } else {
      $('#table').show();
      $("#tabs-min").show();
      $("#tabs-min").tabs();
      $('#signbtn').hide();
      $('#signout').show();
      getUsers();
      getCountry();
      getHobbies();
    }
  }
  
