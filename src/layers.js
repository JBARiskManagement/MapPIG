const $ = jQuery = require('jQuery')
const L = require('leaflet')
require('leaflet-choropleth')
const {MapControl, registerMapCtrl, getMapCtrl} = require('./map_control.js')
const child_process = require('child_process')


/*
 *  Simple wrapper around Leaflets geoJson layer
 * to enable easy adding to the mapPIG map & layers control
 *  
 */
class GeoJsonLayer {
    constructor(layerName, options){
        this.layer = L.geoJson(null, options)
        this.layerName = layerName
    }

    addToMap(name = "default"){
        this.mCtrl = getMapCtrl(name)
        this.mCtrl.addOverlay(this.layer, this.layerName)
    }

    remove(){
        this.layer.clearLayers()
    }
}

/*
 * Create a choropleth layer
 */ 
function choropleth(data, options){
    return L.choropleth(data, options)
}


/*
 * Simple ClusterLayer
 * 
 * Currently supports GeoJson files.
 * The function to create markers can be customised with the `setClusterIconFn` function.
 * Data is loaded and processed asynchronously using mapbox's SuperCluster library
 * 
 */
class ClusterLayer {

    constructor(layerName){
        

        this.layerName = layerName
        this.ready = false
        this.mCtrl = undefined
        this.worker = undefined

        this.layer = L.geoJson(null, {
            pointToLayer: this._createClusterIcon
        })

    }

    addToMap(name = "default"){
        this.mCtrl = getMapCtrl(name)
        this.mCtrl.addOverlay(this.layer, this.layerName)
        this.mCtrl._map.on('moveend', this.update.bind(this));

    }

    setClusterIconFn(func){
        this.layer.pointToLayer = func
    }

    _createClusterIcon(feature, latlng) {
        if (!feature.properties.cluster) return L.marker(latlng)

        var count = feature.properties.point_count
        var size =
            count < 100 ? 'small' :
            count < 1000 ? 'medium' : 'large'
        var icon = L.divIcon({
            html: '<div><span>' + feature.properties.point_count_abbreviated + '</span></div>',
            className: 'marker-cluster marker-cluster-' + size,
            iconSize: L.point(40, 40)
        })
        return L.marker(latlng, {icon: icon})
    }

    fromFile(path){
        if (this.worker && this.worker.connected){
            this.worker.disconnect()
        }
        this.worker = child_process.fork(`${__dirname}/workers/cluster_worker.js`)
        this.worker.on('message', (e) => {
                        if (e.ready) {
                            this.ready = true
                            this.update()
                        } else if (e.data) {
                            this.layer.clearLayers()
                            this.layer.addData(e.data)
                        }
                })

        this.worker.send({
            file: path
        })
    }

    update() {
        if (!this.ready) return
        this.worker.send(this.mCtrl.getPosition())
    }
}

module.exports.ClusterLayer = ClusterLayer
module.exports.GeoJsonLayer = GeoJsonLayer
module.exports.choropleth = choropleth
