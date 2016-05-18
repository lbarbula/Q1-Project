$(document).ready(function(){

  //Map
  var terrain = L.tileLayer('watercolor')
  var map = L.map('map', {
    center: [38, -98.09],
    zoom:5
});
//Base Map Layers
  var thunderOutdoors = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
//Geo JSON data
$.get('areas.json').done(function(data){
  var areas = data.features;
  //console.log(areas)

  var geojsonMarkerOptions = {
    radius: 15,
    fillColor: "grey",
    color: "grey",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
};

  var name = [];
  var coordinates = [];
  for(var i = 0; i < areas.length; i++){
  name.push(areas[i].properties.name)
  coordinates.push(areas[i].geometry.coordinates)
  var geo = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(feature.properties.name);
    }
  })

      }
      var baseMaps = {
        "Thunder outdoors": thunderOutdoors
      };
      var overlays = {
        "Default": geo
      };
      map.addLayer(geo);
      map.addControl(new L.control.layers(baseMaps,overlays, {"collapsed":true}));
    })
  //})
  //Class Creator
  class climbingArea{
    constructor(name, north, west, route){
      this.name = name;
      this.west = north;
      this.north = west;
      this.route = route;
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
    $('#form').submit(function(){
    event.preventDefault();
    var yourAreas = [];
    var name = $('#name').val();
    var north = parseInt($('#west').val());
    var west = parseInt($('#north').val());
    var route = $('#route').val();
    const area = new climbingArea(name, north, west, route)
    //Addding Marker
    addArea(area);
    var areaMarker = L.circleMarker([west, north], loadedDataCircleOptions).bindPopup(name);
    map.addLayer(areaMarker)
    //Push to Array
    // yourAreas.push(area)
    // console.log(yourAreas)
  })
  //some code that goes through get area and popoulates map
  var localData = JSON.parse(localStorage.getItem('areas'))
  $.each(localData, function(key, value){

  //   var loadedDataCircleOptions = {
  //     radius: 15,
  //     fillColor: "grey",
  //     color: "grey",
  //     weight: 1,
  //     opacity: 1,
  //     fillOpacity: 0.5
  // };

    var storedCircles = L.circleMarker([value.north, value.west], loadedDataCircleOptions).bindPopup(value.name);
    map.addLayer(storedCircles)
    console.log(key + " " + value.name, value.north, value.west, value.route)
  })
  //Local Storage
  function getAreas(){
    var areas = localStorage.getItem('areas')
    if(areas.length !== 0){
      return JSON.parse(areas)
    } else {
      return []
    }
    //console.log(areas.value[0])
    //areas = JSON.parse(areas)
    //return areas
  }
  function addArea(area){
    var areas = getAreas()
    areas.push(area)
    var jsonStr = JSON.stringify(areas)
    localStorage.setItem('areas', jsonStr)
  }
  //Add Layers
  map.addLayer(thunderOutdoors)

//Layer Objects
  var baseMaps = {
    "Thunder outdoors": thunderOutdoors
  };
})
