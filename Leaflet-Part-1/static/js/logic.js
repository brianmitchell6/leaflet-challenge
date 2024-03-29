function createMap(earthquakes) {
    //Create tile layer for background image
    let streetMap = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetMap
    };

    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
        "EarthQuakes": earthquakes
    };

    let map = L.map("map", {
        center: [40.7608, -111.8910],
        zoom: 5,
        layers: [streetMap, earthquakes]
    });

    // Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    legend.addTo(map);
}

function createMarkers(response) {
    
    // Initialize an array to hold the earthquake markers.
  let quakeMarkers = [];
//    console.log(Object.keys(response.features).length);
  // Loop through the earthquakes
  for (let index = 0; index < Object.keys(response.features).length; index++) {
    let quakeResponse = response.features[index];
    let quakeProp = quakeResponse.properties;
    let quakeCoord = quakeResponse.geometry.coordinates;

    //Select color and oppacity based on depth
    let quakeColor = "";
    let quakeOpacity = 0;

    if (quakeCoord[2] <= 10) {
        quakeColor = "cadetblue";
        quakeOpacity = 0.1
    } else if (quakeCoord[2] <= 30) {
        quakeColor = "green";
        quakeOpacity = 0.2
    } else if (quakeCoord[2] <= 50) {
        quakeColor = "orange";
        quakeOpacity = 0.4
    } else if (quakeCoord[2] <= 70) {
        quakeColor = "purple";
        quakeOpacity = 0.6
    } else if (quakeCoord[2] <= 90) {
        quakeColor = "red";
        quakeOpacity = 0.8
    } else {
        quakeColor = "darkred";
        quakeOpacity = 1.0
    }
    
    // For each station, create a marker, and bind a popup with the earthquakes location, magnitude, and depth.
    let quakeMarker = L.circle([quakeCoord[1], quakeCoord[0]], {
        radius: quakeProp.mag*10000,
        fillOpacity: quakeOpacity,
        color: quakeColor
    }).bindPopup("<h3>" + quakeProp.place + "<h3><h3>Magnitude: " + quakeProp.mag + "<h3><h3>Depth: " + quakeCoord[2] + "</h3>");

    // Add the marker to the quakeMarkers array.
    quakeMarkers.push(quakeMarker);
  }


  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  createMap(L.layerGroup(quakeMarkers));
}

//Create legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #5F9EA0"></i><span>"-10-10"</span><br>';
    div.innerHTML += '<i style="background: #008000"></i><span>"10-30"</span><br>';
    div.innerHTML += '<i style="background: #FFA500"></i><span>"30-50"</span><br>';
    div.innerHTML += '<i style="background: #800080"></i><span>"50-70"</span><br>';
    div.innerHTML += '<i style="background: #FF0000"></i><span>"70-90"</span><br>';
    div.innerHTML += '<i style="background: #8B0000"></i><span>"90+"</span><br>';

    return div;
};

// Perform an API call to the USGS Earthquake API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
