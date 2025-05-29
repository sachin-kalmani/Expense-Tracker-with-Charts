sap.ui.define([
    "sap/ui/core/UIComponent",
    "expenseapp/model/models"
], function (UIComponent, models) {
    "use strict";

    return UIComponent.extend("expenseapp.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init: function () {
            // Call parent init
            UIComponent.prototype.init.apply(this, arguments);

            // Set device model
            this.setModel(models.createDeviceModel(), "device");

            // Attach route guard before route is matched
            const oRouter = this.getRouter();
            oRouter.attachBeforeRouteMatched(this._checkAuthRouteGuard, this);

            oRouter.initialize();
        },

        _checkAuthRouteGuard: function (oEvent) {
            const sRouteName = oEvent.getParameter("name");
            const token = localStorage.getItem("authToken");

            const publicRoutes = ["RouteLogin", "RouteRegister"];

            const isPublic = publicRoutes.includes(sRouteName);

            // If no token and trying to go to a protected route
            if (!token && !isPublic) {
                // Prevent loading protected view
                setTimeout(() => {
                    this.getRouter().navTo("RouteLogin", {}, true);
                }, 0);
            }

            // Optional: If already logged in and trying to access Login again, redirect
            if (token && sRouteName === "RouteLogin") {
                setTimeout(() => {
                    this.getRouter().navTo("RouteMain", {}, true);
                }, 0);
            }
        }
    });
});
