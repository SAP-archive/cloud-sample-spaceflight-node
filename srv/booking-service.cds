using teched.flight.trip as flight from '../db/data-model';
using teched.space.trip as space from '../db/data-model';
using teched.payment.trip as payment from '../db/data-model';

service BookingService {

    entity PaymentInfo  as projection on payment.PaymentInfo;
    entity Bookings    	as projection on flight.Bookings;
    
    @readonly entity Itineraries 	as projection on flight.Itineraries;
    @readonly entity EarthRoutes   as projection on flight.EarthRoutes;
    @readonly entity Airports      as projection on flight.Airports;
    @readonly entity Airlines      as projection on flight.Airlines;
    @readonly entity AircraftCodes as projection on flight.AircraftCodes;

    @readonly entity SpaceRoutes as projection on space.SpaceRoutes;
    @readonly entity Spaceports  as projection on space.Spaceports;
    @readonly entity Spacelines  as projection on space.SpaceFlightCompanies;
    @readonly entity Planets     as projection on space.AstronomicalBodies; 

}