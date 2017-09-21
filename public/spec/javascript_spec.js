describe("Users tub", function() {

  var eventSpy;

  beforeEach(function() {
    loadFixtures('index.html');
    loadStyleFixtures('mycss.css');
  });

  it("setUser", function() {
    expect(setUser()).toEqual(user);
  });

  describe("UserTab click", function() {

    beforeEach(function() {
      eventSpy = spyOnEvent($('#users_tab'), 'click' );
      spyOn( window, 'getUsers').and.callThrough();
    });

    it("Tab clicked", function() {
      $('#users_tab').click();
      expect(eventSpy).toHaveBeenTriggered();
    });

    it("called getUsers()", function() {
      $('#users_tab').click();
      getUsers();
      expect(window.getUsers).toHaveBeenCalled();
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

  describe("checkAuthorize", function() {

    describe("with token", function() {

      beforeEach(function() {
        $.cookie("access-token", "sfkgnd526bgkd6kYEC");
      });

      it("table visible", function() {
        checkAuthorize();
        expect($('#table')).toBeVisible();
      });

      it("sign_out button visible", function() {
        checkAuthorize();
        expect($('#signout')).toBeVisible();
      });

      it("sign_in button hidden", function() {
        checkAuthorize();
        expect($('#signbtn')).toBeHidden();
      });

      it("tabs visible", function() {
        checkAuthorize();
        expect($("#tabs-min")).toBeVisible();
      });

      it("getUsers called", function() {
        checkAuthorize();
        spyOn( window, 'getUsers').and.callThrough();
        getUsers();
        expect(window.getUsers).toHaveBeenCalled();
      });

      it("getCountry called", function() {
        checkAuthorize();
        spyOn( window, 'getCountry').and.callThrough();
        getCountry();
        expect(window.getCountry).toHaveBeenCalled();
      });

      it("getHobbies called", function() {
        checkAuthorize();
        spyOn( window, 'getHobbies').and.callThrough();
        getHobbies();
        expect(window.getHobbies).toHaveBeenCalled();
      });
    });

    it("if without token, open loginform", function() {
      spyOn($.fn, 'dialog' );
      $("#loginform").dialog("open");
      expect($.fn.dialog).toHaveBeenCalledWith("open");
    });
  });

  describe("Sortable", function() {

    it("table shoud be sortable", function() {
      spyOn($.fn, 'sortable');
      $('#table').sortable();
      expect($.fn.sortable).toHaveBeenCalled();
    });
  });

  describe("Pagination", function() {

    it("div contain pagination buttons", function() {
      Pagination();
      expect($("#pages")).toContainElement('button.pagination');
    });
  });

  describe("Create user", function() {

    beforeEach(function() {
      eventSpy = spyOnEvent($("#btncreate"), 'click' );
      checkAuthorize();
      $("#btncreate").click();
      openForm();
    });

    it("Create button clicked", function() {
      expect(eventSpy).toHaveBeenTriggered();
    });

    it("openForm() called", function() {
      spyOn( window, 'openForm').and.callThrough();
      openForm();
      expect(window.openForm).toHaveBeenCalled();
    });

    it("form visible", function() {
      expect($('#frm')).toBeVisible();
    });

    it("other page hidden", function() {
      expect($('#users_container')).toBeHidden();
    });

    it("update button hidden", function() {
      expect($("#btnupdate")).toBeHidden();
    });

    it("save button visible", function() {
      expect($("#btnsave")).toBeVisible();
    });
  });

  describe("Back from form", function() {

    beforeEach(function() {
      eventSpy = spyOnEvent($("#usersclose"), 'click' );
      checkAuthorize();
      $("#usersclose").click();
      openForm();
      closeForm();
    });

    it("Button Back clicked", function() {
      expect(eventSpy).toHaveBeenTriggered();
    });

    it('should hide form' , function() {
      expect($("#frm")).toBeHidden();
    });

    it("should show page content", function() {
      expect($("#users_container")).toBeVisible();
    });

    it("closeForm() called", function() {
      spyOn( window, 'closeForm').and.callThrough();
      closeForm();
      expect(window.closeForm).toHaveBeenCalled();
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
});
