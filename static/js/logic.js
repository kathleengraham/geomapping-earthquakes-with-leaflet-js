// access geojson
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// create markerSize based on magnitude of earthquake
function markerSize(magnitude) {
    return magnitude * 300
}

// set markerColor based on magnitude of earthquake
function markerColor(magnitude) {
    if (magnitude <=1) {
        return 'red'
    } else if (magnitude <=2) {
        return 'pink'
    } else if (magnitude <=3) {
        return 'orange'
    } else if (magnitude <=4) {
        return 'lightgreen'
    } else {
        return 'yellow'
    }
}