$(document).ready(function() {

    var interestsArr = [];
    var user;
    var IdArray = [];
    var table = document.getElementById('table');
    var tableUsers = new Array();
    sortedTab = [];
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

    function addrow(e) {
      $('#table').prepend("<tbody><tr><td>" + e.id + "</td><td>"
                                    + e.first_name + "</td><td>"
                                    + e.last_name +"</td><td>"
                                    + e.age +"</td><td>"
                                    + e.gender +"</td><td>"
                                    + e.hobbies_attributes +"</td><td>"
                                    + e.title + "</td></tr></tbody>");
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
            success: function (result) {
                function addrow(result);
            },
            error:function(result) {
              alert("error");
            },
            dataType: 'json'
        });
        tableUsers.unshift(user);
        localStorage.setItem('users', JSON.stringify(tableUsers));
        // addrow();
        $('#frm')[0].reset();
        return false;
      }
    });

      //save sorted array
    function saveSort() {
      sortedTab = [];
      for ( var i = 1; i < table.rows.length; i++ ) {
       sortedTab.push({
         Id: table.rows[i].cells[0].innerHTML,
         FirstName: table.rows[i].cells[1].innerHTML,
         LastName: table.rows[i].cells[2].innerHTML,
         Age: table.rows[i].cells[3].innerHTML,
         Gender: table.rows[i].cells[4].innerHTML,
         Interests: table.rows[i].cells[5].innerHTML,
         Country: table.rows[i].cells[6].innerHTML
       });
      }
    }

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
      update: function() {
        localStorage.setItem("users", JSON.stringify(sortedTab));
      }
    });

      //Selecting row

        //deleting function
    $('#btndelete').click(function() {
      if(typeof rIndex == 'undefined') {
        alert("Select row for deleting");
      } else {
          $.ajax({
            url: "/users/"+ table.rows[rIndex].cells[0].innerHTML,
            type: 'DELETE',
            success: function(result) {
              alert("deleted")
            },
            error:function(result) {
              alert("error");
            },
            dataType: 'json'
          });
          table.rows[rIndex].remove();
          tableUsers.splice(rIndex-1, 1);
          localStorage.setItem("users", JSON.stringify(tableUsers));
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
     if(typeof rIndex == 'undefined') {
      alert("Select row for editing");
     } else if (validateForm()=== true) {
        editSelectedRow();
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
              success:function(result) {
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
});
