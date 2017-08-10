  $(document).ready(function(){

    var interestsArr = ['programming', 'travels', 'music', 'painting', 'dancing', 'reading', 'driving', 'fitness',
    'cookery', 'drinking']
    var user;
    var id = localStorage.getItem("id");
    if (id === null) {
      id = 1;
    }
       //save function
      $("#btnsave").click(function() {
            user = JSON.stringify({
            Id : id,
            FirstName : $("#firstname").val(),
            LastName : $('#lastname').val(),
            Age : $("#age").val(),
            Gender : $(':radio[name=gender]:checked').val(),
            Interests : $(':checkbox[name=inter]:checked').map(function() {
              return $(this).val();
            }).get(),
            Country :  $("#country").val()
          });
          var userparse = JSON.parse(user);

          //validation of form
          if($("#firstname").val() == '' | $('#lastname').val() == '' | $("#age").val() == '' | $("#age").val() >111){
          alert(":Incorrect Name or Age");
        }
        else if (!$('input[name=gender]:checked').val() ) {
          alert(":Select your gender");
        }
        else if (!$('input[name=inter]:checked').val()){
          alert(":Select your interests");}
        else {
          //Add data to table

          $('#table').prepend("<tbody><tr><td>" + userparse.Id + "</td><td>"
                                        + userparse.FirstName + "</td><td>"
                                        + userparse.LastName +"</td><td>"
                                        + userparse.Age +"</td><td>"
                                        + userparse.Gender +"</td><td>"
                                        + userparse.Interests +"</td><td>"
                                        + userparse.Country + "</td></tr></tbody>");
          var tab = $('#table').html();
          localStorage.setItem('table', tab);
          $('#frm')[0].reset();
          id++;
          localStorage.setItem("id", id);
          return false;

      }
    });
    //sorting table
        $(function () {
          $('#table').sortable({
            nested: true,
            containerPath: "td",
            containerSelector: '.table',
            itemPath: '> tbody',
            itemSelector: 'tr',
            placeholder: ''
          });
        });


      //Get data from localstorage
    if (localStorage.getItem('table')) {
          $('#table').html(localStorage.getItem('table'));
            }
    var rIndex, table = document.getElementById('table');

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

        //deleting functions
      $('#btndelete').click(function() {
        // window.localStorage.clear();
        // location.reload();
        // return true;
        table.rows[rIndex].remove();
        var tab = $('#table').html();
        localStorage.setItem('table', tab);
        $('#frm')[0].reset();
        });

        // edit function
      $("#btnedit").click(function() {
        table.rows[rIndex].cells[1].innerHTML = $("#firstname").val();
        table.rows[rIndex].cells[2].innerHTML = $("#lastname").val();
        table.rows[rIndex].cells[3].innerHTML = $("#age").val();
        table.rows[rIndex].cells[4].innerHTML = $(':radio[name=gender]:checked').val();
        table.rows[rIndex].cells[5].innerHTML = $(':checkbox[name=inter]:checked').map(function() {
            return $(this).val();
          }).get();
        table.rows[rIndex].cells[6].innerHTML = $("#country").val();
        var tab = $('#table').html();
        localStorage.setItem('table', tab);
          $('#frm')[0].reset();
    });

  });
