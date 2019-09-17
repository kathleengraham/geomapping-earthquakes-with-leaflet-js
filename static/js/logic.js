// access geojson
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// create markerSize based on magnitude of earthquake
function markerSize(magnitude) {
    return magnitude * 25000
}

// set markerColor based on magnitude of earthquake
function markerColor(m) {
    return m > 5 ? '#7a0177' :
        m > 4 ? '#E31A1C' :
        m > 3 ? '#FD8D3C' :
        m > 2 ? 'lightgreen' :
        m > 1 ? 'skyblue' :
        'yellow'
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

    // add color grade for legend
    function getColor(d) {
        return d > 5 ? '#7a0177' :
               d > 4 ? '#E31A1C' :
               d > 3 ? '#FD8D3C' :
               d > 2 ? 'lightgreen' :
               d > 1 ? 'skyblue' :
               'yellow'
    }

    // add function to legend
    legend.onAdd = function(map){
        const div = L.DomUtil.create('div', 'info legend')
        const magnitudes = [0, 1, 2, 3, 4, 5]
        const labels = []
        for (let i = 0; i < magnitudes.length; i++){
            div.innerHTML +=
                '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+')
        }
        return div
    }
      
    // add legend to map
    legend.addTo(myMap)
}