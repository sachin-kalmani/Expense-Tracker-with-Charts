sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "expenseapp/controller/API",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
], function (Controller, API, JSONModel, MessageBox) {
  "use strict";

  return Controller.extend("expenseapp.controller.Dashboard", {
    // Inline formatter
    formatter: {
      formatNumber: function (value) {
        return typeof value === "number" ? value : Number(value);
      }
    },

    onInit: async function () {
      try {
        const expenseData = await API.fetchExpense();

        // Compute total expense
        const totalAmount = this._calculateTotal(expenseData);

        // Group expense by category
        const categoryWise = this._groupByCategory(expenseData);

        // Get recent 3 transactions by date
        const recent = this._getRecentTransactions(expenseData, 3);

        // Set the processed data into a named model
        const oModel = new JSONModel({
          expenses: expenseData,
          totalAmount,
          categoryWise,
          recent
        });

        this.getView().setModel(oModel, "expenseModel");
      } catch (error) {
        console.error("Error loading expenses:", error);
        MessageBox.error("Failed to load dashboard data.");
      }
    },

    _calculateTotal: function (expenses) {
      return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    },

    _groupByCategory: function (expenses) {
      const categoryMap = {};
      expenses.forEach(exp => {
        const cat = exp.categoryName;
        categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
      });

      return Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount
      }));
    },

    _getRecentTransactions: function (expenses, count = 3) {
      return expenses
        .slice()
        .sort((a, b) => new Date(b.expenseRecordTime) - new Date(a.expenseRecordTime))
        .slice(0, count);
    }
  });
});
