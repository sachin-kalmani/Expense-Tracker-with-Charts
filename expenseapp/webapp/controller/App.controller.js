sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("expenseapp.controller.App", {
      onInit() {
         this.getOwnerComponent().getRouter().initialize();
      }
  });
});



//   onToggleTheme: function (oEvent) {
//     var bDarkMode = oEvent.getParameter("state");

//     if (bDarkMode) {
//         sap.ui.getCore().applyTheme("sap_horizon_dark"); // Dark theme
//     } else {
//         sap.ui.getCore().applyTheme("sap_horizon"); // Light theme
//     }
// }