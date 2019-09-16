// access geojson
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// create markerSize based on magnitude of earthquake
function markerSize(magnitude) {
    return magnitude * 25000
}

// set markerColor based on magnitude of earthquake
function markerColor(magnitude) {
    if (magnitude <=1) {
        return 'yellow'
    } else if (magnitude <=2) {
        return 'lightgreen'
    } else if (magnitude <=3) {
        return 'pink'
    } else if (magnitude <=4) {
        return 'orange'
    } else {
        return 'red'
    }
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

// create the map function with multiple laters
function createMap(quakes){
    const mapboxLink = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    // satellite map layer
    const satmap = L.tileLayer(mapboxLink,{
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
      })

      // dark map layer
      const darkmap = L.tileLayer(mapboxLink,{
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
      })

      // basemap layer
      const baseMaps = {
          'Satellite Map': satmap,
          'Dark Map': darkmap
      }

      // overlay layer
      const mapOverlay = {
          'Earthquakes': quakes
      }
      
      // load satmap and earthquakes initially
      const myMap = L.map('map', {
          center: [31.5,-100],
          zoom: 4,
          layers: [satmap,quakes]
      })

      L.control.layers(baseMaps, mapOverlay, {
          collapsed: false
      }).addTo(myMap)

      // add legend
      // const legend = 
      // legend.onAdd = function(){
        // }
        // lengend.addTo(myMap)
}