const supercluster = require('supercluster')

var index

function loadFile(path){
    if (path.indexOf(".json") !== -1){
        getJSON(path, function(geojson){
            index = supercluster({
            log: true,
            radius: 60,
            extent: 256,
            maxZoom: 17
        }).load(geojson.features)
        send({ready: true})
        })
    }
}

self.on('message', (message, data) => {
    if (message === "loadFile"){
        loadFile(data.file)
    }
    else if (message === "update"){
        send(index.getClusters(data.bbox, data.zoom)) 

    }
})

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