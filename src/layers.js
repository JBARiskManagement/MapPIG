const $ = jQuery = require('jQuery')
const L = require('leaflet')
const {MapControl, registerMapCtrl, getMapCtrl} = require('./map_control.js')
const child_process = require('child_process')


class ClusterLayer {

    constructor(layerName){
        this.layer = L.geoJson(null, {
            pointToLayer: this.createMarkerIcon
        })

        this.layerName = layerName
        this.ready = false
        this.mCtrl = undefined
        this.worker = undefined
    }

    addToMap(name = "default"){
        this.mCtrl = getMapCtrl(name)
        this.mCtrl.addOverlay(this.layer, this.layerName)
        this.mCtrl._map.on('moveend', this.update);

    }

    createClusterIcon(feature, latlng) {
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
        this.worker = child_process.fork('./workers/cluster_worker.js')
        this.worker.on('message', (e) => {
                        if (e.data.ready) {
                            this.ready = true
                            this.update()
                        } else {
                            this.layer.clearLayers()
                            this.layer.addData(e.data)
                        }
                })

        this.worker.send('loadFile', {
            file: path
        })
    }

    update() {
        if (!this.ready) return
        var bounds = this.mCtrl._map.getBounds()
        this.worker.send('update', {
            bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
            zoom: this.mCtrl._map.getZoom()
        })
    }
}

module.exports.ClusterLayer = ClusterLayer