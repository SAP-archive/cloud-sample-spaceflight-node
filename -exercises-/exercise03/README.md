# Exercise 03: Add custom logic restricting the number of travellers in a spacecraft

## Estimated time

20 minutes

## Objective

In this exercise, we will learn to expose our data model entities as OData services. We will also include custom logic to limit the number of passengers in each space craft. 

## Exercise description

1. Rename the file inside `/srv/` folder from `my-service.cds` to `booking-service.cds` and replace the generated code with the below lines of code. This code exposes our data-model entities as oData service.
```
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
```

2. Run the following command in the terminal to serve the Booking Service:
```
cds serve all
```
Now we see the information that our service is served at the URL: http://localhost:4004 as shown below

![Alt text](./images/cds_serve_all.png?raw=true)

3. Open [this URL](http://localhost:4004/) in the browser and click on the /booking service as shown:

![Alt text](./images/oData_services.png?raw=true)

4. The XML metadata information of the exposed oData service  is seen. In addition the URL now is changed to http://localhost:4004/booking/$metadata

![Alt text](./images/xml.png?raw=true)

5. Replace the $metadata part of the URL with any of the entity names present in the code of step 1 to see the actual contents present in the different entities. For example, on changing the URL to http://localhost:4004/booking/Planets, the contents can be seen as shown below:

![Alt text](./images/planets.png?raw=true)

6. Now let us include some custom logic to ensure that not more than 5 passengers are flying in the same spacecraft, as we assume that our spacecraft capacity is 5. For simplicity sake, we assume there is one spacecraft flying every day for each itinerary in a specific space route. Create a file called booking-service.js in the same folder `/srv/booking-service.js` and add the following code:
```
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
```
7. Now we will restart our server so that it can reflect the custom logic that we just added by pressing Cntrl + C in the terminal and again running the `cds serve all` command. 

8. Now that we have our Booking Service running, let us create a booking by sending an HTTP POST request. Launch Postman app in your desktop and create a POST request with this URL: http://localhost:4004/booking/Bookings The header and body of the request should be as follows:

Header:
```
Content-Type: application/json;IEEE754Compatible=true
```
Body:
```
{
      "BookingNo"               : "20180726GA1A0",
      "Itinerary_ID"            : "1",
      "CustomerName"            : "Mark Watney",
      "EmailAddress"            : "markwatney@mars.iss",
      "DateOfTravel"            : "2018-12-02T14:00:00Z",   
      "Cost"                    : "1000.0",
      "NumberOfPassengers"      : 1,
      "PaymentInfo_CardNumber"  : "45887465625662"
}
```
Below is a screenshot showing the header details:

![Alt text](./images/post_header.png?raw=true)

Now click on Send and we can see that our booking is created successfully with a HTTP 201 success code as shown.

![Alt text](./images/post_success.png?raw=true)

9. Based on our logic, we should be able to create only upto 5 passengers on the same date and same itinerary (Assumption: 1 spacecraft per itinerary; Spacecraft capactiy: 5). Now if we try to create another booking with Number of Passengers as 5 for the same date and itinerary, it should fail with an HTTP 409 status code as shown:

![Alt text](./images/post_fail.png?raw=true)

10. In the next exercise we will deploy our data model and service to SAP Cloud Platform and build a UI for our app using SAP Web IDE. In order to do this we are first going to push the code to Git Service of SAP Cloud Platform. 

11. Launch [SAP Cloud Platform cockpit](https://account.hana.ondemand.com/) on your browser. Log on with the credentials (Email and Password) provided by the instructors of the SAP TechEd 2018 session CNA375.

![Alt text](./images/logon.png?raw=true)

12. Now click on the global account Teched2018 

![Alt text](./images/global-account.png?raw=true)

13. Choose sub-account CNA375neo

![Alt text](./images/sub-account.png?raw=true)

14. Choose services tab from the left and filter for git service. Choose `Git Service`.

![Alt text](./images/gitservice.png?raw=true)

15. Click on Go to service.

![Alt text](./images/gotogit.png?raw=true)

16. Create a repository here by clicking on New repository and enter the name as `CNA<NUMBER>`. <NUMBER> should be the User that you get for this session. Uncheck the `Create empty Commit` and click OK. The reason for creating the repository with this name is that all participants of this session will create repositores and this will help you to uniquely identify your repository. 

![Alt text](./images/git_repo_create.png?raw=true)

17. Now click on your repository and copy the Repository URL. This will be used in step 21.

![Alt text](./images/git_repo.png?raw=true)

18. Switch back to Visual studio code and open the `.gitignore` file present in the root folder of your project and append this line `cloud-sample-spaceflight-node.db` to the end, so that we do not push the local SQLite database. 

![Alt text](./images/gitignore.png?raw=true)

19. Execute the command `git init` in your terminal.

20. Execute the command `git config user.email <EMAIL>` in your terminal. `<EMAIL>` is the mail address provided for your user.

21. Execute the command `git remote add origin <URL>` in your terminal. `<URL>` is the link that was copied in step 17.

Steps 19 to 21 can be seen in the below screenshot:
![Alt text](./images/git_init.png?raw=true)

20. Click on the Source Control tab of Visual Studio Code on the left and type a message 'Source code of Space travel node app' and click on the Commit button (Tick button) as shown:

![Alt text](./images/git_commit.png?raw=true)

21. Click on the 3 dots and choose Push to and choose origin URL as shown:

![Alt text](./images/git_push1.png?raw=true)

![Alt text](./images/git_push2.png?raw=true)

Congratulations, we successfully included custom logic to our code and pushed it to a git repository. In the next exercise, we will import this code into SAP Web IDE, and build a  User Interface for the app.

Click [here](../exercise04/README.md) to continue with Exercise 4.
