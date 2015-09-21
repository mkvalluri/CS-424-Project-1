/* global currentPanel */
/* global payload */
/* global currentState */
/* global margin */
/* global $colorScale */
/* global d3 */
//////////////////////////////////////////////////////////////////////////////////
// Below code is for creating bar charts
// Author: Murali Krishna Valluri
// Date: 09/15/2015
// File: barChart.js
//////////////////////////////////////////////////////////////////////////////////

'use strict'

var x, y, xAxis, yAxis;
var minValue;
var maxValue;

// Used for resetting the Min, Max values. This is called whenver we change displaying data
// from individual ages to grouping then and vice-versa.
function resetMinMaxValues() {
    minValue = [99999999999999, 99999999999999, 99999999999999];
    maxValue = [0, 0, 0];
}

resetMinMaxValues();

//Used for calculating dimensions based on viewport width and height.
function calculateDimensions() {
    var barChartWidth = (98 * parseInt(d3.select(".barChartContainer").style("width"))) / 100,
        barChartHeight = parseInt(d3.select(".barChartContainer").style("height"));

    margin = { top: (2 * barChartHeight) / 100, right: (2 * barChartWidth) / 100, bottom: (3 * barChartHeight) / 100, left: (4 * barChartWidth) / 100 };
    width = barChartWidth - margin.left - margin.right;
    height = barChartHeight - margin.top - margin.bottom;
}

calculateDimensions();

//Used for creating SVGs which will be used by Bar charts.
function createBarChartSVGs() {

    var svg1 = d3.select("barchart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 10)
        .append("g")
        .attr("transform", "translate(" + (margin.left + 30) + ",0)");

    var svg2 = d3.select("barchart2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 10)
        .append("g")
        .attr("transform", "translate(" + (margin.left + 30) + ",0)");

    var svg3 = d3.select("barchart3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 10)
        .append("g")
        .attr("transform", "translate(" + (margin.left + 30) + ",0)");

    svg.push(svg1);
    svg.push(svg2);
    svg.push(svg3);

}

createBarChartSVGs();

//Used for calculating new scales based on the input data.
function changeScale(data) {
    x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);

    y = d3.scale.linear()
        .rangeRound([height, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    //Update the min value for that panelId in the array.
    minValue[currentPanel - 1] = d3.min(data, function (d) {
        if (d.SEX == genderSelected && d.AGE != '85' && d.AGE != '999') {
            if (groupBySelected > 0)
                return getData(d) - 10000;
            else
                return getData(d) - 1000;
        }
    });

    //Update the max value for that panelId in the array.
    maxValue[currentPanel - 1] = d3.max(data, function (d) {
        if (d.SEX == genderSelected && d.AGE != '85' && d.AGE != '999') {
            return getData(d);
        }
    });

    x.domain(data.map(function (d) {
        return d.AGE;
    }));

    y.domain([
        d3.min(minValue, function (d) {
            return d;
        }),
        d3.max(maxValue, function (d) {
            return d;
        })
    ]);

}

//Used for drawing barChart
function drawBarChart() {

    var filteredData = payload.filter(filterPayload);
    if (groupBySelected > 0) {
        filteredData = groupByAges(filteredData);
    }
    changeScale(filteredData);


    if (!barChartUpdated[currentPanel - 1]) {
        barChartUpdated[currentPanel - 1] = true;

        svg[currentPanel - 1].append("g")
            .attr("transform", "translate(" + (margin.left + 30) + ",0)");

        svg[currentPanel - 1].append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .append("text")
            .attr("transform", "translate(" + (width + 10) + ", 34)")
            .attr("x", 2)
            .attr("dx", "1em")
            .attr("text-anchor", "end")
            .text("Age");

        svg[currentPanel - 1].append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 2)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("Population");

        svg[currentPanel - 1].selectAll("rect")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("font-size", "150%")
            .attr("x", function (d) {
                return x(d.AGE);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(getData(d));
            })
            .attr("height", function (d) {
                return height - y(getData(d));
            })
            .style("fill", function (d) {
                return getColor(d.AGE);
            })
            .append("svg:title")
            .text(function (d) { return getData(d) });
    } else {

        svg[currentPanel - 1].selectAll("g.y.axis")
            .transition()
            .duration(1000)
            .call(yAxis);

        svg[currentPanel - 1].selectAll("g.x.axis")
            .transition()
            .duration(1000)
            .call(xAxis);
            
        //Select…
        var bars = svg[currentPanel - 1].selectAll("rect")
            .data(filteredData);

        //Enter…
        bars.enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.AGE);
            })
            .attr("y", function (d) {
                return y(getData(d));
            })
            .attr("width", x.rangeBand())
            .attr("height", function (d) {
                return height - y(getData(d));
            })
            .attr("fill", function (d) {
                return getColor(d.AGE);
            });
    
        //Update all rects
        bars.transition()
            .duration(1000)
            .attr("x", function (d, i) {
                return x(d.AGE);
            })
            .attr("y", function (d) {
                return y(getData(d));
            })
            .attr("width", x.rangeBand())
            .attr("height", function (d) {
                return height - y(getData(d));
            })
            .style("fill", function (d) {
                return getColor(d.AGE);
            });
            
            
        //Exit…
        bars.exit()
            .attr("x", function (d, i) {
                return x(d.AGE);
            })
            .remove();        
    }
}