sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel",
  "expenseapp/controller/API"
], function (Controller, MessageToast, MessageBox, JSONModel, API) {
  "use strict";

  return Controller.extend("expenseapp.controller.AddExpense", {
    onInit: async function () {
      this._initFormModel();

      try {
        const categories = await API.fetchCategories();
        const formatted = categories.map(({ id, name }) => ({ id, name }));
        this.getView().setModel(new JSONModel(formatted), "categories");
      } catch (err) {
        console.error(err);
        MessageBox.error("Failed to load categories.");
      }
    },

    _initFormModel: function () {
      const oFormModel = new JSONModel({
        amount: "",
        categoryId: "",
        expenseDescription: "",
        expenseRecordTime: new Date().toISOString().slice(0, 10) // Default to today
      });
      this.getView().setModel(oFormModel, "form");
    },

    _resetForm: function () {
      this.getView().getModel("form").setData({
        amount: "",
        categoryId: "",
        expenseDescription: "",
        expenseRecordTime: new Date().toISOString().slice(0, 10) // Reset to today
      });
    },

    onSubmitExpense: async function () {
      const formData = this.getView().getModel("form").getData();

      // Input Validation
      const isValidAmount = !isNaN(formData.amount) && parseFloat(formData.amount) > 0;
      const isValidCategory = !!formData.categoryId;
      const isValidDescription = formData.expenseDescription.trim().length > 0;
      const isValidDate = !!formData.expenseRecordTime;

      if (!isValidAmount || !isValidCategory || !isValidDescription || !isValidDate) {
        MessageBox.warning("Please fill in all required fields correctly.");
        return;
      }

      // Format date to ISO for backend
      formData.expenseRecordTime = new Date(formData.expenseRecordTime).toISOString();

      try {
        const newExpense = await API.setExpense(formData);
        MessageToast.show("Expense submitted successfully!");
        this._resetForm();

        // Update global model if present
        const oGlobalModel = sap.ui.getCore().getModel("mainExpenseModel");
        if (oGlobalModel) {
          const expenses = oGlobalModel.getProperty("/expenses") || [];
          oGlobalModel.setProperty("/expenses", [...expenses, newExpense]);
        }

        // Optional: notify other views
        // sap.ui.getCore().getEventBus().publish("expense", "newExpenseAdded", newExpense);

      } catch (err) {
        console.error("Submission Error:", err);
        MessageBox.error("Failed to submit expense.");
      }
    },

    onCategoryChange: function (oEvent) {
      const selectedKey = oEvent.getSource().getSelectedKey();
      console.log("Selected Category:", selectedKey);
    }
  });
});
  