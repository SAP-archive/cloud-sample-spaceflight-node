# Exercise 01: Creating a new Business Application using local development tools

## Estimated time

10 minutes

## Objective

In this exercise we will learn to set up our local development environment and create a new node.js project. This will be our codebase to create the Space travel application.

## Exercise description

### Already done for the TechEd session. Proceed to Step 4 of this exercise.
1. Open the command line terminal and install cds command line tool.
```
npm i -g @sap/cds
```
Now, the following command should print the version information
```
cds --version
```
2. With the `cds init` command a new project is created. Here, let us use `cloud-sample-spaceflight-node` as the project name. In addition, the option `--modules srv,db` stating that we want to have service and db modules and the options `--mta` for the creation of a mta.yaml.

```
cds init cloud-sample-spaceflight-node --modules srv,db --mta
```

After the successful execution of the command a new directory `cloud-sample-spaceflight-node` is created together with a project structure and content within.

3. Goto [SAP Development tools page](https://tools.hana.ondemand.com/#cloud) and scroll down to the end to download the CDS extension as shown. Click on the .vsix file and the file download will begin. This may trigger the license agreement popup if you are accessing the page for the first time. Click the `I Have Read And Agree` button and proceed. In case the downloaded file is a zip archive, extract it.

![Alt text](./images/cds_plugin.png?raw=true "CDS plugin for VS Code")

![Alt text](./images/cds_plugin_license.png?raw=true "CDS plugin License Agreement")

5. Launch the Visual Studio Code (VS Code) editor from your system and click on the `Extensions` tab (last tab that is highlighted in the screenshot) on the upper left corner. Click on the icon with 3 dots to install the CDS extension that we downloaded in the previous step.

![Alt text](./images/cds_vs_code.png?raw=true "CDS plugin for VS Code")

Choose the file with an extension of .vsix that was downloaded in the previous step.

6. Once the extension is installed, a reload will be prompted. Click on `Reload Now` as shown.

![Alt text](./images/reload.png?raw=true "Reload VS Code")

7. Goto the `Explorer` tab (first tab that is highlighted in the screenshot) of VS Code editor. Choose `File` menu and then click on `Open Folder`. Navigate to the path `D:\Files\Session\CNA375\cloud-sample-spaceflight-node\`. This will open the project in VS Code as shown. 

![Alt text](./images/proj_vscode.png?raw=true)

The project contains db and srv folders which corresponds to the Database and Service modules. 

Package.json file contains the list of dependencies of the project. The "node_modules" folder contains dowloaded packages of these dependencies in our local develoment environment.

Congratulations, you just set up your local development environment and completed Exercise 1.

Click [here](../exercise02/README.md) to continue with Exercise 2.
