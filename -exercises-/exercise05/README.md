# Exercise 05: Deploy the application to SAP Cloud Platform Cloud Foundry environment

## Estimated time

20 minutes

## Objective

In this exercise, we will deploy the application to SAP Cloud Platform Cloud Foundry environment. The multiple components of the app is visualized and monitored from SAP Cloud Platform Cockpit.

## Exercise description


1. Inside the `ui` folder of the project, add the following lines of code to `xs-app.json`.
```,
    {
      "source": "^/booking/(.*)$",
      "destination": "backend"
    }
```
xs-app.json now looks as shown below:

![xs-app.json](./images/xsapp.png?raw=true)

2. In the project root folder, right click on `mta.yaml` file and open it using the MTA editor as shown.

![MTA Editor.json](./images/mta_editor.png?raw=true)

Choose `ui` module and scroll down to `requires` section and click on the + button and pick the option `srv_api(provider)` as shown:

![requires](./images/srv_api.png?raw=true)

Include the `destinations` value under Group. Add the following three properties as key value pairs by clicking the + button as shown:
```yaml
name: backend
url: ~{url}
forwardAuthToken: true
```
![properties](./images/properties.png?raw=true)

Finally save the `mta.yaml` file.

3. Right click at the project level and choose `Build` and again click on `Build`. 

![Build Project](./images/build_project.png?raw=true)

This will generate a multi-target archive file as shown under a folder called `mta_archives`. This may take a couple of seconds.

![MTAR generated](./images/generate_mtar.png?raw=true)

4. Right click on the .mtar file -> choose `Deploy` -> click on `Deploy to SAP Cloud Platform`.

![Deploy](./images/deploy.png?raw=true)

5. Enter the Cloud Foundry API Endpoint, Organization and Space as shown: (Space will differ for each user)

![Deploy](./images/cf_org_space.png?raw=true)

This will take around 5 to 10 minutes. And then your application is deployed to cloud foundry environment of SAP Cloud Platform.

6. Go to [SAP Cloud Platform Cockpit](https://account.hana.ondemand.com/) and navigate into the right space to see your applications running. 

![Apps](./images/apps.png?raw=true)

Congratulations, you successfully built the space travel node application using the programming model of SAP Cloud Platform!

