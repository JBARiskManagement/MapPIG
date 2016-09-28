/*
 * Worker for loading a geojson file and clustering it with supercluster
 */ 

const supercluster = require('supercluster')
var index

process.on('message', (data) => {
    if (data.file){
        loadFile(data.file)
    }
    else {
        process.send({data: index.getClusters(data.bbox, data.zoom)}) 
    }
})

function loadFile(path){
    
    if (path.indexOf(".json") != -1){
        geojson = require(path);
        index = supercluster({
        log: true,
        radius: 60,
        extent: 256,
        maxZoom: 17}).load(geojson.features)

        process.send({ready: true})

    }
}