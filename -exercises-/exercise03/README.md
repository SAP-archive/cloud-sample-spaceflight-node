# Exercise 03: Add custom logic restricting the number of travellers in a spacecraft

## Estimated time

25 minutes (Part A: 15 minutes, Part B: 10 minutes)

## Objective

In this exercise, we will learn to expose our data model entities as OData services. We will also include custom logic to limit the number of passengers in each space craft.

This exercise is structured into two parts. The second part is optional: <br /><br />
## [A.) Add custom logic and expose data model entities as OData services](./README.md#part-a-add-custom-logic-and-expose-data-model-entities-as-odata-services)<br />
## [B.) Push the code to git service of SAP Cloud Platform](./README.md#part-b-push-the-code-to-git-service-of-sap-cloud-platform-optional)<br />

# Part A: Add custom logic and expose data model entities as OData services

1. Rename the file inside `cloud-sample-spaceflight-node/srv/` folder from `my-service.cds` to `booking-service.cds` and __replace__ the generated code with the below lines of code. This code exposes our data-model entities as oData service.
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

2. As now we have a service definition we need to update the database schema to correspond to our new service implementation. Go to the `package.json` and change the value of the property `"cds.requires.db.model"` from __"db"__ to __[ "db", "srv" ]__. And execute in the terminal the command `cds deploy`.

![Alt text](./images/cds_update_db.png?raw=true)

3. Let us include some custom logic to ensure that not more than 5 passengers are flying in the same spacecraft, as we assume that the spacecraft capacity is 5. For simplicity sake, we assume there is one spacecraft flying every day for each itinerary in a specific space route. Create a file called `booking-service.js` in the same folder `/cloud-sample-spaceflight-node/srv/` and add the following code. Note that this file name is same as that of the of the service created in step 1, `booking-service.cds`, except for the extension. In case the naming is different, add the annotation `@(impl:service.js)` to the `booking-service.cds` file.
```javascript
/**
 * Custom logic for booking-service defined in ./booking-service.cds
 * Check to restrict number of passenger traveling on a space craft to 5
 */
const maxpassengers = 5
module.exports = function ({ teched_flight_trip_Bookings }) {

    this.before('CREATE', teched_flight_trip_Bookings, (cds) => {

        cds.run(() => {
            if (cds.data.NumberOfPassengers > maxpassengers)
                cds.error(409, `Number of Spacecraft passengers exceeds the maximum of ${maxpassengers}`)

            SELECT.from('teched_flight_trip_Bookings')
                .where({ DateOfTravel: cds.data.DateOfTravel, and: { Itinerary_ID: cds.data.Itinerary_ID } })

        }).then(([bookings]) => {
            let totalPassengers = 0
            for (let booking of bookings) {
                totalPassengers = totalPassengers + booking.NumberOfPassengers
                if (totalPassengers + cds.data.NumberOfPassengers >= maxpassengers)
                    cds.error(409, "Spacecraft tickets sold out for your Date/Destination, sorry!")
            }
        })

    })
}
```

4. Run the following command in the terminal to serve the Booking Service:
```
cds serve all
```
Now we see the information that our service is served at the URL: http://localhost:4004 as shown below:

![Alt text](./images/cds_serve_all.png?raw=true)

