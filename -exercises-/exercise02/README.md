# Exercise 02: Understand and extend the data model

## Estimated time

20 minutes

## Objective

In this exercise, we will understand the data model of the [base space-flight project](https://github.com/SAP/cloud-sample-spaceflight). Using the base model, we create tables in a local SQLite database and load data from CSV files. We will further extend the data model to include payment information for space travel bookings.

## Exercise description

1. Open the package.json file in the root folder of your project and include the following dependencies and save.
```
    "express": "^4.16.3",
    "csvtojson": "2.0.8",
    "sqlite3": "^4.0.2",
    "spaceflight-model": "git://github.com/SAP/cloud-sample-spaceflight"
```

The package.json files looks as shown below:
![Alt text](./images/package.png?raw=true) 

2. Go to `View` menu and choose `Integrated Terminal`. This invokes the terminal within the VS Code editor.

![Alt text](./images/invoke_terminal.png?raw=true) 

3. Execute the command `npm install` from the integrated terminal of VS Code. 
```
npm install
```
![Alt text](./images/npm_install.png?raw=true)

4. Within the db folder, open the data-model.cds file and replace the generated code with the following code. We are reusing the data model of the project, [cloud-sample-spaceflight](https://github.com/SAP/cloud-sample-spaceflight).

```
using teched.flight.trip as flight from 'spaceflight-model/db/flight-model';
using teched.space.trip as space from 'spaceflight-model/db/space-model';
```
5. Now execute the cds compile command on the integrated terminal passing the data-model.cds file as a parameter. A json showing the entities that will be created can be seen.
```
cds compile db/data-model.cds
```
6. Goto package.json file present in the root folder of the project and add the following 2 lines to include the SQLite driver and URL under cds.data.model:
```
      "driver":"sqlite",            
      "url": "cloud-sample-spaceflight-node.db"
```
Save the `package.json` file, which looks as shown below:
![Alt text](./images/sql_driver.png?raw=true)

These 2 lines will deploy the data model locally into a SQLite database. Later in Exercise 4, we will deploy this to HANA service in SAP Cloud Platform.

7. Click [here](https://github.wdf.sap.corp/te18/cloud-samples-spaceflight-node/raw/master/docs/csv.zip) to download the CSV files zip folder. 

8. Unzip the file in your System File Explorer. Copy and paste the folder named csv into the following folder `<your-project-path>/<your-project-name>/db/src/`. Ensure that the CSV files are under the right path: `/db/src/csv`.

9. At the db level create a file named init.js by clicking the Create file button and giving it the name as shown. Make sure the init.js file is under the path `<your-project-path>/<your-project-name>/db/init.js`

![Alt text](./images/init.png?raw=true)

Include the following code snippet into `init.js`. This will initialize our tables with corresponding data from the path /db/src/csv
```
const cds = require('@sap/cds')
cds.connect()
const csv2json = require('csvtojson')

const csv = {
  teched_flight_trip_AircraftCodes: 'aircraftcodes',
  teched_flight_trip_Airlines: 'airlines',
  teched_flight_trip_Airports: 'airports',
  teched_flight_trip_EarthRoutes: 'earthroutes',
  teched_flight_trip_Itineraries: 'itineraries',
  teched_space_trip_AstronomicalBodies: 'astrobodies',
  teched_space_trip_SpaceFlightCompanies: 'spaceflightcompanies',
  teched_space_trip_SpaceRoutes: 'spaceroutes',
  teched_space_trip_SpacePorts: 'spaceports'
}

let chain = Promise.resolve()

for (const tableName in csv) {
  chain = chain
    .then(() => {
      return csv2json().fromFile(`./db/src/csv/${csv[tableName]}.csv`)
    })
    .then((values) => {
      return cds.run(INSERT.into(tableName).rows(values))
    })
    .then((rowCount) => {
      console.log(`Inserted successfully ${rowCount} rows in table ${tableName}`)
    })
}

chain = chain
  .then(() => {
    return cds.disconnect()
  })
```

10. Now execute `cds deploy` command. This command creates all our entities as tables in SQLite locally and executes code from init.js to initialize these tables with data from the provided CSV files. 
```
cds deploy
```
![Alt text](./images/table_initialize.png?raw=true)

11. This can be verified by accessing the local SQLite database. To do this goto `View` menu and choose `Command Palette...`.

![Alt text](./images/command_palette.png?raw=true)

Type SQLite and choose SQlite: Open Database in Explorer
![Alt text](./images/SQLite_open.png?raw=true)

Choose `cloud-sample-spaceflight-node.db` as the database and press enter. 
![Alt text](./images/open_db.png?raw=true)

This opens the SQLITE EXPLORER at the bottom left. Click on it and expand the database, `cloud-sample-spaceflight-node.db` where we can see the list of tables created. `cloud-sample-spaceflight-node.db` is the name of the local SQLite database that was provided in step 6.

![Alt text](./images/sqlite_left.png?raw=true)

Right click on any of the tables and choose `Show Table` to see its contents. Here we can see the contents of the table `teched_space_trip_AstronomicalBodies`

![Alt text](./images/table_contents.png?raw=true)

12. Now we will extend the base model. In the file, `/node_modules/spaceflight-model/db/flight-model.cds`, it can be noticed that Bookings entity does not have any information regarding payment details as shown in the screenshot below. 

![Alt text](./images/bookings.png?raw=true)

Hence we will add a new entity to our project called `PaymentInfo` and extend the `Bookings` entity from the base model to include an association to our newly created entity. This is done by adding some code to the file `/db/data-model.cds`

Include the following as the first line of the file `/db/data-model.cds`
```
namespace teched.payment.trip;
```
Append the below code to the file `/db/data-model.cds` and save the file.
```
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
```

Hence this is how our `data-model.cds` file looks now.

![Alt text](./images/dataModelExtend.png?raw=true)

13. Now compile this data model by executing the following command in the terminal:
```
cds compile ./db/data-model.cds
```
We can see PaymentInfo in addition to the tables that were created previously.

![Alt text](./images/payment_compile.png?raw=true)

14. Deploy the data model again to create the paymentinfo table locaclly. This is done by executing the following command:
```
cds deploy
```
To verify if this table was created in SQLite, click on Refresh button of SQLite Explorer, and the PaymentInfo table can be seen as below.

![Alt text](./images/payment_table.png?raw=true)

In the next exercise let us see how to expose our table entities as oData services and how to include custom logic to create bookings.

Click [here](../exercise03/README.md) to continue with Exercise 3.
