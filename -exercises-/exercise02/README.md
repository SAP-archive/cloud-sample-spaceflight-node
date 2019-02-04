# Exercise 02: Understand and extend the data model

## Estimated time

20 minutes

## Objective

In this exercise, we will understand and extend the data model of the [space-flight project](https://github.com/SAP/cloud-sample-spaceflight). Using this as the base model, we create tables in a local SQLite database and load data from CSV files. We will further extend the data model to include payment information for space travel bookings.

## Exercise description

1. Open the package.json file in the root folder of your project and include the following dependency under the dependencies section.
```json
    "spaceflight-model" : "git://github.com/SAP/cloud-sample-spaceflight"
```
The package.json file looks as shown below.
![Alt text](./images/package.png?raw=true)

With this dependency, we refer to the base model. Further on the exercise we will download, use it and extend it.

2. Go to `View` menu and choose `Terminal`. This invokes the Terminal within the VS Code editor.

![Alt text](./images/invoke_terminal.png?raw=true) 

3. Make sure the `package.json` file is saved and execute the command `npm install` from the Terminal of VS Code. Ensure that this command is executed from the root folder of the project in the terminal `<your-project-path>/cloud-sample-spaceflight-node/`. This will download the base model under `node_modules` from where we can reference it in our data model.

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

6. Unzip the file in your System File Explorer. Copy and paste the folder named csv into the following folder `<your-project-path>/cloud-sample-spaceflight-node/db/`. Ensure that the CSV files are under the right path: `/db/csv`.

7. Add SQLite as a development dependency.

```
npm install sqlite3 -D
```

8. Goto file `srv/my-service.cds` under the srv folder, remove all contents of this file and save it. In the next exercise we will define how to expose the service. Now execute `cds deploy db --to sqlite:cloud-sample-spaceflight-node.db` command. This command creates all entities as tables in SQLite local database and adds configurations to the `package.json`. It also inserts the content from the CSV files into the newly created database.

```
cds deploy db --to sqlite:cloud-sample-spaceflight-node.db
```
![Initializing](./images/table_initialize.png?raw=true)

9. Let us verify if the tables were created in the local SQLite database. To do this goto `View` menu and choose `Command Palette...`([SQLite plugin](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite) for VSCode is needed).

![Command Palette](./images/command_palette.png?raw=true)

Type SQLite and choose SQlite: Open Database in Explorer
![Alt text](./images/SQLite_open.png?raw=true)

Choose `cloud-sample-spaceflight-node.db` as the database and press enter. 
![Alt text](./images/open_db.png?raw=true)

This opens the `SQLITE EXPLORER` at the bottom left. Click on it and expand the database, `cloud-sample-spaceflight-node.db`, where we can see the list of tables created. `cloud-sample-spaceflight-node.db` is the name of the local SQLite database that was provided with the `cds deploy` command in step 7.

All tables are created. Note that the `PaymentInfo` table that was defined by us in our data-model.cds file is also created.

![Alt text](./images/payment_table.png?raw=true)

Right click on any of the tables and choose `Show Table` to see its contents. For example, below we can see the contents of the table `teched_space_trip_AstronomicalBodies`. Note that `teched_flight_trip_Bookings` and `teched_payment_trip_PaymentInfo` do not contain any data from  CSV files. We will create bookings in the next exercises.

![Alt text](./images/table_contents.png?raw=true)

Congratulations, you completed Exercise 2 successfully. In the next exercise let us see how to expose our table entities as oData services and how to include custom logic to create bookings.

Click [here](../exercise03/README.md) to continue with Exercise 3.
