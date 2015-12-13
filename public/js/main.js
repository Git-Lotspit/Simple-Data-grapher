//Return an array of zeros
function zeros(n) {
    var zeroArray = [];
    for (var i = 0; i < n; i++) {
        zeroArray.push(0);
    }
    return zeroArray;
}
//Request Average Data points
$.ajax({
        method: "POST",
        //Replace with the server URL
        url: "http://localhost:8080/averageData"
    })
    .success(function(requestData) {
        var dataToPlot = JSON.parse(requestData),
            dataPoints = dataPointsBuilder(dataToPlot);

        drawAverageData("averageChart", "Average Data", sortDataPoints(dataPoints));

    });


//Request all arrays
$.ajax({
        method: "POST",
        //Replace with the server URL
        url: "http://localhost:8080/arrayData"
    })
    .success(function(requestData) {
        var dataToPlot = JSON.parse(requestData);
        var models = [];
        for (var i in dataToPlot) {
            models.push(modelBuilder(dataToPlot[i]));

        }
        drawArray("allArrays", "All Arrays Availables", models);

    });

//Request just one array
$.ajax({
        method: "POST",
        dataType: 'json',
        data: {
            fileName: "model0"
        },
        //Replace with the server URL
        url: "http://localhost:8080/arrayData"
    })
    .success(function(requestData) {
        var dataToPlot = modelBuilder(requestData);
        drawArray("model0", "Model 0", [dataToPlot]);

    });


/*
 *@input {
 *"name":"value",
 *"name2":"value2"
 *}
 *@output [
 *{y:value,label:name},
 *{y:value2,label:name2}
 *]
 */
function dataPointsBuilder(data) {
    var output = [];

    for (var key in data) {
        output.push({
            y: data[key],
            label: key
        })
    }
    return output;
}
//Order array from min to max
function sortDataPoints(dataPoints) {
    dataPoints.sort(function(a, b) {
        return a.y - b.y;
    });
    return dataPoints;
};

//@title title of the graph
//@dataPoints set of dataPoints to draw (http://canvasjs.com/editor/?id=http://canvasjs.com/example/gallery/overview/simple-column/)
function drawAverageData(container, title, dataPoints) {
    var chart = new CanvasJS.Chart(container, {
        title: {
            text: title
        },
        axisY: {
            labelFontSize: 20,
            labelFontColor: "dimGrey"
        },
        axisX: {
            labelAngle: -30
        },
        data: [{
            type: "column",
            dataPoints: dataPoints
        }]
    });
    chart.render();

};


/*
 *@data A numeric array ex:[1,2,132,42,43]
 *@output [
 *{x:array index,y:value1},
 *{x:array index,y:value2}
 *]
 */
function modelBuilder(data) {
    var output = {
        type: "spline", //change type to bar, line, area, pie, etc
        showInLegend: true,
        dataPoints: []
    };
    for (var i in data) {
        output.dataPoints.push({
            x: parseInt(i),
            y: data[i]
        })
    }
    return output;
};

//@title title of the graph
//@models data of the line to be draw (http://canvasjs.com/editor/?id=http://canvasjs.com/example/gallery/overview/multiSeries-spline-chart/)
function drawArray(container, title, models) {

    var chart = new CanvasJS.Chart(container, {
        animationEnabled: true,
        title: {
            text: title
        },
        data: models,

        legend: {
            cursor: "pointer",
            itemclick: function(e) {
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                chart.render();
            }
        }
    });

    chart.render();
};