5. Open [this URL](http://localhost:4004/) in the browser and click on the /booking service as shown:

![Alt text](./images/oData_services.png?raw=true)

6. The XML metadata information of the exposed oData service  is seen. In addition the URL now is changed to http://localhost:4004/booking/$metadata

![Alt text](./images/xml.png?raw=true)

7. Replace the $metadata part of the URL with `Planets` to see the actual contents present in the Astronomical Bodies entity. Hence, on changing the URL to http://localhost:4004/booking/Planets, the contents can be seen as shown below:

![Alt text](./images/planets.png?raw=true)

8.  Launch Postman app in your system. Now that we have our Booking Service running, let us create a booking by sending an HTTP POST request using Postman App. Create a POST request with this URL: http://localhost:4004/booking/Bookings The header and body of the request should be as follows:

Header:
```
Content-Type: application/json;IEEE754Compatible=true
```
Body:
```json
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
Below is a screenshot showing the request's header details:

![Alt text](./images/post_header.png?raw=true)

Now click on Send and we can see that our booking is created successfully with a HTTP 201 success code as shown.

![Alt text](./images/post_success.png?raw=true)

9. Based on our logic, we should be able to create only upto 5 passengers on the same date and same itinerary (Assumption: 1 spacecraft per itinerary; Spacecraft capactiy: 5). Now let us try to create another booking with Number of Passengers as 5 (or more) for the same date and itinerary. Replace the body of the request with the below JSON contents.
```json
{
      "BookingNo"               : "20180726GA1A1",
      "Itinerary_ID"            : "1",
      "CustomerName"            : "Captain Kirk",
      "EmailAddress"            : "markwatney@mars.iss",
      "DateOfTravel"            : "2018-12-02T14:00:00Z",   
      "Cost"                    : "5000.0",
      "NumberOfPassengers"      : 5,
      "PaymentInfo_CardNumber"  : "45887465625662"
}
```
The request should fail with an HTTP 409 status code as shown:

![Alt text](./images/post_fail.png?raw=true)

Congratulations, we successfully included custom logic to our code and exposed the data model entities as oData services. In part B of this exercise, we will create a repository and push the code to git service of SAP Cloud Platform. Part B is optional. In case you directly want to move to the next exercise, click [here](../exercise04/README.md).

# Push the code to git service of SAP Cloud Platform

1. Launch [SAP Cloud Platform cockpit](https://account.hana.ondemand.com/) on your browser. Click log on and provide your credentials (Email and Password) provided by the instructors of the SAP TechEd 2018 session CNA375. Here the example email is `cna375-XXX@teched.cloud.sap` - replace XXX with the number provided for you.

![Alt text](./images/logon.png?raw=true)

2. Click on the global account `TechEd2018` 

![Alt text](./images/global-account.png?raw=true)

3. Click on sub-account `CNA375neo` tile.

![Alt text](./images/sub-account.png?raw=true)

4. Press `Services` tab from the left and filter for `git` in the search box. Click `Git Service`.

![Alt text](./images/gitservice.png?raw=true)

5. Click on Go to service.

![Alt text](./images/gotogit.png?raw=true)

6. Create a repository here by clicking on New repository and enter the name `spaceflight`. __Uncheck the `Create empty Commit` and click `OK`.__

![Alt text](./images/git_repo_create.png?raw=true)

7. Now click on your repository and note down the Repository URL. This will be used in step 10 and in the next exercise.

![Alt text](./images/git_repo.png?raw=true)

8. Execute the command `git init` in your terminal. Make sure this command is executed at the root folder of the project.

9. Execute the command `git remote add origin <URL>` in your terminal. `<URL>` is the link that was noted in step 7. Switch to the browser, copy the URL and provide it as a parameter to this command.

The last 2 steps can be seen in the below screenshot:
![Alt text](./images/git_init.png?raw=true)

10. Click on the `Source Control` tab of VS Code editor on the left(highlighted in the screenshot) and type a message `Source code of Space travel node app` and click on the Commit button (Tick button) as shown:

![Alt text](./images/git_commit.png?raw=true)

Click on `Yes` in the popup that says "There are no staged changes to commit. Would you like to automatically stage all your changes and commit them directly".

![Alt text](./images/stage.png?raw=true)

11. Click on the 3 dots and choose `Push to...`

![Alt text](./images/git_push1.png?raw=true)

Choose the URL as shown 
![Alt text](./images/git_push2.png?raw=true)

Enter your credentials (email and password) if requested like in this example:
![Alt text](./images/repo_username.png?raw=true)

![Alt text](./images/repo_password.png?raw=true)

Congratulations, we successfully included custom logic to our code and pushed it to a git repository. In the next exercise, we will import this code into SAP Web IDE, and build a  User Interface for the app.

Click [here](../exercise04/README.md) to continue with Exercise 4.
