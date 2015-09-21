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

var radius = (Math.min(pieChartWidth - 20, pieChartHeight - 20) / 2) - 10;

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(0);

var panelUpdated = [false, false, false];

function drawPieChart() {
    var filteredData = payload.filter(filterPayload);
    if (groupBySelected > 0) {
        filteredData = groupByAges(filteredData);
    }
    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return getData(d);
        });

    d3.select("piechart" + currentPanel).selectAll("svg").remove();
    
    //Create SVG element
    var svg = d3.select("piechart" + currentPanel)
        .append("svg")
        .attr("width", pieChartWidth)
        .attr("height", pieChartHeight);
        
    //Set up groups
    var arcs = svg.selectAll("g.arc")
        .data(pie(filteredData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (pieChartWidth / 2) + "," + pieChartHeight / 2 + ")");
        
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function (d, i) {
            return getColor(i);
        })
        .attr("d", arc);

    arcs.append("text")
        .attr("transform", function (d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                h = Math.sqrt(x * x + y * y);
            return "translate(" + (x / h * (radius + 10)) + ',' +
                (y / h * (radius + 10)) + ")";
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) {
            return (d.endAngle + d.startAngle) / 2 > Math.PI ?
                "end" : "start";
        })
        .text(function (d, i) {
            return d.data.AGE;
        });

};