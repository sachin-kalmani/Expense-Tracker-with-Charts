sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "expenseapp/controller/API",
  "sap/m/MessageToast",
    "sap/ui/core/util/Export",
  "sap/ui/core/util/ExportTypeCSV"
], function (Controller, JSONModel, api, MessageToast,Export,ExportTypeCSV) {
  "use strict";

  return Controller.extend("expenseapp.controller.Report", {
    onInit: async function () {
      this.oView = this.getView();
      this.oModel = new JSONModel();
      this.oView.setModel(this.oModel, "reportModel");
      await this._loadExpenseData();
    },

    _loadExpenseData: async function () {
      try {
        const expenseData = await api.fetchExpense();
        this._originalExpenses = expenseData;
        this._updateReportData(expenseData);
        const categories = await api.fetchCategories();
        const formatted = categories.map(({ id, name }) => ({ id, name }));
        this.getView().setModel(new JSONModel(formatted), "categories");
      } catch (err) {
        console.error("Failed to fetch expense data", err);
        MessageToast.show("Failed to load report data.");
      }
    },

    _updateReportData: function (data) {
      const summary = this._calculateSummary(data);

      this.oModel.setData({
        ...summary,
        filteredExpenses: data
      });
      // this.oView.byId("reportTable").setVisible(data.length > 0);
    },

    _calculateSummary: function (data) {
      let totalAmount = 0;
      const categoryTotals = {};
      const monthTotals = {};
      const frequencyMap = {};

      data.forEach(item => {
        const amount = item.amount || 0;
        const category = item.categoryName || "Uncategorized";
        const date = new Date(item.expenseRecordTime);
        const month = date.toLocaleString("default", { month: "long" });

        totalAmount += amount;
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        monthTotals[month] = (monthTotals[month] || 0) + amount;
        frequencyMap[category] = (frequencyMap[category] || 0) + 1;
      });

      const topCategory = this._getTopKey(categoryTotals);
      const topMonth = this._getTopKey(monthTotals);
      const mostFrequentCategory = this._getTopKey(frequencyMap);

      return {
        totalAmount: totalAmount.toFixed(2),
        topCategory,
        topMonth,
        mostFrequentCategory
      };
    },

    _getTopKey: function (obj) {
      const sorted = Object.entries(obj).sort((a, b) => b[1] - a[1]);
      return sorted[0]?.[0] || "N/A";
    },

  onDateFilter: function () {
  const fromDate = this.oView.byId("fromDate").getDateValue();
  const toDate = this.oView.byId("toDate").getDateValue();

  const filtered = this._originalExpenses.filter(item => {
    const itemDate = new Date(item.expenseRecordTime);
    itemDate.setHours(0, 0, 0, 0); // remove time part
    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    if (toDate) toDate.setHours(0, 0, 0, 0);

    return (!fromDate || itemDate >= fromDate) &&
           (!toDate || itemDate <= toDate);
  });

  this._updateReportData(filtered);

  // Show or hide table based on filter result
  const table = this.oView.byId("reportTable");
  if (table) {
    table.setVisible(filtered.length > 0);
  }
},
onCategoryFilter:function(){

},
onResetFilter:function(){
    // Clear date pickers
  this.oView.byId("fromDate").setDateValue(null);
  this.oView.byId("toDate").setDateValue(null);

  // Restore original data
  this._updateReportData(this._originalExpenses);
    const table = this.oView.byId("reportTable");
  if (table) {
    table.setVisible(false);
  }
},

    formatDate: function (dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    }
    ,onExportCSV: function () {
  const oView = this.getView();
  const oModel = oView.getModel("reportModel"); // FIXED: use named model

  if (!oModel) {
    sap.m.MessageToast.show("Model not found.");
    return;
  }

  const aData = oModel.getProperty("/filteredExpenses"); // FIXED: correct data path

  if (!aData || !aData.length) {
    sap.m.MessageToast.show("No data to export.");
    return;
  }

  const oExport = new Export({
    exportType: new ExportTypeCSV({
      separatorChar: ","
    }),
    models: oModel,
    rows: {
      path: "/filteredExpenses" // FIXED: path to filteredExpenses
    },
    columns: [
      {
        name: "Description",
        template: { content: "{expenseDescription}" }
      },
      {
        name: "Amount",
        template: { content: "{amount}" }
      },
      {
        name: "Category",
        template: { content: "{categoryName}" }
      },
      {
        name: "Date",
        template: {
          content: {
            parts: ["expenseRecordTime"],
            formatter: function (dateStr) {
              return new Date(dateStr).toLocaleDateString();
            }
          }
        }
      }
    ]
  });

  oExport.saveFile("Expense_Report").catch(function (oError) {
    sap.m.MessageToast.show("Error exporting CSV");
    console.error("Export error:", oError);
  }).then(function () {
    oExport.destroy();
  });
}

  });
});