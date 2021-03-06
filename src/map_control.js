// Get the app variable to figure out paths to resources etc
const app = require('electron').remote.app;
const appPath = app.getAppPath();

const $ = jQuery = require('jQuery');
const L = require('leaflet');
require('./layerpanel.js');
require('../vendors/js/leaflet-sidebar.js');
require('../vendors/js/leaflet-wms-getlegendgraphic.js');
require('leaflet-search');
const wms = require('./wms.js');
require('bootstrap-select');

const {MTDom} = require('./dom.js');

/**
 * Load a file and invoke a callback function
 */
function _load_config(path, callback){

    $.ajax({
                url: path,
                cache: true,
                success: function(data) {
                    callback(data);
                }
            });
};

var _MCTRL_LIST = {};

/**
 * Cache a MapControl instance so it may be retrieved later
 */
function registerMapCtrl(mapCtrl, name){
    _MCTRL_LIST[name] = mapCtrl;
};

function getMapCtrl(name = "default"){
    return _MCTRL_LIST[name];
};

/**
 * \brief MapControl
 * 
 * Brings together the various elements of the MapThing GUI - essentially
 * representing the main html 'window'
 */
function MapControl(id){
    if (typeof(id)==='undefined') id = 'map';
        this.id = id;

    /** INST. PROPERTIES */
    this.baseLayers = {};
    this.overLays = {}; // Holds any overlay layers added
    if(google != undefined){
        this.geocoder = new google.maps.Geocoder();
    }

    // Load the baselayers into an obj
    _load_config("./conf/conf.json", this.init.bind(this));

};


/**
 * Initialises the map and base layers from the configuration file
 */
MapControl.prototype.init = function(data){
    var jsonObj = JSON.parse(data);
    if (jsonObj.hasOwnProperty("base_layers")){
        for (var p in jsonObj.base_layers){
            if (jsonObj.base_layers.hasOwnProperty(p)){
                if (jsonObj.base_layers[p].type === "tileLayer"){
                    this.baseLayers[p] = L.tileLayer(jsonObj.base_layers[p].url, { attribution: jsonObj.base_layers[p].attribution});
                }
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
                    });

    // Add a zoom control
    this.zoomControl = L.control.zoom({
      position: "bottomright"
    }).addTo(this._map);

    // Create the layer control, which will be added to the sidebar
    var ws = new wms.WebService();
    this.layerControl = L.control.layerpanel(this.baseLayers, this.overLays, 'sb-layers', {"legendFn": ws.createLegend}).addTo(this._map);

    // Create the sidebar
    this.sidebar = L.control.sidebar('sidebar').addTo(this._map);
    L.Icon.Default.imagePath = appPath + "/node_modules/leaflet/dist/images";

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
                                                });
        this._map.addControl(this.searchControl);
    }
    if (jsonObj.hasOwnProperty("wms")){
        this.configWmsHosts(jsonObj.wms);
    }
};

MapControl.prototype.configWmsHosts = function(jsonData){

    for (var p in jsonData){
        if (jsonData.hasOwnProperty(p)){
            $('#wms-host-select')
                .append($('<option>', {value: jsonData[p]})
                .text(p));
        }
    }
    $('#wms-host-select').selectpicker('refresh');

};

/**
 * Get the capabilities for the selected WMS host 
 * and add each layer to the select picker dropdown
 */
MapControl.prototype.updateWmsOptions =  function(e){
    MTDom.showLoading("#sb-overlays");
    var url = $('#wms-host-select').find("option:selected").val();
    var ws = new wms.WebService(url);
    console.log(url);
    $('#wms-layer-select').find('option').remove();
    ws.getCapabilities({success: function(xml){
        var layers = $(xml).find('Layer');
        layers.each(function(index, value){
            var option = '<option value="' + $(this).children("Name").text() + '">' + $(this).children("Title").text() + '</option>';
            $("#wms-layer-select").append(option);
        });
        $("#wms-layer-select").selectpicker('refresh');
        MTDom.hideLoading("#sb-overlays");
    }, error: function(){console.log("error");}});
};

/**
 * Formats the response of the google geocoding service into JSON
 * expected by the leaflet search control
 */
MapControl.prototype.formatJSON = function(rawjson){
    var json = {},
        key, loc = [];
    for(var i in rawjson)
    {
        key = rawjson[i].formatted_address;

        loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );

        json[ key ]= loc;	//key,value format
    }
    return json;
};


/**
 * Show a sidebar tab by ID
 */
MapControl.prototype.showSidebarTab = function(id){
    this.sidebar.open(id);
};

/**
 * Close a sidebar tab by ID
 */
MapControl.prototype.closeSidebarTab = function(id){
    this.sidebar.close(id);
};
/**
  * Disable all map interaction
  *
  */
MapControl.prototype.disable = function(){
    this._map.scrollWheelZoom.disable();
    this._map.dragging.disable();
    this._map.touchZoom.disable();
    this._map.doubleClickZoom.disable();
    this._map.boxZoom.disable();
    this._map.keyboard.disable();
};

/**
  * Enable all map interaction
  *
  */
MapControl.prototype.enable = function(){
    this._map.scrollWheelZoom.enable();
    this._map.dragging.enable();
    this._map.touchZoom.enable();
    this._map.doubleClickZoom.enable();
    this._map.boxZoom.enable();
    this._map.keyboard.enable();
};

/**
 * Add an overlay WMS layer to the map
 */
MapControl.prototype.addWmsOverlay = function (host, layerName, displayName, format, attr){
    // Get the values from the hazards-sidebar if they are not passed in
    if (typeof host === 'undefined')
        host = $("#wms-host-select").val();

    if (typeof layerName === 'undefined')
        layerName = $('#wms-layer-select').val();

    if (typeof displayName === 'undefined')
        displayName = $('#wms-layer-select').find("option:selected").text();

    if (typeof format == 'undefined')
        format = "image/png";

    if(typeof attr == 'undefined')
        attr = '';

    if (host && layerName){
        var layer = L.tileLayer.wms(host,
            {
            maxZoom: 30,
            layers: layerName,
            format: format,
            transparent: true,
            version: '1.1.0',
            attribution: attr
        });

        this.overLays[displayName] = layer;
        this._map.addLayer(layer);
        this.layerControl.addOverlay(layer, displayName);
    }
};

/**
 * Add a Leaflet `layer` to the map
 */
MapControl.prototype.addOverlay = function (layer, name){
    this._map.addLayer(layer);
    this.overLays[name] = name;
    this.layerControl.addOverlay(layer, name);
};

/**
 * Remove an overlay layer by its name
 */
MapControl.prototype.removeOverlay = function(displayName){
    this._map.removeLayer(this.overLays[displayName]);
};

MapControl.prototype.googleGeocoding = function(text, callResponse){
    this.geocoder.geocode({address: text}, callResponse);
};

module.exports.MapControl = MapControl;
module.exports.registerMapCtrl = registerMapCtrl;
module.exports.getMapCtrl = getMapCtrl;