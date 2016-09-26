const supercluster = require('supercluster')
var index

process.on('message', (data) => {
    console.log(data)
    if (data.file){
        console.log(data.file)
        loadFile(data.file)
    }
    else {
        process.send(index.getClusters(data.bbox, data.zoom)) 
    }
})


function loadFile(path){
    if (path.indexOf(".json") !== -1){
        getJSON(path, function(geojson){
            index = supercluster({
            log: true,
            radius: 60,
            extent: 256,
            maxZoom: 17}).load(geojson.features)

            process.send({ready: true})
        })
    }
}


function getJSON(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
            callback(xhr.response)
        }
    }
    xhr.send()
}