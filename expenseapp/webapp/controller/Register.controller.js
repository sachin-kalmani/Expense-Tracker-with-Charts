sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], (Controller,MessageBox) => {
  "use strict";

  return Controller.extend("expenseapp.controller.App", {
      onInit() {
      },
      navLogin:function(){
        this.getOwnerComponent().getRouter().navTo("RouteLogin");
      },

    onSignupPress: function () {
      var oView = this.getView();

      var data = {
        firstname: oView.byId("firstname").getValue(),
        lastname: oView.byId("lastname").getValue(),
        email: oView.byId("email").getValue(),
        mobile: oView.byId("mobile").getValue(),
        // dob: oView.byId("dob").getValue(),
        // gender: oView.byId("gender").getSelectedButton()?.getText() || "",
        password1: oView.byId("password1").getValue(),
        password: oView.byId("password2").getValue()
      };

      var validation = this.validateInputs(data);

      if (!validation.valid) {
        MessageBox.error(validation.message);
        return;
      }
       
      var payLoadData={
        firstName: oView.byId("firstname").getValue(),
        lastName: oView.byId("lastname").getValue(),
        email: oView.byId("email").getValue(),
        phone: oView.byId("mobile").getValue(),
        password: oView.byId("password2").getValue()
      }

      // Proceed with signup logic
jQuery.ajax({
    url: "http://localhost:8088/user/sign-in",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payLoadData),
    success: function (response) {
        MessageBox.success("Signup successful!");
        this.getOwnerComponent().getRouter().navTo("RouteLogin");
    }.bind(this), // bind 'this' so getOwnerComponent works
    error: function (xhr) {
        let message;

        if (xhr.status === 0) {
            // Connection refused or server is unreachable
            message = "Unable to connect to the server. Please try again later.";
        } else if (xhr.responseText) {
            // Try to parse JSON error message
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                message = errorResponse.message || "Signup failed. Please try again.";
            } catch (e) {
                message = xhr.responseText;
            }
        } else {
            message = "An unexpected error occurred. Please try again.";
        }

        MessageBox.error(message);
        console.error("Error:", xhr);
    }
});
    },

     // 🔽 Put validateInputs here
    validateInputs: function (data) {
      const { firstname, lastname, email, mobile, password, password1 } = data;

      if (!firstname || !lastname || !email || !mobile || !password || !password1) {
        return { valid: false, message: "All Fields are required." };
      }

      const nameRegex = /^[a-zA-Z]{1,49}$/;
      if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
        return { valid: false, message: "Invalid first or last name. Use letters only." };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { valid: false, message: "Invalid email format." };
      }

      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobile)) {
        return { valid: false, message: "Invalid mobile number. Should be 10 digits and start with 6-9." };
      }

      // const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      // if (!dobRegex.test(dob)) {
      //   return { valid: false, message: "Invalid Date of Birth format. Use YYYY-MM-DD." };
      // }

      if (password !== password1) {
        return { valid: false, message: "Passwords do not match." };
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
      if (!passwordRegex.test(password)) {
        return {
          valid: false,
          message: "Password must include 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be at least 6 characters long."
        };
      }

      return { valid: true };
    }

      
  });
});