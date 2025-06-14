sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "expenseapp/controller/API",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox"
], function (Controller, API, JSONModel, MessageToast, Filter, FilterOperator, Sorter, Fragment, MessageBox) {
  "use strict";

  // Token expiration checker
  function isTokenExpired(token) {
    try {
      if (!token) return true;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (e) {
      return true;
    }
  }

  return Controller.extend("expenseapp.controller.Expense", {
        onInit: function () {
      this.refreshData(); // Optional: first time load
    },

    refreshData: async function () {
      const oToken = localStorage.getItem("authToken");
      if (!oToken || isTokenExpired(oToken)) {
        MessageToast.show("Session expired. Please login again.");
        localStorage.removeItem("authToken");
        this.getOwnerComponent().getRouter().navTo("RouteLogin");
        return;
      }

      try {
        const [expenses, categories] = await Promise.all([
          API.fetchExpense(),
          API.fetchCategories()
        ]);

        const oModel = new JSONModel({
          expenses,
          categories: categories.map(c => ({ id: c.id, name: c.name }))
        });

        this.getView().setModel(oModel);
        sap.ui.getCore().setModel(oModel, "mainExpenseModel");
        this._populateCategoryFilter(categories);  // If you have such logic
        this._updateExpenseCount();
      } catch (err) {
        MessageToast.show("Failed to refresh data.");
        console.error(err);
      }
    },
    _updateExpenseCount: function () {
  const oTable = this.byId("expenseTable");
  const oBinding = oTable.getBinding("items");
  const iCount = oBinding ? oBinding.getLength() : 0;

  oTable.setHeaderText(`Expense (${iCount})`);
},

    _populateCategoryFilter(categories) {
      const oCategorySelect = this.byId("categoryFilter");
      oCategorySelect.removeAllItems();
      oCategorySelect.addItem(new sap.ui.core.Item({ key: "", text: "All" }));
      categories.forEach(cat => {
        oCategorySelect.addItem(new sap.ui.core.Item({
          key: cat.name,
          text: cat.name
        }));
      });
    },

onEditPress: function (oEvent) {
  const oData = oEvent.getSource().getBindingContext().getObject();
  const oView = this.getView();

  // Get full categories list from main model
  const aCategories = oView.getModel().getProperty("/categories") || [];

  // Find the corresponding categoryId using categoryName
  const categoryObj = aCategories.find(cat => cat.name === oData.categoryName);
  const categoryId = categoryObj ? categoryObj.id : "";

  // Prepare data for edit model
  const oEditData = Object.assign({}, oData, {
    categoryId: categoryId
  });

  // Set the edit model
  const oEditModel = new JSONModel(oEditData);
  oView.setModel(oEditModel, "edit");

  // Create and set the categories model
  const oCategoriesModel = new JSONModel({ categories: aCategories });

  // Load the dialog
  if (!this._oEditDialog) {
    Fragment.load({
      name: "expenseapp.view.EditDialog",
      controller: this
    }).then(oDialog => {
      this._oEditDialog = oDialog;
      oView.addDependent(oDialog);
      oDialog.setModel(oEditModel, "edit");
      oDialog.setModel(oCategoriesModel, "categories");
      oDialog.open();
    });
  } else {
    this._oEditDialog.setModel(oEditModel, "edit");
    this._oEditDialog.setModel(oCategoriesModel, "categories");
    this._oEditDialog.open();
  }
}
,

    onEditSave: async function () {
      const oView = this.getView();
      const oEditData = oView.getModel("edit").getData();
      console.log(oEditData);
      const oToken = localStorage.getItem("authToken");

      if (!oToken || isTokenExpired(oToken)) {
        MessageToast.show("Session expired. Please login again.");
        localStorage.removeItem("authToken");
        this.getOwnerComponent().getRouter().navTo("RouteLogin");
        return;
      }

      try {
        const updatedExpense = await fetch(`http://localhost:8088/user/auth/expense/${oEditData.expenseId}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + oToken
          },
          body: JSON.stringify(oEditData)
        }).then(res => res.json());

        const oModel = oView.getModel();
        const aExpenses = oModel.getProperty("/expenses");
        const index = aExpenses.findIndex(e => e.expenseId === updatedExpense.expenseId);

        if (index !== -1) {
          aExpenses[index] = updatedExpense;
          oModel.setProperty("/expenses", aExpenses);
        }

        this._oEditDialog.close();
        MessageToast.show("Expense updated successfully.");
      } catch (err) {
        console.error(err);
        MessageToast.show("Update failed.");
      }
    },

    onDeletePress: function (oEvent) {
      const oContext = oEvent.getSource().getBindingContext();
      const oData = oContext.getObject();
      const oModel = this.getView().getModel();
      const oToken = localStorage.getItem("authToken");

      if (!oToken || isTokenExpired(oToken)) {
        MessageToast.show("Session expired. Please login again.");
        localStorage.removeItem("authToken");
        this.getOwnerComponent().getRouter().navTo("RouteLogin");
        return;
      }

      MessageBox.confirm("Are you sure you want to delete this expense?", {
        onClose: async (sAction) => {
          if (sAction === "OK") {
            try {
              const response = await fetch(`http://localhost:8088/user/auth/expense/${oData.expenseId}/delete`, {
                method: "DELETE",
                headers: {
                  "Authorization": "Bearer " + oToken
                }
              });

              if (!response.ok) throw new Error("Delete failed");

              const aExpenses = oModel.getProperty("/expenses").filter(e => e.expenseId !== oData.expenseId);
              oModel.setProperty("/expenses", aExpenses);
              MessageToast.show("Expense deleted");
            } catch (err) {
              console.error(err);
              MessageToast.show("Deletion failed.");
            }
          }
        }
      });
    },

    onDescriptionFilter: function (oEvent) {
      const sQuery = oEvent.getParameter("value");
      this._applyFilter("expenseDescription", FilterOperator.Contains, sQuery);
      this._updateExpenseCount();
    },

    onCategoryFilter: function (oEvent) {
      const sKey = oEvent.getSource().getSelectedKey();
      const filters = sKey ? [new Filter("categoryName", FilterOperator.EQ, sKey)] : [];
      this.byId("expenseTable").getBinding("items").filter(filters);
      this._updateExpenseCount();
    },

    onDateFilter: function (oEvent) {
      const sQuery = oEvent.getParameter("value");
      this._applyFilter("expenseRecordTime", FilterOperator.Contains, sQuery);
      this._updateExpenseCount();
    },

    _applyFilter: function (path, operator, value) {
      const oBinding = this.byId("expenseTable").getBinding("items");
      oBinding.filter([new Filter(path, operator, value)]);
    },

    onAmountSort: function (oEvent) {
      this._applySorter("amount", oEvent.getSource().getSelectedKey());
    },

    onDateSort: function (oEvent) {
      this._applySorter("expenseRecordTime", oEvent.getSource().getSelectedKey());
    },

    _applySorter: function (path, order) {
      const oBinding = this.byId("expenseTable").getBinding("items");
      const bDescending = order === "desc";
      oBinding.sort(order ? new Sorter(path, bDescending) : null);
    },

    onEditCancel: function () {
      if (this._oEditDialog) {
        this._oEditDialog.close();
      }
    }
  });
});
