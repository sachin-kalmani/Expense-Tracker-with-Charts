sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("expenseapp.controller.Login", {
        onRegister: function () {
            this.getOwnerComponent().getRouter().navTo("RouteRegister");
        },

        // Validate password while typing
        onPasswordLiveChange: function (oEvent) {
            var oPassword = oEvent.getParameter("value");
            var oInput = oEvent.getSource();

            var isValid = /^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(oPassword);

            if (isValid) {
                oInput.setValueState("Success");
                oInput.setValueStateText("Strong password");
            } else {
                oInput.setValueState("Error");
                oInput.setValueStateText("Password must be 8+ chars with uppercase, lowercase, digit, and special char.");
            }
        },

        // Validate and show alert on login press
        onLoginPress: function () {
            var oView = this.getView();
            var oUsername = oView.byId("usernametext").getValue().trim();
            var oPasswordInput = oView.byId("passwordtext");
            var password = oPasswordInput.getValue().trim();

            // Password regex check
            var isValidPassword = /^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

            if (!oUsername || !password) {
                MessageBox.error("Username or password must not be empty.");
                return;
            }

            if (!isValidPassword) {
                oPasswordInput.setValueState("Error");
                oPasswordInput.setValueStateText("Password must include 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be at least 6 characters long.");
                MessageBox.error("Invalid password format.");
                return;
            }

            var loginData = {
                username: oView.byId("usernametext").getValue().trim(),
                password: oPasswordInput.getValue().trim()
            }
            console.log(loginData);
            //generate token and store it in localstorage
            jQuery.ajax({
          url:"http://localhost:8088/user/login",
          method:"POST",
          contentType:"application/json",
          data:JSON.stringify(loginData),
          success:function(token){
            localStorage.setItem("authToken",token);
            MessageBox.success("Login successful!");
             this.getOwnerComponent().getRouter().navTo("RouteMain");
          }.bind(this),
          error:function(xhr)
          {
           let message;

        if (xhr.status === 0) {
            // Connection refused or server is unreachable
            message = "Unable to connect to the server. Please try again later.";
        } else if (xhr.responseText) {
            // Try to parse JSON error message
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                message = errorResponse.message || "Login failed. Please try again.";
            } catch (e) {
                message = xhr.responseText;
            }
        } else {
            message = "An unexpected error occurred. Please try again.";
        }

        MessageBox.error(message);
        console.error("Error:", xhr);
          }
        })
            // Success
                // setTimeout(()=> {
                // this.getOwnerComponent().getRouter().navTo("RouteMain");
                //     }, 2000); // 2000 milliseconds = 2 seconds
        }
    });
});
