/*
 */
// Get the app variable to figure out paths to resources etc
const app = require('electron').remote.app
const appPath = app.getAppPath()
const $ = jQuery = require('jQuery')
const L = require('leaflet')
require('./layerpanel.js')
require('leaflet-sidenav')
require('../vendors/js/leaflet-wms-getlegendgraphic.js')
require('leaflet-search')
require('leaflet-loading')
const wms = require('./ows.js')
require('bootstrap-select')
const {MPDom} = require('./dom.js')
const conf = require('../conf/conf.json')

// Cache of MapControls
var _MCTRL_LIST = {}

/**
 * Cache a MapControl instance so it may be retrieved later
 */
function registerMapCtrl(mapCtrl, name){
    _MCTRL_LIST[name] = mapCtrl
}

function getMapCtrl(name = "default"){
    return _MCTRL_LIST[name]
}

/**
 * \brief MapControl
 * 
 * Brings together the various elements of the MapPIG GUI - essentially
 * representing the main html 'window'
 */
class MapControl{
    constructor (id){
        if (typeof(id)==='undefined') id = 'map'
        this.id = id

        /** INST. PROPERTIES */
        this.baseLayers = {}
        this.overLays = {} // Holds any overlay layers added
        if(google != undefined){
            this.geocoder = new google.maps.Geocoder()
        }

        // Parse base layers out of config
        if (conf.hasOwnProperty("base_layers")){
            for (var p in conf.base_layers){
                if (conf.base_layers[p].type === "tileLayer"){
                    this.baseLayers[p] = L.tileLayer(conf.base_layers[p].url, { attribution: conf.base_layers[p].attribution})
                }
                else if (conf.base_layers[p].type === "wms"){
                    this.baseLayers[p] = L.tileLayer.wms(conf.base_layers[p].url, {maxZoom: 30,
                                                                                    layers: layerName,
                                                                                    format: format,
                                                                                    transparent: true,
                                                                                    version: '1.1.0',
                                                                                    attribution: attr})
                }
            }
        }
        // initialise the map
        this._map = L.map(this.id, {
                        zoom: 13,
                        center: [53.952612,-2.090103],
                        layers: [this.baseLayers[Object.keys(this.baseLayers)[0]]],
                        zoomControl: false,
                        attributionControl: true,
                        loadingControl: true
                        })

        // Add a zoom control
        this.zoomControl = L.control.zoom({
        position: "bottomright"
        }).addTo(this._map)

        // Create the layer control, which will be added to the sidenav
        this.layerControl = L.control.layerpanel(this.baseLayers, this.overLays, 'sb-layers', 
                                                {"legendFn": wms.OwsHelper.createLegend}).addTo(this._map)

        // Create the sidenav
        this.sidenav = L.control.sidenav('sidenav').addTo(this._map)
        L.Icon.Default.imagePath = appPath + "/node_modules/leaflet/dist/images"

        // If we got the google geocoder (we have connection), create a search control
        if (this.geocoder != undefined){
            this.searchControl = new L.Control.Search({
                                                        sourceData: this.googleGeocoding.bind(this),
                                                        formatData: this.formatJSON.bind(this),
                                                        markerLocation: false,
                                                        circleLocation: false,
                                                        autoType: false,
                                                        autoCollapse: true,
                                                        position: 'bottomright',
                                                        minLength: 2,
                                                        zoom: 10
                                                    })
            this._map.addControl(this.searchControl)
        }
    }

    /**
     * Shortcut for adding an event callback
     */
    on(event, callback){
        this._map.on(event, callback)
    }


