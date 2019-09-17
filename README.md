# Geomapping Earthquakes with Leaflet.js

![default-screenshot-earthquake-visualization](assets/images/usgs-screenshot.jpg)

I created an interactive visualization of earthquake data from the past 30 days using Leaflet!

This visualization includes multiple layers that the user can switch between, such as satellite, light, and dark:

![earthquake-map-layers](assets/images/layers.gif)

It also includes zoom functionalities:

![earthquake-map-zoom](assets/images/zoom.gif)

And you can click on each earthquake record to see more detail, such as the specific place, magnitude, date, and time:

![earthquake-map-popups](assets/images/popups.gif)


### Set Up

First, I got geojson data from the [United States Geological Survey](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php), and I set up my config.js file.

### Basic Skeleton of Website

Next, I built the basic webpage with a div where the visualization would go, only making a few tweaks to the footer later.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Geomapping Earthquakes</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.css" />
  <link rel="stylesheet" type="text/css" href="static/css/style.css">
</head>
<body>
  <nav class='navbar navbar-custom'>
    <a class='navbar-brand' href='index.html'>USGS Earthquakes (Past 30 Days)</a>
    </div>
  </nav>
  <div class='container-fluid'>
    <div id='map'></div>
  </div>
  <footer>
    <div class='footer'>
      Made with 💜 and <a id='leaflet-link' href='https://leafletjs.com/reference-1.5.0.html' target='_blank' rel='noopener noreferrer'>Leaflet.js</a>&nbsp;&nbsp;|&nbsp;&nbsp;Kathleen Graham 2019&nbsp;&nbsp;
      <a href='https://github.com/kathleengraham/geomapping-earthquakes-with-leaflet-js' target='_blank' rel='noopener noreferrer'><img id='gh-icon' src='static/images/gh-icon.png'></a>
    </div>
  </footer>

  <script src="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.3/d3.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <script type="text/javascript" src="static/js/logic.js"></script>
  <script type="text/javascript" src="static/js/config.js"></script>
</body>
</html>
```


### Leaflet.js

Then, I used Leaflet to call in earthquake data from the last 30 days and plot circles with colors and sizes based on their magnitude.

I also created many layers for the map, including satellite, light, and dark layers, and a legend of marker colors. The legend was the biggest challenge but I finally got the syntax right!

```javascript
// access geojson
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// create markerSize based on magnitude of earthquake
function markerSize(magnitude) {
    return magnitude * 25000
}

// set markerColor based on magnitude of earthquake
function markerColor(d) {
    return d > 5 ? '#4A1178' :
        d > 4 ? '#952C7F' :
        d > 3 ? '#D7496C' :
        d > 2 ? '#FA8765' :
        d > 1 ? '#FECC8F' :
        '#FCF6B8'
}

// get request to query url
d3.json(link,function(data){
    addFeatures(data.features)
})

// bind popup for each quake with place and time
function addFeatures(quakeData) {
    const quakes = L.geoJSON(quakeData,{
        onEachFeature:function(feature,layer){
            layer.bindPopup('<h3>'+feature.properties.place+'</h3><hr><p>'+new Date(feature.properties.time)+'</p><p>Magnitude: '+feature.properties.mag+'</p>')
        },
        pointToLayer:function(feature,latlng){
            return new L.circle(latlng,
                {radius:markerSize(feature.properties.mag),fillColor:markerColor(feature.properties.mag),fillOpacity:0.9,stroke:false})
        }
    })

    // create the map
    createMap(quakes)
}

// create the map function with multiple layers
function createMap(quakes){

    // link to maps with api in config.js
    const mapboxLink = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    
    // create satellite map layer
    const satmap = L.tileLayer(mapboxLink,{
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
      })

    // create light map layer
    const lightmap = L.tileLayer(mapboxLink,{
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: API_KEY
    })

    // create dark map layer
    const darkmap = L.tileLayer(mapboxLink,{
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    })

    // create basemap layer with the other maps
    const baseMaps = {
        'Satellite Map': satmap,
        'Light Map': lightmap,
        'Dark Map': darkmap
    }

    // create overlay layer
    const mapOverlay = {
        'Earthquakes': quakes
    }
    
    // load satmap and earthquakes as default
    const myMap = L.map('map', {
        center: [31.5,-100],
        zoom: 4,
        layers: [satmap,quakes]
    })

    // add all map layers
    L.control.layers(baseMaps, mapOverlay, {
        collapsed: false
    }).addTo(myMap)

    // create legend
    const legend = L.control({position: 'bottomleft'})

    // add function to legend
    legend.onAdd = function(map){
        const div = L.DomUtil.create('div', 'info legend')
        const magnitudes = [0, 1, 2, 3, 4, 5]
        const labels = []
        for (let i = 0; i < magnitudes.length; i++){
            div.innerHTML +=
                '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+')
        }
        return div
    }
      
    // add legend to map
    legend.addTo(myMap)
}
```

### Styles

I added more styling throughout the entire project.

```css
html,
body,
.container-fluid {
  height: 100%;
  width: 100%;
  position: fixed;
}

#map {
  position: relative;
  height: 85%;
  width: 100%;
}

.navbar-custom .navbar-brand:link,
.navbar-custom .navbar-brand:visited,
.navbar-custom .navbar-brand:hover,
.navbar-custom .navbar-brand:active {
  color: black;
}

.navbar-custom {
  width:100%;
  background-color: white;
  top:0;
}

.info {
  padding: 6px 8px;
  font: 14px;
  border-radius: 5px;
}

.legend {
  background-color: white;
  line-height: 25px;
  color: black;
  width: auto;
}

.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.9;
}

footer {
  background-color: white;
  color: black;
  font-size: 9pt; 
  text-align: center; 
  vertical-align: middle;
  line-height: 45px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;

}

#leaflet-link:link,
#leaflet-link:visited,
#leaflet-link:hover,
#leaflet-link:active {
  color: black;
}

#gh-icon {
  width: 20px;
  height: 20px;
  background-size: 100%;
}
```