  $(document).ready(function(){

    var interestsArr = ['programming', 'travels', 'music', 'painting', 'dancing', 'reading', 'driving', 'fitness',
    'cookery', 'drinking'];
    var user;
    var table = document.getElementById('table');
    var tableUsers = new Array();
    sortedTab = [];
    tableUsers = JSON.parse(localStorage.getItem("users"));
    if (tableUsers === null){
      tableUsers =[];
    }
    var id = localStorage.getItem("id");
    if (id === null) {
      id = 1;
    }

    //get data from array into table rows
    $(function GetTable() {
      $.each(tableUsers, function (index, data) {
        var eachrow = "<tbody><tr>"
                 + "<td>" + data.Id + "</td>"
                 + "<td>" + data.FirstName + "</td>"
                 + "<td>" + data.LastName + "</td>"
                 + "<td>" + data.Age + "</td>"
                 + "<td>" + data.Gender + "</td>"
                 + "<td>" + data.Interests + "</td>"
                 + "<td>" + data.Country + "</td>"
                 + "</tr></tbody>";
        $('#table').append(eachrow);
      });
    });

    //set user object
    function setUser() {
        user ={
          Id : id,
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
    function valodateForm() {
      if($("#firstname").val() == '' | $('#lastname').val() == '' | $("#age").val() == '' | $("#age").val() >111){
        alert(":Incorrect Name or Age");
        GetTable();
        return false;
      }
      else if (!$('input[name=gender]:checked').val() ) {
        alert(":Select your gender");
        GetTable();
        return false;
      }
      else if (!$('input[name=inter]:checked').val()){
        alert(":Select your interests");
        GetTable();
        return false;
      }
      return true;
    }


    //add new row to table
    function addrow() {
      $('#table').prepend("<tbody><tr><td>" + user.Id + "</td><td>"
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
      if (valodateForm()=== true){
          tableUsers.unshift(user);
          localStorage.setItem('users', JSON.stringify(tableUsers));
          addrow();
          $('#frm')[0].reset();
          id++;
          localStorage.setItem("id", id);
          Pag();
          return false;
        }
    });

      //save sorted array
      function saveSort() {
        sortedTab=[];
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
        $('#table').sortable({
            nested: true,
            containerPath: "td",
            containerSelector: '.table',
            itemPath: '> tbody',
            itemSelector: 'tr',
            placeholder: '',
            revert: true,
            update: function(){
              saveSort();
              localStorage.setItem("users", JSON.stringify(sortedTab));
             }
          });


          //Selecting row
        $(document).on('click','tr', function() {
          for(var i = 1; i < table.rows.length; i++)
          {
            table.rows[i].onclick = function()
              {
                rIndex = this.rowIndex;
                for(interest of interestsArr){
                  $("#"+interest).prop('checked', false);
                }
                document.getElementById("firstname").value = this.cells[1].innerHTML;
                document.getElementById("lastname").value = this.cells[2].innerHTML;
                document.getElementById("age").value = this.cells[3].innerHTML;
                if(this.cells[4].innerText == 'male'){
                  $("#maleGender").prop("checked", true)
                }
                else{
                  $("#femaleGender").prop("checked", true)
                }
                let checkboxValues = this.cells[5].innerText.split(',')
                for(interest of interestsArr){
                  for(item of checkboxValues){
                    if(interest == item)
                    {
                      $("#"+item).prop('checked', true);
                    }
                  }
                }
                document.getElementById("country").value = this.cells[6].innerHTML;
              };
            }
          });


        //deleting function
      $('#btndelete').click(function() {
        table.rows[rIndex].remove();
        tableUsers.splice(rIndex-1, 1);
        localStorage.setItem("users", JSON.stringify(tableUsers));
        $('#frm')[0].reset();
        Pag();
        });


        //editing of selected array item
        function editArrayItem() {
          tableUsers[rIndex-1]={
              Id: table.rows[rIndex].cells[0].innerHTML,
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
        editSelectedRow();
        editArrayItem();
        localStorage.setItem('users', JSON.stringify(tableUsers));
        $('#frm')[0].reset();
        Pag();
      });


      //Pagination function

      $(function Pag() {
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
         $('button').on('click', function(event) {
           $('#table').find('tbody tr:has(td)').hide();
           var nBegin = ($(this).text() - 1) * recordPerPage;
           var nEnd = $(this).text() * recordPerPage - 1;
           for (var i = nBegin; i <= nEnd; i++)
           {
             $(tr[i]).show();
           }
         });
      });
});
