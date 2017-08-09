  $(document).ready(function(){

      $("#btnsave").click(function() {
      var user = JSON.stringify({
        FirstName : $("#firstname").val(),
        LastName : $('#lastname').val(),
        Age : $("#age").val(),
        Gender : $(':radio[name=gender]:checked').val(),
        Interests : $(':checkbox[name=inter]:checked').map(function() {
            return $(this).val();
          }).get(),
          Country :  $("#sel1").val()
        });
        var userparse = JSON.parse(user);
        if($("#firstname").val() == '' | $('#lastname').val() == '' | $("#age").val() == ''){
          alert(":Incorrect Name or Age");
        }
        else if (!$('input[name=gender]:checked').val() ) {
          alert(":Select your gender");
        }
        else if (!$('input[name=inter]:checked').val()){
          alert(":Select your interests");}
        else {
          $('#table').prepend("<tbody><tr><td>" + userparse.FirstName + "</td><td>"
                                        + userparse.LastName +"</td><td>"
                                        + userparse.Age +"</td><td>"
                                        + userparse.Gender +"</td><td>"
                                        + userparse.Interests +"</td><td>"
                                        + userparse.Country + "</td></tr></tbody>");
          var tab = $('#table').html();
          localStorage.setItem('table', tab);
          $('#frm')[0].reset();
          return false;
        }
    });
    if (localStorage.getItem('table')) {
          $('#table').html(localStorage.getItem('table'));
      }
    $('#btndelete').click(function() {
    window.localStorage.clear();
    location.reload();
    return true;
});
  var table = document.getElementById('table');

  for(var i = 1; i < table.rows.length; i++)
  {
      table.rows[i].onclick = function()
      {
         document.getElementById("firstname").value = this.cells[0].innerHTML;
         document.getElementById("lastname").value = this.cells[1].innerHTML;
         document.getElementById("age").value = this.cells[2].innerHTML;
         document.getElementByName("gender").value = this.cells[3].innerHTML;
         document.getElementByName("inter").value = this.cells[4].innerHTML;
         document.getElementById("sel1").value = this.cells[5].innerHTML;
    };
  }
  function editRow()
              {
                  table.rows[rIndex].cells[0].innerHTML = document.getElementById("firstname").value;
                  table.rows[rIndex].cells[1].innerHTML = document.getElementById("lastname").value;
                  table.rows[rIndex].cells[2].innerHTML = document.getElementById("age").value;
                  table.rows[rIndex].cells[3].innerHTML = document.getElementByName("gender").value;
                  table.rows[rIndex].cells[4].innerHTML = document.getElementByName("inter").value;
                  table.rows[rIndex].cells[5].innerHTML = document.getElementById("sel1").value;
              }


  });
