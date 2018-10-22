# Exercise 02: Understand and extend the data model

## Estimated time

20 minutes

## Objective

In this exercise, we will understand and extend the data model of the [space-flight project](https://github.com/SAP/cloud-sample-spaceflight). Using this as the base model, we create tables in a local SQLite database and load data from CSV files. We will further extend the data model to include payment information for space travel bookings.

## Exercise description

1. Open the package.json file in the root folder of your project and include the following dependencies under dependencies section.
```json
    "express"           : "^4.16.3",
    "csvtojson"         : "2.0.8",
    "sqlite3"           : "^4.0.2",
    "spaceflight-model" : "git://github.com/SAP/cloud-sample-spaceflight"
```

Next, add the following 2 lines to include the SQLite driver and URL under cds.data.model of the same file and save the file:
```json
      "driver"          : "sqlite",            
      "url"             : "cloud-sample-spaceflight-node.db"
```

These 2 lines will deploy the data model locally into a SQLite database.

The package.json file looks as shown below. The added lines are highlighted.
![Alt text](./images/package.png?raw=true)

2. Go to `View` menu and choose `Terminal`. This invokes the Terminal within the VS Code editor.

![Alt text](./images/invoke_terminal.png?raw=true) 

3. Make sure the `package.json` file is saved and execute the command `npm install` from the Terminal of VS Code. Ensure that this command is executed from the root folder of the project in the terminal `<your-project-path>/cloud-sample-spaceflight-node/`.
```
npm install
```
![NPM Install](./images/npm_install.png?raw=true)

4. Within the db folder, open the `data-model.cds` file and __replace__ the generated code with the following code.
```
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
```
We are reusing the data model of the project, [cloud-sample-spaceflight](https://github.com/SAP/cloud-sample-spaceflight) which can be seen in the second and third lines of code above. In step 1, the base project's git URL is added to package.json file as a dependency and in step 3, npm install downloads the base project contents into  `<your-project-path>/cloud-sample-spaceflight-node/node_modules/` folder. In the last 10 lines of [base model project's data model](https://github.com/SAP/cloud-sample-spaceflight/blob/master/db/flight-model.cds), we can notice that there is no information regarding Payment. Hence we also add a new entity called `PaymentInfo` and extend the `Bookings` entity from the base model to include an association to our newly created entity. 

The overall entity relationship of our data model is as shown below, with PaymentInfo being the newly added one:
![Alt text](./images/data_model.jpg?raw=true)

And our `data-model.cds` file looks as shown:

![Alt text](./images/dataModelExtend.png?raw=true)

5. Click [here](https://github.com/SAP/cloud-sample-spaceflight-node/raw/master/-exercises-/docs/csv.zip) to download the CSV files zip folder. 

6. Unzip the file in your System File Explorer. Copy and paste the folder named csv into the following folder `<your-project-path>/cloud-sample-spaceflight-node/db/src/`. Ensure that the CSV files are under the right path: `/db/src/csv`.

7. Inside the db folder create a file named `init.js` by clicking the Create file button and giving it the name as shown. Make sure the init.js file is under the path `<your-project-path>/cloud-sample-spaceflight-node/db/init.js`

![Initializing from CSV](./images/init.png?raw=true)

8. Include the following code snippet into `init.js` and save the file. This will initialize our tables with corresponding data from the path `/db/src/csv`
```javascript
const cds = require('@sap/cds')
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

module.exports = () => {
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

  return chain
}
```

9. Goto file `srv/my-service.cds` under the srv folder, remove all contents of this file and save it. In the next exercise we will define how to expose the service. Now execute `cds deploy` command. This command creates all entities as tables in SQLite local database. It also executes the code from `db/init.js` to initialize the tables with data from the provided CSV files. Note that cds deploy command executes code from `db/init.js`, so ensure that the file is rightly named under the right folder.
```
cds deploy
```
![Initializing](./images/table_initialize.png?raw=true)

10. Let us verify if the tables were created in the local SQLite database. To do this goto `View` menu and choose `Command Palette...`.

![Command Palette](./images/command_palette.png?raw=true)

Type SQLite and choose SQlite: Open Database in Explorer
![Alt text](./images/SQLite_open.png?raw=true)

Choose `cloud-sample-spaceflight-node.db` as the database and press enter. 
![Alt text](./images/open_db.png?raw=true)

This opens the `SQLITE EXPLORER` at the bottom left. Click on it and expand the database, `cloud-sample-spaceflight-node.db`, where we can see the list of tables created. `cloud-sample-spaceflight-node.db` is the name of the local SQLite database that was provided in `package.json` as URL for database in step 1.

All tables are created. Note that the `PaymentInfo` table that was defined by us in our data-model.cds file is also created.

![Alt text](./images/payment_table.png?raw=true)

Right click on any of the tables and choose `Show Table` to see its contents. For example, below we can see the contents of the table `teched_space_trip_AstronomicalBodies`. Note that `teched_flight_trip_Bookings` and `teched_payment_trip_PaymentInfo` do not contain any data from  CSV files. We will create bookings in the next exercises.

![Alt text](./images/table_contents.png?raw=true)

Congratulations, you completed Exercise 2 successfully. In the next exercise let us see how to expose our table entities as oData services and how to include custom logic to create bookings.

Click [here](../exercise03/README.md) to continue with Exercise 3.
