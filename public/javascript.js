$(document).ready(function() {

    var interestsArr = [];
    var user;
    var maxId;
    var table = document.getElementById('table');
    var tableUsers = new Array();
    tableUsers = JSON.parse(localStorage.getItem("users"));
    if (tableUsers === null) {
      tableUsers =[];
    }
    var id = localStorage.getItem("id");
    if (id === null) {
      id = 1;
    }

    $(function() {
      $("#tabs-min").tabs();
      getUsers();
    });

    function getUsers() {
      $.ajax({
        type: "GET",
        url: "/users",
        success:function(data) {
          data.map(function(c) {
            var eachrow = "<tbody><tr>"
                     + "<td>" + c.id + "</td>"
                     + "<td>" + c.first_name + "</td>"
                     + "<td>" + c.last_name + "</td>"
                     + "<td>" + c.age + "</td>"
                     + "<td>" + c.gender + "</td>"
                     + "<td>" + c.hobbies_attributes + "</td>"
                     + "<td>" + c.title + "</td>"
                     + "</tr></tbody>";
            $('#table').prepend(eachrow);
          });
          Pagination();
        },
        error:function(result) {
          alert("error reading users");
        },
        dataType: 'json',
      });
    }

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
    }


    //validation of form data
    function validateForm() {
      if( $("#firstname").val() == '' | $('#lastname').val() == '' | $("#age").val() == '' | $("#age").val() >111) {
        alert(":Incorrect Name or Age");
        return false;
      }
      else if (!$('input[name=gender]:checked').val()) {
        alert(":Select your gender");
        return false;
      }
      else if (!$('input[name=inter]:checked').val()) {
        alert(":Select your interests");
        return false;
      }
      return true;
    }

    function addrow() {
        $('#table').prepend("<tbody><tr><td>" + maxId + "</td><td>"
                                        + user.FirstName + "</td><td>"
                                        + user.LastName +"</td><td>"
                                        + user.Age +"</td><td>"
                                        + user.Gender +"</td><td>"
                                        + user.Interests +"</td><td>"
                                        + user.Country + "</td></tr></tbody>");
    }
       //save function
    $('#btnsave').on('click', function() {
      setUser();
      if (validateForm()=== true) {
        $.ajax( {
            type: "POST",
            url: "/users",
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
              tableUsers.unshift(user);
            },
            error:function(result) {
              alert("error");
            },
            dataType: 'json'
        });
        localStorage.setItem('users', JSON.stringify(tableUsers));
        $('#frm')[0].reset();
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
      stop: function() {
        $.map($(this).find('tbody tr'), function(element){
          var itemID = element.cells[0].innerHTML;
          var itemIndex = $(element).parent('tbody').index();
          $.ajax({
            url: "/users/" + itemID,
            type: 'PUT',
            data: {
              order_num: itemIndex
            },
            beforeSend :  function(xhr) {
              setHeader(xhr);
            },
            error:function(result) {
            alert("error");
            },
            dataType: 'json'
          });
        });
      }
    });


      //Selecting row

        //deleting function
    $('#btndelete').click(function() {
      if(typeof rIndex == 'undefined') {
        alert("Select row for deleting");
        return false
      } else {
        console.log(rIndex)
        $.ajax({
          url: "/users/"+ table.rows[rIndex].cells[0].innerHTML,
          type: 'DELETE',
          async:false,
          beforeSend :  function(xhr) {
            setHeader(xhr);
          },
          success: function() {
            table.rows[rIndex].remove();
            tableUsers.splice(rIndex-1, 1);
          },
          error:function(result) {
            alert("error");
          },
          dataType: 'json'
          });
          // tableUsers.splice(rIndex-1, 1);
          localStorage.setItem("users", JSON.stringify(tableUsers))
          // table.rows[rIndex].remove();
          $('#frm')[0].reset();
          rIndex = undefined;
        }
    });

        //editing of selected array item
    function editArrayItem() {
     tableUsers[rIndex-1] = {
       FirstName: table.rows[rIndex].cells[1].innerHTML,
       LastName: table.rows[rIndex].cells[2].innerHTML,
       Age: table.rows[rIndex].cells[3].innerHTML,
       Gender: table.rows[rIndex].cells[4].innerHTML,
       Interests: table.rows[rIndex].cells[5].innerHTML,
       Country: table.rows[rIndex].cells[6].innerHTML
     };
    }

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
    $("#btnedit").on("click", function() {
      setUser();
     if(typeof rIndex == 'undefined') {
      alert("Select row for editing");
     } else if (validateForm()=== true) {
        editArrayItem();
        $.ajax({
            type: "PUT",
            url: "/users/"+ table.rows[rIndex].cells[0].innerHTML,
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
            success:function(result) {
              editSelectedRow();
              alert("Updated");
            },
            error:function(result) {
              alert("error");
            },
            dataType: 'json'
        });
        $('#frm')[0].reset();
        rIndex = undefined;
       }
     localStorage.setItem('users', JSON.stringify(tableUsers));
    });

      //Pagination function
   function Pagination() {
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
     }
     $('.pagination').on('click', function(event) {
       $('#table').find('tbody tr:has(td)').hide();
       var nBegin = ($(this).text() - 1) * recordPerPage;
       var nEnd = $(this).text() * recordPerPage - 1;
       for (var i = nBegin; i <= nEnd; i++) {
         $(tr[i]).show();
       }
     });
    };

    function setHeader(xhr) {
      xhr.setRequestHeader ('access-token', $.cookie("access-token")),
      xhr.setRequestHeader('client', $.cookie("client")),
      xhr.setRequestHeader ('expiry',$.cookie("expiry")),
      xhr.setRequestHeader ('token-type',$.cookie("token-type")),
      xhr.setRequestHeader ('uid', $.cookie("uid"));
    }
});
