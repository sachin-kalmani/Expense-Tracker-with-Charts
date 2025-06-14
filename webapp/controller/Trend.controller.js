sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/viz/ui5/data/FlattenedDataset",
  "sap/viz/ui5/controls/common/feeds/FeedItem",
  "sap/ui/model/json/JSONModel",
  "expenseapp/controller/API"
], function (Controller, FlattenedDataset, FeedItem, JSONModel, api) {
  "use strict";

  return Controller.extend("expenseapp.controller.Trend", {
    onInit: function () {
      this._chart = this.byId("idVizFrame");
      this._chart.setVizType("stacked_column");
      this._fetchAndRenderData();
    },

    _fetchAndRenderData: async function () {
      try {
        const rawData = await api.fetchExpense();
        const filteredData = this._applyFilters(rawData);
        const stackedData = this._groupByMonthAndCategory(filteredData);

        const oModel = new JSONModel({ data: stackedData });
        this.getView().setModel(oModel);

        this._bindDataset(oModel);
        this._setFeeds();
        this._setVizProperties();
      } catch (err) {
        console.error("Error:", err);
      }
    },

    _applyFilters: function (data) {
  const selectedYear = this.getView().byId("yearFilter").getSelectedKey();
  const selectedMonth = this.getView().byId("monthFilter").getSelectedKey();

  return data.filter(item => {
    const date = new Date(item.expenseRecordTime);
    const year = date.getFullYear().toString();
    const month = date.toLocaleString("default", { month: "long" }); // e.g., "January"

    const yearMatch = !selectedYear || selectedYear === year;
    const monthMatch = !selectedMonth || selectedMonth === month;

    return yearMatch && monthMatch;
  });
}
,

    _groupByMonthAndCategory: function (data) {
      const map = {};
      data.forEach(item => {
        const date = new Date(item.expenseRecordTime);
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        const category = item.categoryName || "Uncategorized";

        const comboKey = `${key}_${category}`;
        if (!map[comboKey]) {
          map[comboKey] = {
            month: key,
            category: category,
            amount: 0
          };
        }
        map[comboKey].amount += item.amount;
      });

      return Object.values(map);
    },

    _bindDataset: function (model) {
      const oDataset = new FlattenedDataset({
        dimensions: [
          { name: "Month", value: "{month}" },
          { name: "Category", value: "{category}" }
        ],
        measures: [
          { name: "Amount", value: "{amount}" }
        ],
        data: {
          path: "/data"
        }
      });

      this._chart.setDataset(oDataset);
      this._chart.setModel(model);
    },

    _setFeeds: function () {
      this._chart.removeAllFeeds();
      this._chart.addFeed(new FeedItem({
        uid: "valueAxis",
        type: "Measure",
        values: ["Amount"]
      }));
      this._chart.addFeed(new FeedItem({
        uid: "categoryAxis",
        type: "Dimension",
        values: ["Month"]
      }));
      this._chart.addFeed(new FeedItem({
        uid: "color",
        type: "Dimension",
        values: ["Category"]
      }));
    },

    _setVizProperties: function () {
      this._chart.setVizProperties({
        plotArea: {
          dataLabel: { visible: true }
        },
        tooltip: { visible: true },
        title: {
          visible: true,
          text: "Monthly Expense Stacked by Category"
        },
        legend: {
          visible: true
        }
      });
    },

    onFilterChange: function () {
      this._fetchAndRenderData();
    },

    onChartTypeChange: function (oEvent) {
      const chartType = oEvent.getSource().getSelectedKey();
      this._chart.setVizType(chartType === "stacked_column" ? "stacked_column" : chartType);
    }
  });
});
