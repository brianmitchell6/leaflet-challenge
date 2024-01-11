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
        zoom: 4,
        layers: [streetMap, earthquakes]
    });

    // Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}


// Perform an API call to the USGS Earthquake API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
