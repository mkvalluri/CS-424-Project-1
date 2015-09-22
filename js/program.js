
//////////////////////////////////////////////////////////////////////////////////
// Below code is for the entry point and contains all the common functions.
// Author: Murali Krishna Valluri
// Date: 09/15/2015
// File: program.js
//////////////////////////////////////////////////////////////////////////////////

var currentCountry;
var currentState;
var currentPanel;

var genderSelected = "0";

var eventSelected = "0"
var yearSelected = "2010"

var groupBySelected = 0;

var payload;
var barChartUpdated = [false, false, false];

var minAge = 0;
var maxAge = 85;

var otherCountrySelected = 0;
var stateSelected = 0;
var compareByCountries = true;

var margin, width, height;

var stateSelect1 = document.getElementById("stateListSelect_1");
var stateSelect2 = document.getElementById("stateListSelect_2");
var stateSelect3 = document.getElementById("stateListSelect_3");
var stateFlag = [false, false, false];
var svg = [];

var countries = ["India", "Malaysia", "Germany", "Greece", "Syria", "UAE"];

var states = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];

states.forEach(function (element) {
    var option1 = document.createElement('option');
    var option2 = document.createElement('option');
    var option3 = document.createElement('option');
    option1.text = option2.text = option3.text = element.name;
    option1.value = option2.value = option3.value = element.name;
    stateSelect1.add(option1, states.indexOf(element) + 1);
    stateSelect2.add(option2, states.indexOf(element) + 1);
    stateSelect3.add(option3, states.indexOf(element) + 1);
}, this);

$('#genderSelect').on('change', function () {
    genderSelected = $(this).val();
    resetMinMaxValues();
    drawAllCharts();
});

$('#yearSelect').on('change', function () {
    yearSelected = $(this).val();
    resetMinMaxValues();
    drawAllCharts();
});

$('#eventSelect').on('change', function () {
    eventSelected = $(this).val();
    resetMinMaxValues();
    drawAllCharts();
});

$('#groupBySelect').on('change', function () {
    groupBySelected = $(this).val();
    resetMinMaxValues();
    drawAllCharts();
});

$('.countryListSelect').on('change', function () {
    var panelId = $(this).attr('id').split('_')[1];
    currentCountry = $(this).val();
    currentPanel = panelId;

    if (currentCountry != "US") {
        otherCountrySelected++;
        $('#compareSelect').attr("disabled", "disabled");
        stateFlag[currentPanel - 1] = true;
    } else if (currentCountry == "US") {        
        stateFlag[currentPanel - 1] = true;
    } else
    {
        otherCountrySelected--;
        if (otherCountrySelected == 0)
            $('#compareSelect').removeAttr("disabled");
        stateFlag[currentPanel - 1] = false;
    }
    drawAllCharts();
});

$('.stateListSelect').on('change', function () {
    var panelId = $(this).attr('id').split('_')[1];
    currentState = $(this).val();
    currentPanel = panelId;

    if (currentState != "0") {
        stateSelected++;
        $('#compareSelect').attr("disabled", "disabled");
        stateFlag[currentPanel - 1] = true;
    } else {
        stateSelected--;
        if (stateSelected == 0)
            $('#compareSelect').removeAttr("disabled");
        stateFlag[currentPanel - 1] = false;
    }
    drawAllCharts();
});

$('#compareSelect').on('change', function () {
    var tempVal = $(this).val();
    if (tempVal == "0") {
        compareByCountries = true;
        addCountries();
        $(".countryListSelect option[value='0']").prop('selected', true);
        $('.stateListSelect').attr("disabled", "disabled");
    } else {
        compareByCountries = false;
        removeCountries();
        $(".countryListSelect option[value='US']").prop('selected', true);
        $('.stateListSelect').removeAttr("disabled");
    }
});

function removeCountries() {
    countries.forEach(function (element) {
        $(".countryListSelect  option[value='" + element + "']").remove();
    });
}

function addCountries() {
    countries.forEach(function (element) {
        $('.countryListSelect')
            .append($("<option></option>")
                .attr("value", element)
                .text(element));
    });
}

$('.ageGroup').on('change', function () {
    minAge = parseInt($('#minValue').val());
    maxAge = parseInt($('#maxValue').val());
    resetMinMaxValues();
    drawAllCharts();
})

function drawAllCharts() {
    drawBarChart();
    for (var i = 1; i <= 3; i++) {
        if (stateFlag[i - 1]) {
            grpColor = 0;
            currentCountry = $('#countryListSelect_' + i).val();
            currentState = $('#stateListSelect_' + i).val();
            currentPanel = i;
            drawBarChart();
            drawPieChart();
        }
    }
}

var grpColor = 0;

