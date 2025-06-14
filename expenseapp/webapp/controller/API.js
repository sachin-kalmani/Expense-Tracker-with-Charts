sap.ui.define([], function () {
  "use strict";
  const api = "http://localhost:8088/user/auth";
  const token = localStorage.getItem("authToken");
  return {
    setExpense: async function (oExpenseData) {
      const response = await fetch(api+"/expense/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(oExpenseData)
      });
      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
      return await response.json();
    },
    fetchCategories: async function () {

      const response = await fetch(api+"/category/get", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return await response.json();
    },

    fetchExpense: async function () {

      const response = await fetch(api+"/expense/show", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Expenses");
      }
      return await response.json();
    },

    fetchUser : async function(){
      const response = await fetch(api+"/getUserDetails",{
        method:"GET",
        headers:{
          "Authorization": "Bearer " + token
        }
      });
            if (!response.ok) {
        throw new Error("Failed to fetch Expenses");
      }
      return await response.json();
    }
  };
});
