$(document).ready(function() {

    //Map
    var terrain = L.tileLayer('watercolor')
    var map = L.map('map', {
        center: [38, -98.09],
        zoom: 5
    });
    //Base Map Layers
    var thunderOutdoors = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    //Geo JSON data
    $.get('areas.json').done(function(data) {
            var areas = data.features;
            //Set JSON Markers
            var geojsonMarkerOptions = {
                radius: 15,
                fillColor: "grey",
                color: "grey",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            };
            //Populating map with circle markers
            var name = [];
            var coordinates = [];
            for (var i = 0; i < areas.length; i++) {
                name.push(areas[i].properties.name)
                coordinates.push(areas[i].geometry.coordinates)
                var geo = L.geoJson(data, {
                        pointToLayer: function(feature, latlng) {
                            return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(feature.properties.name);
                        }
                    })
                    //Base Layers and Marker Layers
            }
            geo.on('click', function(event) {
                $('.pop-up').toggle()
            })
            var baseMaps = {
                "Thunder outdoors": thunderOutdoors
            };
            var overlays = {
                "Default": geo
            };
            map.addLayer(geo);
            map.addControl(new L.control.layers(baseMaps, overlays, {
                "collapsed": true
            }));
        })
        //Class Creator
    class climbingArea {
        constructor(name, north, west, route) {
            this.name = name;
            this.west = north;
            this.north = west;
        }
    }
    var loadedDataCircleOptions = {
        radius: 15,
        fillColor: "grey",
        color: "grey",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };
    //Class Form Submission Values
    $('#form').submit(function() {
            event.preventDefault();
            var yourAreas = [];
            var name = $('#name').val();
            var north = parseInt($('#west').val());
            var west = parseInt($('#north').val());
            const area = new climbingArea(name, north, west)
                //Addding Marker
            addArea(area);
            var areaMarker = L.circleMarker([west, north], loadedDataCircleOptions).bindPopup(name);
            map.addLayer(areaMarker)
        })
        //Route Object Generator
    class newRoute {
        constructor(area, routeName, grade, beta) {
            this.area = area;
            this.routeName = routeName;
            this.grade = grade;
            this.beta = beta;
        }
    }
    //Route Form Submission Values
    $('.route-information').submit(function() {
        event.preventDefault();
        var area = $('#area').val();
        var routeName = $('#routeName').val();
        var grade = $('#grade').val();
        var beta = $('#beta').val();
        const route = new newRoute(area, routeName, grade, beta)
        addRoute(route)
        console.log(route)
    })

    //PanTo Feature
    $.get('areas.json').done(function(data) {
            var areas = data.features;
            for (var i = 0; i < areas.length; i++) {
                $("#areaNames").append("<option>" + areas[i].properties.name + "</option>")
            }
            $('#areaNames').change(function() {
                var chosenArea = $('#areaNames option:selected').text();
                var chosenLocation;
                var location;
                for (var i = 0; i < areas.length; i++) {
                    if (chosenArea == areas[i].properties.name) {
                        location = i;
                        chosenLocation = areas[location].geometry.coordinates
                        map.panTo(chosenLocation.reverse());
                        map.zoomIn(4)
                    } if(chosenArea == 'Climbing Area') {
                      map.panTo([38, -98.09])
                      map.zoomOut(4)
                    }
                }
            })
        })
        //some code that goes through get area and popoulates map
    var json = localStorage.getItem('areas')
    var localData;
    if (json) {
        localData = JSON.parse(json)
    }
    $.each(localData, function(key, value) {
            $('#areaNames').append("<option>" + value.name + "</option>")
            $('#areaNames').change(function() {
                var chosenArea = $('#areaNames option:selected').text();
                var chosenLocation;
                var location;
                if (chosenArea == value.name) {
                    chosenLocation = [value.north, value.west]
                    map.panTo(chosenLocation);
                    map.zoomIn(4)
                }
            })

            var storedCircles = L.circleMarker([value.north, value.west], loadedDataCircleOptions).bindPopup(value.name);
            storedCircles.on('click', function(event) {
                $('.pop-up').toggle()

                // map.on('click', function(event) {
                //     $('.pop-up').toggle()
                // })
            })
            $('.addRoute').on('click', function() {
                $('.add-route').toggle()
                $('.leaflet-popup-content-wrapper').text()
                $('#area').attr('value', $('.leaflet-popup-content-wrapper').text())
                $('#close').on('click', function() {
                    $('.add-route').toggle()
                    $('.pop-up').toggle();
                })
            })
            map.addLayer(storedCircles)

        })
        //Local Storage
    function getRoutes() {
        var routes = localStorage.getItem('routes')
        if (routes) {
            return JSON.parse(routes)
        } else {
            return []
        }
    }

    function addRoute(route) {
        var routes = getRoutes()
        routes.push(route)
        var jsonStrR = JSON.stringify(routes)
        localStorage.setItem('routes', jsonStrR)
    }

    function getAreas() {
        var areas = localStorage.getItem('areas')
        if (areas) {
            return JSON.parse(areas)
        } else {
            return []
        }
    }

    function addArea(area) {
        var areas = getAreas()
        areas.push(area)
        var jsonStr = JSON.stringify(areas)
        localStorage.setItem('areas', jsonStr)
    }
    //Add Layers
    map.addLayer(thunderOutdoors)
        //Layer Objects
})
