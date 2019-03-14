# Exercise 04: Build a User Interface using SAP UI5 for booking space tickets

## Estimated time

30 minutes

## Objective

In this exercise, we will build a User Interface based on SAP UI5 so that users can create a booking from the UI of our app.

This exercise is structured into two parts: <br />
## [A.) Import, build and deploy the project into SAP Web IDE](./README.md#part-a-import-build-and-deploy-the-project-into-sap-web-ide) <br />
## [B.) Build the User Interface using SAP Web IDE](./README.md#part-b-build-the-user-interface-using-sap-web-ide)<br />

## Part A: Import, build and deploy the project into SAP Web IDE

In this part, we will import the locally developed code of exercise 1 to 3 into SAP Web IDE. The database and service components will be deployed to Cloud Foundry.

1. Launch the SAP Web IDE from the [Cloud cockpit](https://account.hana.ondemand.com/cockpit). You will be prompted to login, provide your credentials (Email and Password).

![Log on](./images/logon.png)

2. Choose `File` -> `Git` -> `Clone Repository`. 

![clone](./images/clone1.png)

3. Enter the repository URL that you noted down in exercise 3 part B's step 7.

Your URL should look like: `https://git.hanatrial.ondemand.com/XXXtrial/spaceflight`, where XXX is your trial user number.

![clone](./images/clone.png) 

4. You will be asked to enter the credentials once again. Enter the credentials (email and password). The authentication in step 1 is for the SAP WebIDE access, and here in this step it authorizes access to the git repository.

![clone_auth](./images/clone_auth.png) 

5. Now we will be able to see the code that was cloned into our SAP Web IDE workspace.

![project_structure](./images/project_structure.png)

6. Right click on your project, choose `Project` and then click on `Project Settings`. 

![Project Settings](./images/project_settings.png)

7. Choose the `Cloud Foundry` tab and from the list of dropdown options choose the url, `https://api.cf.eu10.hana.ondemand.com`.

![Cloud Foundry URL](./images/cf_url.png)

8. You will be prompted to login. Enter your Cloud Foundry log on credentials (same email and password).

![Cloud Foundry Org Space](./images/CFLogon.png)

The organization and space will be automatically be populated as shown. Click on `Save`.

![Cloud Foundry Org Space](./images/cf_org_space.png)

> If the Builder is not installed in your cf space, please install it by clicking on the button `Install Builder`

9. Open package.json file from the root folder, `<git_repo_name>/package.json`, and remove the highlighted lines shown below. These are lines specific to SQLite database that was used locally. As we deploy the database artifacts into SAP HANA, these lines must be removed. Also, change the value of the property __cds.requires.db.kind__ from __sqlite__ to __hana__, as shown.

![Package.json](./images/package_remove_lines.png)

10. Open the file `db/src/.hdiconfig` and change the first property plugin_version from 2.0.30.0 to 2.0.2.0. Move the folder containing the csv files from __db/csv__ to __db/src/csv__ by Cut and Paste option from the Edit context menu.

Now right click on the `db` folder of the project and click on `Build` as shown. This takes roughly about a minute.

![Build CDS](./images/build_db.png)

11. The log output can be seen in the console as below.

![Deploy to HANA](./images/deploy_hana.png)

12. In order to view the created database tables, we enable SAP HANA Database Explorer on SAP Web IDE. To do this goto `Tools` menu on the top -> choose `Preferences` -> click `Features` in the left tabs -> enter `hana database` in the search field -> Switch ON the `SAP HANA Database Explorer` as shown and click `Save`.

![DB Explorer](./images/db_explorer.png)

13. The screen will prompt to Refresh. Click `Refresh`. 

![Refresh](./images/refresh.png)

14. After the reload we will have the aditional `database explorer` tab on the left(highlighted in the screenshot). Click on this tab and the Database Explorer Connectivity popup can be seen as below:

![DB Explorer tab](./images/db_explorer_tab.png)

15. Click `Connect` button in the above image and add a HDI database container. If you are using this tab for the first time, you will have a popup as below. Click `Yes`:

![Add DB](./images/add_db_popup.png)

Else Choose the + button shown below to add a database:

![Add DB](./images/plus.png)

16. Click on the HDI Container with the name of your project and the organization `TechEd2018_CNA375-TechEd` and click `OK`.
 
![Add DB](./images/add_db.png)

17. Click on `Tables` and then on any table to see the database columns:

![Add DB](./images/hana_data_model.png)

18. Click on `Open Data` button to see the table contents:

![Database table with content](./images/table_content.png)

19. Switch to the `Development` tab of Web IDE and right click on `mta.yml` file from the root folder and click `Open MTA Editor`.

![open_mta](./images/open_mta.png)

Click on `srv` tab and then scroll down to `Requires` section and click on `cloud-sample-spaceflight-node-uaa(resource)`. Then press the delete button as shown and save the file.

![application](./images/remove_uaa.png)

20. Right click the `srv` folder and choose `Build` and then click `Build` again. 

![Build Service](./images/build_srv.png)

The log output can be seen in the console as below. 

![Deploy to HANA](./images/build_srv_output.png)

Include the following lines to the `srv/package.json` file. Note that this `package.json` file resides inside the `srv` folder. 
```
  "cds": {
    "data": {
          "driver": "hana",
          "hana": {
                "tag": "hana"
          }
      }
  }  
```

This file now looks as shown below with the added lines highlighted:

![srv package.json](./images/srv_package.png)

21. Right click the `srv` folder and choose `Run` and then choose `Run as Node.js Application`. This takes a couple of seconds as it deploys the service to cloud foundry.

![Run Service](./images/run_srv.png)

The running Node.js application can be seen here. Note down this URL to be used in the next step.

![Running Service](./images/running_srv.png)

On clicking the URL above we can see the service information.

![Running Service](./images/srv_url1.png) 

Click on the `/booking` service to access the XML metadata information of the oData service exposed. In addition the URL now is changed to http://<service_URL>/booking/$metadata

![Running Service](./images/xml_metadata.png)

Change the $metadata part of the URL to something meaningful from our exposed service such as Planets to see the JSON response: 

![JSON response](./images/JSON.png)

22. Goto [SAP Cloud Platform destinations](https://account.hana.ondemand.com/cockpit#/globalaccount/8fd39023-a237-4d71-9b6a-ed9d1719d275/neosubaccount/06b416a3-9282-4cb7-ae72-e23031b005ca/destinations) to create a destination. Press `New Destination`

![New Destination](./images/new_destination.png)

Provide the `Name` as `cna375-xxx`, where xxx is the number provided for you by the session instructors. Provide `URL` as the one noted from the last step along with the path `/booking` as shown in the screenshot. Click on `New Property` button twice to include the two properties `WebIDEEnabled` and `WebIDEUsage` with values `true` and `odata_gen` respectively. 

Leave the rest of the populated fields as it is and click `Save`.

![SAPCP Destination](./images/destination.png)

Congratulations, we successfully imported and built our data model and node service in part A of this exercise.

## Part B: Build the User Interface using SAP Web IDE

1. Right click our project and choose `New` and then `HTML5 Module`.

![html5 module](./images/html5_module.png)

2. Choose the `SAPUI5 Application` template.

![SAP UI5 Template](./images/sapui5_template.png)

3. Enter Module Name as `ui` and Namespace as `space.itineraries.company`.

![Namespace](./images/namespace.png)

4. Give the View Name as `App` and click on `Finish`.

![App View](./images/app_view.png)

5. The UI module code is generated. Expand the `ui` folder and then `webapp` folder. Within view and controller folders you can see two generated files: `App.view.xml` and `App.controller.js`

![UI code structure](./images/ui_structure.png)

6. Open the `manifest.json` file present in the webapp folder under ui. Click on `Descriptor Editor` below and then choose the `DataSources` sub-tab above. Click the + button to add a data-source.

![Manifest Data Source](./images/manifest_ds.png)

7. Choose `Service URL` from the tabs on the left. In the dropdown menu, select the destination that you created in the last step of part A of this exercise. Note that destinations created by all participants appear in the dropdown menu. In case your destination does not appear here, you may have to refresh the SAP Web IDE.

Under relative path enter `/` and click on `Test`. Once the test is successful the button gets disabled. The service is now selected and click on `Next`.

![Service URL](./images/service_url.png) 

8. Leave the selection as `Use default model` and click `Next`.

![Default Model](./images/default_model.png) 

9. Click `Finish`. Save the manifest.json file. 

![Adding data source](./images/DataSourceFinish.png)

Now go the the raw form of the `manifest.json` with clicking on __CodeEditor__ at the bottom:

![Code Editor](./images/CodeEditorManifest.png)

Navigate to top-level property `sap.ui5` (around row number 68) and then to the property `models`. Replace the value of the `groupId` setting to `"$auto"` and add a new setting `"autoExpandSelect" : true`. Both together look like this:
```json
	"groupId": "$auto",
	"autoExpandSelect" : true
```

![Manifest](./images/Manifest.png)


10. Under `view` folder, replace the code in `App.view.xml` with the below code:
```xml
<mvc:View controllerName="space.itineraries.company.ui.controller.App" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m">
	<Carousel>
		<mvc:XMLView viewName="space.itineraries.company.ui.view.ListBookings"/>
		<mvc:XMLView viewName="space.itineraries.company.ui.view.CreateBooking"/>
	</Carousel>
</mvc:View>
```
This declares two XML Views: `ListBookings` and `CreateBooking`. We will create them in the next steps.

11. Right click on the `view` folder and choose `new` -> `SAPUI5 view`.

![Create](./images/create_view.png)

12. Give the name as `CreateBooking`, click on `Next` and then `Finish`. Repeat step 11 to create another SAPUI5 view and this time give the name of the view as `ListBookings`. 

![Create Booking view](./images/CreateBooking.png)

![Finish](./images/CreateBookingFinish.png)

13. Note that 2 additional files for CreateBooking and ListBookings are added under view and controller folders for each respectively.

![Views structure](./images/addedViews.png)

14. Right click on the `ListBookings.view.xml` file and choose `Open Layout Editor`.

![Open layout editor](./images/OpenLayoutEditor.png)

This will open the modeling pane for the view as shown:

![Layout editor](./images/LayoutEditor.png)

Click on the highlighted blue XML Page to view the Page properties. Provide a Title such as `Space Itineraries Company` for the page title property on the right side.
![Page Title](./images/PageTitle.png)

15. In the `Search for control` field enter the value `list` and drag and drop the `List` control on the view.

![List control](./images/ListControl.png)

16. Select the list item on the view, by clicking on the `List Item 1` object and verify that it is selected by checking that the control chain contains `Standard List Item`:

![Select List Item](./images/SelectListItem.png)

On the right side panel, click on the `entity set` button and choose the OData service that was added in steps 6 to 9.

![Select entity set](./images/SelectEntitySet.png)

Select the option `Define entity set and set the selected control as template`.
For the field `Entity Set` select the value `/Bookings` from the drop-down.
Click the `OK` button to save the configuration.

![ConfigEntitySet](./images/ConfigEntitySet.png)

Adapt the property `Title` by clicking on the `Bind this property` button on the right side of the property.

![Change title](./images/ChangeTitle1.png)

A window with all the data fields and a text area appear to customize the title. Compose a value such as: `{CustomerName} travels from {Itinerary/Name}`. Double click the data fields to use them as a part of the text.

![Change title 2](./images/ChangeTitle2.png)

Repeat the same process for the property `Description`. Enter the value `Booking number {BookingNo} on {DateOfTravel}`.

![Change Description](./images/ChangeDescription1.png)

![Change Description](./images/ChangeDescription2.png)

And lastly, change the `type` of the list item from the properties pane to `Inactive` and save the file.

![Change Type](./images/ChangeType.png)

17. Now we will add a Refresh button. Search for the control `Button` in the list on the left-hand side of the pane and drag and drop it to the upper right corner of the view:

![Add Button](./images/AddButton.png)

Let's move to the properties of the button. First, change the text of it to `Refresh` and move to the `Events` for our button:

![Button Props](./images/ButtonProps.png)

Add behaviour for the `Press` event with choosing the option `New function`:

![New Function](./images/NewFunction.png)

In the dialog enter for the function name the value `onRefresh` and click OK:

![New Function Name](./images/NewFunctionName.png)

Now open the menu for the `Press` event once again and choose `Open in Editor`:

![Open In Editor](./images/OpenInEditor.png)

This will open the `ListBookings.controller.js` with a focus on the newly created `onRefresh` function. We will add the actual refresh logic and the function should look like this:
````javascript
onRefresh: function (oEvent) {
  this.byId("list0").getBinding("items").refresh();
}
````

18. Let us move on to the second view `CreateBooking`. Open the `CreateBooking.view.xml` file by double-clicking on it in the file structure. __Replace__ the content with the code snippet below:
```xml
<mvc:View controllerName="space.itineraries.company.ui.controller.CreateBooking" xmlns:html="http://www.w3.org/1999/xhtml"
	xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m" xmlns:semantic="sap.m.semantic" xmlns:f="sap.ui.layout.form"
	xmlns:core="sap.ui.core">
	<App>
		<pages>
			<Page id="page" title="{i18n>AppTitle}">
				<f:SimpleForm id="form" editable="true" layout="ResponsiveGridLayout" title="{i18n>createBookingPanelTitle}" labelSpanXL="4" labelSpanL="3"
					labelSpanM="4" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="4" emptySpanM="0" emptySpanS="0" columnsXL="2"
					columnsL="1" columnsM="1">
					<f:content>
						<Label text="Name" labelFor="customerNameInput"/>
						<Input id="customerNameInput" value="{CustomerName}"/>
						<Label text="Email" labelFor="emailInput"/>
						<Input id="emailInput" value="{EmailAddress}"/>
						<Label text="Choose a journey" labelFor="selectedItineraryId"/>
						<Select id="selectedItineraryId" items="{/Itineraries}" selectedKey="{Itinerary_ID}">
							<core:ListItem key="{ID}" text="{Name}"/>
						</Select>
						<Label text="Date of travel" labelFor="dateOfTravel"/>
						<DatePicker id="dateOfTravel"
							value="{ path: 'DateOfTravel', type:'sap.ui.model.type.Date', formatOptions: { style: 'medium', stringParsing: true }}"/>
						<Label text="Number of passengers" labelFor="numPassengers"/>
						<Input id="numPassengers" value="{NumberOfPassengers}"/>
						<Label text="Credit card number" labelFor="creditCard"/>
						<Input id="creditCard" value="{PaymentInfo_CardNumber}"/>
						<Label/>
						<Button text="{i18n>bookButtonText}" press="onBook" width="15%"/>
					</f:content>
				</f:SimpleForm>
			</Page>
		</pages>
	</App>
</mvc:View>
```

19. Open the `CreateBooking.controller.js` file under `controller` folder and __replace__ the contents with the following code snippet and save the file:
```js
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("space.itineraries.company.ui.controller.CreateBooking", {
		_createNewEntity: function (oView, isOnInit) {
			var oModel = isOnInit ? this.getOwnerComponent().getModel() : oView.getModel(),
				oListBinding = oModel.bindList("/Bookings", undefined, undefined, undefined, {
					$$updateGroupId: "updateGroup"
				});

			var oContext = oListBinding.create({
				BookingNo: (Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)).toUpperCase(),
				CustomerName: "",
				EmailAddress: "",
				DateOfTravel: new Date().toJSON(),
				Cost: Math.floor((Math.random() * (3000 - 1000) + 1000)).toString(),
				NumberOfPassengers: 0,
				Itinerary_ID: "",
				PaymentInfo_CardNumber: ""
			});
			oView.setBindingContext(oContext);
		},
		onInit: function () {
			this._createNewEntity(this.getView(), true);
		},

		onBook: function () {
			var that = this,
				oView = this.getView(),
				oModel = oView.getModel();
			
			oModel.submitBatch("updateGroup");

			oView.getBindingContext().created().then(function () {
				MessageToast.show("Booking created");
				that._createNewEntity(oView, false);
			});
		}
	});
});
```
20. Under i18n folder, __replace__ the contents in `i18n.properties` file with the following values and save the file:
```
createBookingPanelTitle=Create a booking
bookButtonText=Book
AppTitle=Space Itineraries Company
``` 

21. Now right click the `ui` folder and `Run as a Web Application`. 

![Run UI](./images/run_ui.png) 

22. Now bookings can be viewed and created from the UI. Note that initially the bookings list may be empty as there are no bookings created yet.

![Web UI](./images/UIScreen1.png)

![Web UI](./images/UIScreen2.png)

Congratulations. We just built a UI for our Space travel bookings app. In the next exercise we will build and deploy the full-stack application to SAP Cloud Platform.

Click [here](../exercise05/README.md) to continue with Exercise 5.
