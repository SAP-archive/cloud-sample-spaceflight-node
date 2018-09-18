/**
 * Custom logic for booking-service defined in ./booking-service.cds
 * Check to restric number of passenger traveling on a space craft to 5
 */
module.exports = function ({ teched_flight_trip_Bookings }) {

  this.before ('CREATE', teched_flight_trip_Bookings, (cds) => {

    cds.run(()=>{
       SELECT.from ('teched_flight_trip_Bookings')
        .where ({DateOfTravel: cds.data.DateOfTravel, and : {Itinerary_ID: cds.data.Itinerary_ID} })
      
    }).then(( [bookings] ) => {
        let totalPassengers = 0
        for (let booking of bookings) {
          totalPassengers = totalPassengers + booking.NumberOfPassengers
          if (totalPassengers + cds.data.NumberOfPassengers >= 5)
            cds.error (409, "Spacecraft Tickets Sold out for your Date and Destination, sorry")
        }
    })
    
  })
}