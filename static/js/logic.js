// Create first tile layer
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
});

var baseMaps = {
    Satellite: satelitemap,
    Street: streetmap,
    Dark: darkmap
  };

// Create Map Object
var map = L.map("map", {
    center: [0, 0],
    zoom: 2
});

// Add tilelayers to the map 
streetmap.addTo(map);
darkmap.addTo(map);
satelitemap.addTo(map);

// Create a legend to display information about the map
var legend = L.control({
    position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML =
      "<p class='legend green'> Magnitude < 1.0 </p> <p class='legend yellow'> Magnitude < 2.5 </p> <p class='legend orange'> Magnitude < 4.5 </p> <p class='legend red'> Magnitude = 4.5+ </p>";
    return div;
};
// Add the info legend to the map
legend.addTo(map);

// Function to create markers from geoJSON to be used with L.geoJSON
function createMarkers(features, latlng) {
  var mag = features.properties.mag;
  var place = features.properties.place;
    if (mag <= 1.0){
        var color = "green"
    } else if (mag <= 2.5){
        var color = "yellow"
    } else if (mag <= 4.5){
        var color = "orange"
    } else {
        var color = "red"
    }

  // Change the values of these options to change the symbol's appearance
  let options = {
    radius: mag * 3 ,
    color: color,
    weight: 1,
    // opacity: 1,
    fillOpacity: .7,
  }
  console.log("markers done");
  return L.circleMarker(latlng, options).bindPopup(`<h1> ${place} </h1> <hr> <h3>Magnitude: ${mag}</h3>`);
};

// Link for Earthquakes geoJSON
var earthquakeJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Link for Tectonic Plates geoJSON
var platesJSON = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Grabbing the GeoJSON data
d3.json(earthquakeJSON, function(earthquakes){
  d3.json(platesJSON, function(plates){
    var myStyle = {
      "color": "orange",
      "weight": 5,
      "opacity": 0.15
    };
    var platesLayer = L.geoJson(plates, {
      style: myStyle
    });
    platesLayer.addTo(map)
    var geoLayer = L.geoJson(earthquakes, {
      pointToLayer: createMarkers
    });
    geoLayer.addTo(map);
    var overlays = {
      Earthquakes : geoLayer,
      Tectonic_Plates: platesLayer 
    };
    L.control.layers(baseMaps, overlays).addTo(map);
  });
});
