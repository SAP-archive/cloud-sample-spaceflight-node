sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v4/ODataListBinding",
  "sap/m/MessageToast"
], function (Controller, JSONModel, ODataListBinding, MessageToast) {
  "use strict";
  return Controller.extend("space.itineraries.company.ui.controller.App", {
    onInit: function () {
      var newBookingModel = new JSONModel({
        BookingNo: "",
        CustomerName: "",
        EmailAddress: "",
        DateOfTravel: "",
        Cost: null,
        NumberOfPassengers: null,
        Itinerary_ID: null,
        PaymentInfo_CardNumber: null
      });
      this.getView().setModel(newBookingModel, "newBooking");
    },

    onBook: function () {
      var oModel = this.getView().getModel(),
          newBookingModel = this.getView().getModel("newBooking"),
          oBinding = new ODataListBinding(oModel, "/Bookings");

      // get the id of the selected itinerary
      newBookingModel.setProperty("/Itinerary_ID", this.byId("selectedItineraryId").getSelectedKey());

      // assign random cost between 3000 and 1000 space money
      newBookingModel.setProperty("/Cost", Math.floor((Math.random() * (3000 - 1000) + 1000)).toString());

      // assign random string with lenght 16 for the BookingNo
      newBookingModel.setProperty("/BookingNo",
        (Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10))
          .toUpperCase());

      var oContext = oBinding.create(JSON.parse(newBookingModel.getJSON()));
      oContext.created().then(function () {      
        MessageToast.show("created");
      });
      
      // clear up the form
      Object.keys(JSON.parse(newBookingModel.getJSON())).forEach(prop => newBookingModel.setProperty(`/${prop}`, null));
    }
  });
});