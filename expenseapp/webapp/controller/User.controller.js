sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "expenseapp/controller/API"
], (Controller,JSONModel,API) => {
  "use strict";

  return Controller.extend("expenseapp.controller.User", {
        onInit:async function(){
            const data =await API.fetchUser();
            // console.log(data);
            const userData = {
                name : data.firstName+" "+data.lastName,
                email: data.email,
                mobile: data.phone
            }
            const oUserModel =new JSONModel(userData);
            this.getView().setModel(oUserModel,"userProfile");
        }
  });
});
