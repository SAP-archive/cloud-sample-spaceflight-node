# Scenario:

SPICY (Space Itinerary Company) is the most popular travel technology company in our milky way. Owing to the increasing demand in space travel, SPICY is now building a website where it offers users from all planets to login and book their next space flight. You, as a part of the software engineering team of SPICY, have chosen SAP Cloud Platform to build this website. 

Click [here](./-exercises-/docs/CNA375.pdf) for the presentation.

![SPICY](./-exercises-/images/scenario.png?raw=true)

### [Exercise 01: Create a new Business Application using local development tools](./-exercises-/exercise01/README.md)
In this exercise, we will learn to set up our local development environment and create a new node.js project. This will be our codebase to create the Space travel web application.

### [Exercise 02: Understand and extend the data model](./-exercises-/exercise02/README.md)
In this exercise, we will understand the data model of the [base space-flight project](https://github.com/SAP/cloud-sample-spaceflight). Using the base model, we create tables in a local SQLite database and load data from CSV files. We will further extend the data model to include payment information for space travel bookings.

### [Exercise 03: Add custom logic restricting the number of travellers in a spacecraft](./-exercises-/exercise03/README.md)
n this exercise, we will learn to expose our data model entities as OData services. We will also include custom logic to limit the number of passengers in each space craft. 

### [Exercise 04: Build a User Interface using SAP UI5 from SAP Web IDE](./-exercises-/exercise04/README.md)
In this exercise, we will import the code into SAP Web IDE and build a User Interface based on SAP UI5 so that users can create a booking from the UI of our app.

### [Exercise 05: Deploy the application to SAP Cloud Platform Cloud Foundry environment](./-exercises-/exercise05/README.md)
In this exercise, we will deploy the application to SAP Cloud Platform Cloud Foundry environment. The multiple components of the app is visualized and monitored from SAP Cloud Platform Cockpit.

## Requirements

### For SAP TechEd 2018
SAP TechEd will provide you with a full environment to develop this sample application. The instructions below are only needed if you wish to run the application in your own account on SAP Cloud Platform.

### Development in SAP Cloud Platform Web IDE

SAP Web IDE Full-Stack access is needed. For more information, see [Open SAP Web IDE](https://help.sap.com/viewer/825270ffffe74d9f988a0f0066ad59f0/CF/en-US/51321a804b1a4935b0ab7255447f5f84.html).

Read the [getting started tutorial](https://help.sap.com/viewer//65de2977205c403bbc107264b8eccf4b/Cloud/en-US/5ec8c983a0bf43b4a13186fcf59015fc.html) to learn more about working with SAP Cloud Platform Web IDE.

A **HANA instance** is needed in your account, so that you can deploy the persistence assets.

Now clone your fork of this repository (*File -> Git -> Clone Repository*).

#### Develop, Build, Deploy

To build and deploy your application or modify it and redeploy, use any of the following options:

* Build and deploy the DB module by choosing *Build* from the context menu of the db folder.

* Build and deploy the Node.js service by choosing *Run -> Run as -> Node.js application* from the context menu of the srv folder. To test the service, click the URL displayed in the Run Console. Use the endpoint of the service *clouds.products.CatalogService* to call $metadata or CRUD requests.

* Test the UI by choosing *Run -> Run as -> Web Application* from the context menu of the ui folder.

## Known Issues
None

## Support
This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.

## License

Copyright (c) 2018 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
