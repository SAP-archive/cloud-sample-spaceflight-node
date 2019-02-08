/**
 * Custom logic for booking-service defined in ./booking-service.cds
 * Check to restric number of passenger traveling on a space craft to 5
 */
module.exports = (srv) => {

    const {Bookings} = cds.entities('teched.flight.trip')

    srv.before ('CREATE', 'Bookings', async (req) => {
      const {DateOfTravel, Itinerary_ID, NumberOfPassengers} = req.data
      const tx = cds.transaction(req)
      const bookings = await tx.run(
         SELECT.from (Bookings).where ({ DateOfTravel, /*and*/ Itinerary_ID })
      )
      let totalPassengers = 0
      bookings.forEach(booking => { totalPassengers += booking.NumberOfPassengers })
      if (totalPassengers + NumberOfPassengers >= 5) {
        return req.error (409, "Spacecraft tickets sold out for your Date/Destination, sorry!")
      }

    })
  }