    /**
     * Formats the response of the google geocoding service into JSON
     * expected by the leaflet search control
     */
    formatJSON (rawjson){
        var json = {},
        key, loc = []
        for(var i in rawjson)
        {
            key = rawjson[i].formatted_address

            loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() )

            json[ key ]= loc	//key,value format
        }
        return json
    }

    /*
     * Get the current position of the map as a bbox and zoom level.
     * Returns an object: {bbox: [west, south, east, north], zoom: zoom_level}
     */
    getPosition(){
        var bounds = this._map.getBounds()
        var position = {bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
                        zoom: this._map.getZoom()}
        return position
    }
    
    /**
     * Show a sidenav tab by ID
     */
    showsidenavTab (id){
        this.sidenav.open(id)
    }

    /**
     * Close a sidenav tab by ID
     */
    closesidenavTab (id){
        this.sidenav.close(id)
    }
    /**
     * Disable all map interaction
    *
    */
    disable (){
        this._map.scrollWheelZoom.disable()
        this._map.dragging.disable()
        this._map.touchZoom.disable()
        this._map.doubleClickZoom.disable()
        this._map.boxZoom.disable()
        this._map.keyboard.disable()
    }

    
    /**
     * Enable all map interaction
    *
    */
    enable (){
        this._map.scrollWheelZoom.enable()
        this._map.dragging.enable()
        this._map.touchZoom.enable()
        this._map.doubleClickZoom.enable()
        this._map.boxZoom.enable()
        this._map.keyboard.enable()
    }


    /**
     * Add an overlay WMS layer to the map
     */
    addWmsOverlay (host, service, layerName, displayName, format, attr){
        // Get the values from the hazards-sidenav if they are not passed in
        if (typeof host === 'undefined')
            host = $("#ows-host-select").val()

        if (typeof layerName === 'undefined')
            layerName = $('#wms-layer-select').val()

        if (typeof displayName === 'undefined')
            displayName = $('#wms-layer-select').find("option:selected").text()

        if (typeof format == 'undefined')
            format = "image/png"

        if(typeof attr == 'undefined')
            attr = ''

        if (host && layerName){

            if (service === "wms"){
                var layer = L.tileLayer.wms(host,
                    {
                    maxZoom: 30,
                    layers: layerName,
                    format: format,
                    transparent: true,
                    version: '1.1.0',
                    attribution: attr
                })

                this.overLays[displayName] = layer
                this._map.addLayer(layer)
                this.layerControl.addOverlay(layer, displayName)
            }
           else if (service === "wfs"){
               alert("Drawing WFS layers is not yet supported")
           }
           else{
               alert("Cannot create layer; Unknown service " + service)
           }
        }
    }

    /**
     * Add a Leaflet `layer` to the map
     */
    addOverlay (layer, name){
        this._map.addLayer(layer)
        this.overLays[name] = layer
        this.layerControl.addOverlay(layer, name)
    }

    /**
     * Remove an overlay layer by its name
     */
    removeOverlay (displayName){
        this._map.removeLayer(this.overLays[displayName])
    }

    googleGeocoding (text, callResponse){
        this.geocoder.geocode({address: text}, callResponse)
    }

    /*
     * Create a basic legend on the map
     * 
     * @param options Object with following parameters:
     * 
     *  className: The class name for the legend. Defaults to 'legend'
     *  position: The position of the legend. Defaults to 'bottomright'
     *  limits: The legend 'limits'. These are the values of the legend from min to max
     *  colors: The legend colors. Should be the same length as 'limits'
     */ 
    createLegend(options){
        var legend
        if (!options.className){
            options.className = "legend"
        }

        if (!options.position){
            options.position = "bottomright"
        }
        // Add legend (don't forget to add the CSS from index.html)
        var basic_legend = L.control({ position: options.position })
        basic_legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', options.className)
            var limits = options.limits
            var colors = options.colors
            var labels = []

            // Add min & max
            div.innerHTML = '<div class="legend-labels"><div class="min">' + limits[0] + '</div> \
                    <div class="max">' + limits[limits.length - 1] + '</div></div>'

            limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
            })

            div.innerHTML += '<ul>' + labels.join('') + '</ul>'
            return div
        }

        if (options.draggable){
             legend = new L.Draggable(basic_legend)
            legend.enable()
        }
        else {
            legend = basic_legend
        }
        legend.addTo(this._map)

        return legend
    }

}

module.exports.MapControl = MapControl
module.exports.registerMapCtrl = registerMapCtrl
module.exports.getMapCtrl = getMapCtrl