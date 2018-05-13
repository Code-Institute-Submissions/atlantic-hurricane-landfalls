queue()
    .defer(d3.json,'/data')


    .await(makeGraphs);

function makeGraphs(error, hurricaneData) {

    // APPLY CROSSFILTER
    let ndx = crossfilter(hurricaneData);

    //WILL BE USED TO APPLY FILTERS TO MAP
    let allDim = ndx.dimension(function(d) { return d; });


    //FORMAT DATA FOR PRESENTATION AND CHART GENERATION
    hurricaneData.forEach(function(d) {

        d.Dates = d.Date.toString()
        d.Year = parseInt(d.Dates.slice(0, 4));
        d.MaximumWind = parseInt(d.MaximumWind);




    });

    //GROUP YEARS FOR BARCHART AND BOXPLOT
    let Year_dim = ndx.dimension(
        function(d) {
            if (d.Year >= 2010) {
                return "2010-2015"
            }
            else {
                from = Math.floor(d.Year / 5) * 5;
                to = from + 4
                return from + "-" + to;
            }

        });


    //BARCHART
    let year_reduce_barchart = Year_dim.group().reduceCount();
    let barchart = dc.barChart("#named_per_year")
        .width(800)
        .height(500)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(Year_dim)
        .group(year_reduce_barchart)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("# Landfalls")
        .yAxis().ticks(25);

    //BOXPLOT
    let year_reduce_boxplot = Year_dim.group().reduce(
        function(p, v) {
            p.push(v.MaximumWind);
            return p;
        },
        function(p, v) {
            p.splice(p.indexOf(v.MaximumWind), 1);
            return p;
        },
        function() {
            return [];
        }
    );

    let boxplot = dc.boxPlot("#box-plot")
        .width(800)
        .height(800)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(Year_dim)
        .group(year_reduce_boxplot)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year");


    //PIECHART
    let group_by_cat = ndx.dimension(dc.pluck('MAX_CAT'));
    let total_cat = group_by_cat.group().reduceCount();
    let piechart = dc.pieChart("#piechart")
        .height(330)
        .radius(90)
        .dimension(group_by_cat)
        .group(total_cat)
        .transitionDuration(500);


    //LEAFLET.JS MAP


    //SET MAP OUTSIDE OF FUNCTION
    var mymap = L.map('mapid')

    function show_map() {
        //ARRAY LAT,LONG COORDS WILL BE PUSHED TO.
        let coords = [];

        mymap.setView([39.8283, -98.5795], 3);
        //PUSH LAT LONG COORDS TO ARRAY THAT WILL VARY WITH FILTER
        allDim.top(Infinity).forEach(function(d) {
            d.Latitude = parseFloat(d.Latitude);
            d.Longitude = (parseFloat(d.Longitude));
            d.Longitudes = (d.Longitude * -1)
            coords.push([d.Latitude, d.Longitudes])
        });


        //SET TILE LAYER
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(mymap);
        let circles = new L.FeatureGroup()
        //POPULATE THE MAP WITH POINTS
        function populate() {
            circles.clearLayers()
            for (var i = 0; i < coords.length; i++) {

                let circle = new L.circle([coords[i][0], coords[i][1]], 500, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5
                })
                circles.addLayer(circle)

            }




        }
        mymap.addLayer(circles)
        populate()


    }

    show_map()
    //CATEGORY SELECTOR
    let cat_dim = ndx.dimension(dc.pluck('MAX_CAT'))
    let cat_group = cat_dim.group();
    let categorychoice = dc.selectMenu('#select-category')
        .dimension(cat_dim)
        .group(cat_group);


    categorychoice.on("filtered", function(chart, filter) {
        mymap.eachLayer(function(layer) {
            mymap.removeLayer(layer)
        });
        show_map()
    });
     dc.renderAll();
}