function getColor(value) {
    value = +value;
    var returnColor;
    var tempVal = value;
    value = value / 7;
    var range = [0, 15];

    if (eventSelected != "0" && tempVal < 12 && groupBySelected == 0) {
        var color = d3.scale.linear()
            .domain(range)
            .range(["Grey", "White"])
            .interpolate(d3.interpolateHcl);
        return color(10);
    } 

    if (groupBySelected > 0) {
        if (grpColor == 8)
            grpColor = 0;
        else
            grpColor++;
        tempVal = value = grpColor;
    }

    switch (Math.floor(tempVal % 7)) {
        case 0:
            var color0 = d3.scale.linear()
                .domain(range)
                .range(["#3182bd", "#c6dbef"])
                .interpolate(d3.interpolateHcl);
            returnColor = color0(value);
            break;

        case 1:
            var color1 = d3.scale.linear()
                .domain(range)
                .range(["#e6550d", "#fdd0a2"])
                .interpolate(d3.interpolateHcl);
            returnColor = color1(value);
            break;

        case 2:
            var color2 = d3.scale.linear()
                .domain(range)
                .range(["#31a354", "#c7e9c0"])
                .interpolate(d3.interpolateHcl);
            returnColor = color2(value);
            break;

        case 3:
            var color3 = d3.scale.linear()
                .domain(range)
                .range(["#756bb1", "#dadaeb"])
                .interpolate(d3.interpolateHcl);
            returnColor = color3(value);
            break;

        case 4:
            var color8 = d3.scale.linear()
                .domain(range)
                .range(["#393b79", "#9c9ede"])
                .interpolate(d3.interpolateHcl);
            returnColor = color8(value);
            break;

        case 5:
            var color5 = d3.scale.linear()
                .domain(range)
                .range(["#8c6d31", "#e7cb94"])
                .interpolate(d3.interpolateHcl);
            returnColor = color5(value);
            break;

        case 6:
            var color6 = d3.scale.linear()
                .domain(range)
                .range(["#843c39", "#e7969c"])
                .interpolate(d3.interpolateHcl);
            returnColor = color6(value);
            break;

        case 7:
            var color7 = d3.scale.linear()
                .domain(range)
                .range(["#7b4173", "#de9ed6"])
                .interpolate(d3.interpolateHcl);
            returnColor = color7(value);
            break;

    }
    return returnColor;
}

//Used for grouping data based on ages.
function groupByAges(data) {
    var groupedData = [];
    var i = 1;
    var c = 0;
    var count = data.length - 1;
    var sum = 0;
    var index = -1;
    data.forEach(function (element) {
        sum += getData(element);
        if (i == 10 || count == 0) {
            var elem = [];
            i = 1;
            c++;
            elem['AGE'] = (index + 1) + " - " + ((10 * (c - 1)) + 10);
            elem[getColumnName()] = sum;
            elem['SEX'] = element.SEX;
            groupedData.push(elem);
            index = ((10 * (c - 1)) + 10);
            sum = 0;
        } else {
            i++;
        }
        count--;
    }, this);
    return groupedData;
}

//Used for filtering data based on State, Gender and Age.
function filterPayload(dataObj) {
    if (compareByCountries) {
        if (dataObj.NAME == currentCountry && dataObj.SEX == genderSelected && dataObj.AGE != "999" && dataObj.AGE >= minAge && dataObj.AGE <= maxAge) {
            return true;
        } else {
            return false;
        }

    } else {
        if (dataObj.NAME == currentState && dataObj.SEX == genderSelected && dataObj.AGE != "999" && dataObj.AGE >= minAge && dataObj.AGE <= maxAge) {
            return true;
        } else {
            return false;
        }
    }
}

function getYear() {
    if (eventSelected != "0") {
        return eventSelected;
    }
    return yearSelected;
}

function getData(d) {
    if (getYear() == "2010") {
        return d.POPEST2010_CIV;
    } else if (getYear() == "2011") {
        return d.POPEST2011_CIV;
    } else if (getYear() == "2012") {
        return d.POPEST2012_CIV;
    } else if (getYear() == "2013") {
        return d.POPEST2013_CIV;
    } else {
        return d.POPEST2014_CIV;
    }
}

function getColumnName() {
    if (getYear() == "2010") {
        return "POPEST2010_CIV";
    } else if (getYear() == "2011") {
        return "POPEST2011_CIV";
    } else if (getYear() == "2012") {
        return "POPEST2012_CIV";
    } else if (getYear() == "2013") {
        return "POPEST2013_CIV";
    } else {
        return "POPEST2014_CIV";
    }
}

function type(d) {
    d.POPEST2010_CIV = +d.POPEST2010_CIV;
    d.POPEST2011_CIV = +d.POPEST2011_CIV;
    d.POPEST2012_CIV = +d.POPEST2012_CIV;
    d.POPEST2013_CIV = +d.POPEST2013_CIV;
    d.POPEST2014_CIV = +d.POPEST2014_CIV;
    return d;
}

function loadData(error, data) {
    if (error)
        throw error;
    else
        payload = data;
};

window.onresize = function (event) {
   // resetMinMaxValues();
 //   calculateDimensions();
    //drawAllCharts();
};

d3.csv("resources/data_new.csv", type, loadData);
