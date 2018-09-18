namespace teched.payment.trip;
using teched.flight.trip as flight from 'spaceflight-model/db/flight-model';
using teched.space.trip as space from 'spaceflight-model/db/space-model';

entity PaymentInfo {
    key CardNumber : String(16) not null;
    CardType      : String(15) not null;
    CVV            : Integer not null;
    CardHolder     : String(30) not null;
    CardExpiry     : DateTime not null;
}

extend flight.Bookings {
    PaymentInfo  : Association to PaymentInfo;
};