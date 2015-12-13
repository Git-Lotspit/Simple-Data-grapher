// modules =================================================
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');

// configuration ===========================================

var port = process.env.PORT || 8080; // set our port
var dataDirectory = '/plot_data'; //data Directory (it should contains only json files formed by a numeric array)
var dataFiles = {}; //it will contain the path of each file inside of the dataDirectory
var dataArrays = {}; //it will contain an object with the arrays of the files inside the dataDirectory (key name of the file)
var dataAverage = {}; //it will contain an object with the average value of each array inside the dataDirectory (key name of the file)

// server configuration  ===================================
var server = http.createServer(app);

//allow cross origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// useful functions ========================================

/*
 *Read the folder given as parameter and return an object containing:
 *{
 *   fileNameWithoutExtension1: "path to the file1" ,
 *   fileNameWithoutExtension2: "path to the file2" ,
 *   ...
 *}
 *@directory path to the folder (relative to the project folder)
 *@callback function to be executed at the end process, it has as parameter the returned object
 */
function fileLister(directory, callback) {
    var dataFiles = {};
    fs.readdir(__dirname + dataDirectory, function(err, files) {
        if (err) throw err;
        for (var i in files) {
            var currentPath = __dirname + dataDirectory + '/' + files[i];
            var fileName = files[i].replace(/\..*/g, '');
            dataFiles[fileName] = currentPath;
        }
        callback(dataFiles);

    });
}

/*
 *Read and parse the given file 
 *@filePath path to the file containing an numeric array (complete path not relative)
 *@callback function to be executed at the end process, it has two parameters (name,array) name:name of the file; array: array of the readed file
 */
function readArrayFile(filePath, callback) {
    var filePathArray = filePath.split('/');
    var fileName = filePathArray[filePathArray.length - 1].replace(/\..*/g, '');
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) throw err;
        var dataArray = JSON.parse(data);
        callback(fileName, dataArray);
    });
}

/*
 *Caculate the average value of a numeric array
 *@numericArray an array of numeric values
 *@return the average value of the given array
 */
function arrayAverage(numericArray) {
    //average calculation
    var totalSum = 0;
    for (var i in numericArray) {
        totalSum += numericArray[i];
    }
    return (totalSum / numericArray.length);
}


// routes ==================================================

//Return an array with the available files inside the dataDirectory
app.post('/availableFiles', function(req, res) {
    try {
        if (Object.keys(dataFiles).length > 0) {
            res.send(JSON.stringify(Object.keys(dataFiles)));
        } else {
            res.send('[]');
        }
    } catch (e) {
        res.send('Request not correctly done');
    }

});

//if a name of a file is given as request parameter it return the corresponding array
//if no correct name or no name given it returns the complete object dataArrays
//the post load should look like this {fileName:"<name of the file>"}
app.post('/arrayData', function(req, res) {
    try {
        if (req.body && dataArrays[req.body.fileName]) {
            res.send(JSON.stringify(dataArrays[req.body.fileName]));
        } else {
            res.send(JSON.stringify(dataArrays));
        }
    } catch (e) {
        res.send('Request not correctly done');
    }
});

//if a name of a file is given as request parameter it return the corresponding array
//if no correct name or no name given it returns the complete object dataArrays
//the post load should look like this {fileName:"<name of the file>"}
app.post('/averageData', function(req, res) {
    try {
        if (req.body && dataAverage[req.body.fileName]) {
            res.send(JSON.stringify(dataAverage[req.body.fileName]));
        } else {
            res.send(JSON.stringify(dataAverage));
        }
    } catch (e) {
        res.send('Request not correctly done');
    }
});

// Static route to the public folder
app.use(express.static('public'));

// server loop =============================================
var serverLoop = function() {
    //update the list of 
    fileLister(dataDirectory, function(files) {
        dataFiles = files;
        for (var file in dataFiles) {
            readArrayFile(dataFiles[file], function(fileName, dataArray) {
                dataArrays[fileName] = dataArray;
                dataAverage[fileName] = arrayAverage(dataArray);
            });
        }
    });
};
//initial execution
serverLoop();
//Executed each 30 seconds
setInterval(serverLoop, 30000);

// start app ===============================================
server.listen(port);
console.log('Magic happens on port ' + port); // shoutout to the user
