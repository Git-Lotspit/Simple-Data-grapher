# Simple-Data-grapher
Simple project think to draw graphs in a Web Server using [CanvasJS](http://canvasjs.com/)

## Requirements
The only requirement is to have node install and running

## Installation
- Download the project/Clone the repo
- Run ```npm install``` in the console inside the project folder
- Init the server ```node server.js```
- Access to ```http://localhost:8080/```

## Configuration
- **Changing the data folder**: by default the Server will read the data from the folder *plot_data*. This can be change by modifing the config variable ```dataDirectory```, which is inside the file *server.js*
- **Change the data show**: you can modify the data availabe by adding your own *.json* files inside the data directory. The *.json* files should contain just a numeric array (only one array)

## Server API

- **availableFiles**
- **arrayData**
- **averageData**

