/* global height */
/* global width */
////////////////////////////////////////////////////////////////////////////////
// Below program is for creating Pie Charts
// Author: Murali Krishna Valluri
// Date: 09/15/2015
// File: pieChart.js
////////////////////////////////////////////////////////////////////////////////

var pieChartDivWidth = parseInt(d3.select(".pieChartContainer").style("width")),
    pieChartDivHeight = parseInt(d3.select(".pieChartContainer").style("height"));

var pieChartMargin = { top: (2 * pieChartDivHeight) / 100, right: (2 * pieChartDivWidth) / 100, bottom: (pieChartDivHeight) / 100, left: (4 * pieChartDivWidth) / 100 },
    pieChartWidth = pieChartDivWidth - pieChartMargin.left - pieChartMargin.right,
    pieChartHeight = pieChartDivHeight - pieChartMargin.top - pieChartMargin.bottom;

var radius = (Math.min(pieChartWidth, pieChartHeight) / 2) - 10;

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(0);

var panelUpdated = [false, false, false];

function drawPieChart() {
    var filteredData = payload.filter(filterPayload);
    if(groupBySelected > 0) {
        filteredData = groupByAges(filteredData);        
    }
    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return getData(d);
        });

    d3.select("piechart" + currentPanel).selectAll("svg").remove();

    var svg = d3.selectAll("piechart" + currentPanel)
        .append("svg")
        .attr("width", pieChartWidth)
        .attr("height", pieChartHeight)
        .append("g")
        .attr("transform", "translate(" + (pieChartWidth / 2) + "," + pieChartHeight / 2 + ")");
        
    svg.datum(filteredData).selectAll("path")
        .data(pie)
        .enter().append("path")
        .attr("fill", function (d, i) { return getColor(i); })
        .attr("d", arc)
        .append("svg:title")
        .text(function (d) { return getData(d) })
        .each(function (d) { this._current = d; });
};