describe("Users tub", function() {

  var eventSpy;

  beforeEach(function() {
    loadFixtures('index.html');
  });

  it("setUser", function() {
    expect(setUser()).toEqual(user);
  });

  describe("UserTab click", function() {

    beforeEach(function() {
      eventSpy = spyOnEvent($('#users_tab'), 'click' );
    });

    it("Tab clicked", function() {
      $('#users_tab').click();
      expect(eventSpy).toHaveBeenTriggered();
    });
  });

  describe ("validateForm", function() {

    beforeEach(function(){
      $("#firstname").val('Alex');
      $("#lastname").val('Pashchenko');
      $('#age').val(91);
      $('#maleGender').prop("checked", true);
    });

    it("country selected?", function() {
      expect($("#country").val()).not.toEqual('');
    });

    it("without first name", function() {
      $("#firstname").val('');
      expect(validateForm()).toEqual(false);
    });

    it("without last name", function() {
      $("#lastname").val('');
      expect(validateForm()).toEqual(false);
    });

    it("without age", function() {
      $('#age').val('');
      expect(validateForm()).toEqual(false);
    });

    it("with invalid age", function() {
      $('#age').val(120);
      expect(validateForm()).toEqual(false);
    });

    it("without gender", function() {
      $('#maleGender').prop("checked", false);
      expect(validateForm()).toEqual(false);
    });

    it("with  all params ", function() {
      expect(validateForm()).toEqual(true);
    });
  });

  describe("addrow", function() {

    beforeEach(function() {
      spyOn(jQuery.fn, 'prepend').and.callThrough();
    });

    it(" row prepended", function() {
      addrow();
      expect(jQuery.fn.prepend).toHaveBeenCalled()
    });

    it("row added in table", function() {
      var count = $("tbody").length;
      addrow();
      expect($("table tbody").length).toBe(count+1)
    });
  });

  describe("editSelectedRow", function() {

    beforeEach(function() {
      $("#firstname").val("afstg");
      $("#lastname").val("dhfh");
      $("#age").val("12");
      $(':radio[name=gender]').prop("checked", true);
      $(':checkbox[name=inter1]').prop("checked", true);
      $("#country option:selected")
    });

    it("change row value", function() {
       table = $("#table");
       rows = $("#table").find('tr');
       rIndex = rows.index();
      editSelectedRow();
      // $("#table").find('tr').children('td').eq(6).value = $("#firstname").value;
      // $("#table").find('tr').children('td').eq(6).value = $("#lastname").value;
      // $("#table").find('tr').children('td').eq(6).value = $("#age").value;
      // $("#table").find('tr').children('td').eq(6).value = $(':radio[name=gender]:checked').value;
      // $("#table").find('tr').children('td').eq(6).value = $(':checkbox[name=inter]:checked').map(function() {
      //   return $(this).value;
      // }).get();
      // $("#table").find('tr').children('td').eq(6).value = $("#country").value;
      debugger;
      // expect($("table tbody").length).toBe(count+1)
    });

  });


});
