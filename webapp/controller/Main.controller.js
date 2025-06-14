sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/mvc/ViewType"
], function(Controller, ViewType) {
  "use strict";

  return Controller.extend("expenseapp.controller.Main", {

    onInit: function () {
      // Load Dashboard by default on init
      this.loadView("Dashboard");
    },

    loadView: function (sViewName) {
  var oApp = this.byId("mainApp");
  var sViewId = sViewName.toLowerCase();

  var oView = oApp.getPage(sViewId);
  if (!oView) {
    oView = this.getOwnerComponent().runAsOwner(function () {
      return sap.ui.view({
        id: sViewId,
        viewName: "expenseapp.view." + sViewName,
        type: ViewType.XML
      });
    });

    // Attach beforeShow to refresh data
    oView.addEventDelegate({
      onBeforeShow: function () {
        const oController = oView.getController();
        if (oController && oController.refreshData) {
          oController.refreshData(); // call your refresh method
        }
      }
    });

    oApp.addPage(oView);
  }

  oApp.to(oView);
}
,

    onItemSelect: function (oEvent) {
      const sKey = oEvent.getParameter("item").getKey();
      this.loadView(sKey.charAt(0).toUpperCase() + sKey.slice(1)); // Convert key to View name
    },
    onLogout:function(){
          localStorage.removeItem("authToken");
          this.getOwnerComponent().getRouter().navTo("RouteLogin");
    }

  });
});
