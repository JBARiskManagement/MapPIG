/**+
* MapController
*
*
* Demo Geoserver URL and map layer: 
*
* http://localhost:8080/geoserver/geotiff_maps/gwc/service/wmts
* geotiff_maps:River10Q200D_cm_lzw
*
*/


// Get the app variable to figure out paths to resources etc
const app = require('electron').remote.app;
const appPath = app.getAppPath();

const $ = jQuery = require('jQuery');
const L = require('leaflet');
const lload = require('leaflet-loading');
const lsearch = require('leaflet-search');
const ldraw = require('leaflet-draw');
const prunecluster = require(appPath + '/vendors/PruneCluster/PruneCluster.min.js');
const lwms = require(appPath + '/vendors/js/leaflet-wms-getlegendgraphic.js');
const lsidebar = require(appPath + '/vendors/js/leaflet-sidebar.js');
const jqueryloading = require(appPath + '/vendors/jquery-loading-overlay/loadingoverlay.min.js');
const bootstrap = require("bootstrap");
const bsSelect = require("bootstrap-select");


// global namespace
var MT = MT || {};

MT._load_config = function(path, callback){

    $.ajax({
                url: path,
                cache: true,
                success: function(data) {
                    callback(data);
                }
            });
};


MT.Wms = {
    capabilities: function(url,callback){

        if(url.indexOf('?') === -1)
            url += '?';
        else
            url += '&';

        $.ajax({
                type: "GET",
            headers: {'Access-Control-Allow-Credentials': true},
                xhrFields: {
                    withCredentials: true
                },
                url: url + 'request=GetCapabilities&service=wms',
                dataType: "xml",
                success: function(xml) {
                    callback(xml);
                },
                error: function(){MT.Dom.hideLoading("#sb-overlays");
                                 MT.Dom.showMessage("Could not connect");}
            });
    },

    createLegend: function(layer){
        
        var successFunc = function(xml) {
                        var result = $(xml).find('ServiceException[code="LayerNotDefined"]');
                        if (result)
                            console.log(result[0]);
                            MT.Dom.showMessage("No legend is available for this layer:\n"+result[0].textContent, "WMS does not provide legend");
                    };
                    
        var errorFunc = function(xhr, status, error){
                       if (status === 'parsererror')
                       {
                            legendObjs[name] = L.wmsLegend(url, layer._map);
                       }
                       else{
                           console.log(status);
                           console.log(error);
                           MT.Dom.showMessage(error.message, "Error creating legend");
                       }

                   };
        
        var legends = layer.getLegendGraphic();
        var legendObjs = {};
        for (var name in legends)
        {
            var url = legends[name];
            $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "xml",
                    success: successFunc,

                   /*
                    * Because we specified the dataType as xml, then if the URL is valid an image will be
                    * returned, which will cause jquery to invoke the error function...
                    */
                   error: errorFunc
                });
        }
        return legendObjs;
    }
};


/**
 * Register a MapController as the main instance
 */
MT._registerMap = function(mapCtrl){
    MT._mCtrl = mapCtrl;
};

MT.getMap = function(){
    return MT._mCtrl;
};

/**
* Controls creation of map, base layers and overlays
*/
MT.MapController = function (id){

    if (typeof(id)==='undefined') id = 'map';
    this.id = id;

    this.overLays = {}; // Holds any overlay layers added
    this.jcalfLayers = [];
    this.geocoder = new google.maps.Geocoder();

    // Load the baselayers into an obj
    MT._load_config(appPath + "/conf/conf.json", this.initFromConfig.bind(this));

};

/**
 * Initialises the map and base layers from the configuration file
 */
MT.MapController.prototype.initFromConfig = function(data){
    this.baseLayers = {};
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

    // Load basemaps

    this.layerControl = L.control.layerpanel(this.baseLayers, this.overLays, 'sb-layers').addTo(this._map);

    // Create the sidebar
    this.sidebar = L.control.sidebar('sidebar').addTo(this._map);
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
    if (jsonObj.hasOwnProperty("wms")){
        this.configWmsHosts(jsonObj.wms);
    }
};

MT.MapController.prototype.configWmsHosts = function(jsonData){

    for (var p in jsonData){
        if (jsonData.hasOwnProperty(p)){
            $('#wms-host-select')
                .append($('<option>', {value: jsonData[p]})
                .text(p));
        }
    }
    $('#wms-host-select').selectpicker('refresh');

};

MT.MapController.prototype.showSidebarTab = function(id){
    this.sidebar.open(id);
};

MT.MapController.prototype.closeSidebarTab = function(id){
    this.sidebar.close(id);
};

/**
  * Disable all map interaction
  *
  */
MT.MapController.prototype.disable = function(){
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
MT.MapController.prototype.enable = function(){
    this._map.scrollWheelZoom.enable();
    this._map.dragging.enable();
    this._map.touchZoom.enable();
    this._map.doubleClickZoom.enable();
    this._map.boxZoom.enable();
    this._map.keyboard.enable();
};

/**
 * addOverlay
 *      Add an overlay WMS layer to the map
 */
MT.MapController.prototype.addWmsOverlay = function (host, layerName, displayName, format, attr){
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
};

MT.MapController.prototype.addOverlay = function (layer, name){
    this._map.addLayer(layer);
    this.layerControl.addOverlay(layer, name);
};

/**
 * Remove one of the overlays from the map via its' name
 */
MT.MapController.prototype.removeOverlay = function(displayName){
    this._map.removeLayer(this.overLays[displayName]);
};

MT.MapController.prototype.googleGeocoding = function(text, callResponse){
    this.geocoder.geocode({address: text}, callResponse);
};

MT.MapController.prototype.formatJSON = function(rawjson){
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

// Icon creation function for cluster layers
function createIcon(data, category){

    return L.icon({
        iconUrl: appPath + '/img/ffa500-marker-32.png',
        iconSize:[32,32],
        iconAnchor: [1,16],
        popupAnchor: [16,0]
    });

}

function showModal(id){
    $("#" + id).modal("show");
}

function initMap(){

    $.LoadingOverlaySetup({
                        color: "rgba(255,255,255,0.8)",
                        image: appPath + "/img/big_roller.gif",
                        maxSize: "40px"
                          });

    //Setup tooltips!
    $('[data-toggle="tooltip"]').tooltip({ container: 'body' });

    // Sets up the actual map
    var mapCtrl = new MT.MapController();
    MT._registerMap(mapCtrl);

    // Button events
    $(window).resize(function() {
      sizeLayerControl();
    });

    $("#db-submit").click(function() {
        var host = $("#host").val();
        var port = $("#port").val();
        var user = $("#user").val();
        var pwd = $("#pwd").val();

        var datalyr = new MT.DataLayer(mapCtrl);
        datalyr.jcalf(host, port, user, pwd);
        // connect signals from bridge
    });

    MT.Dom.addFileOpenHandler("open-file", "file-path");


    $("#choose-file").click(function(){
        BRIDGE.connectToPathField(document.getElementById("choose-file-path"));
        BRIDGE.showSaveFileDialog();

    });

    $("#csv-submit").click(function(){
        var path = $("#file-path").text();
        var csvlyr = new MT.CsvLayer(mapCtrl, path);
    });

    $("#print-submit").click(function(){
        var path = $("#choose-file-path").text();
        BRIDGE.printRequest(path);
    });

    $("#overlay-submit").click(function() {
        mapCtrl.addWmsOverlay();
    });

    $("#geocode-submit").click(function() {
        mapCtrl.geocode($("#address").val());
    });

    $("#tour-btn").click(MT.runTour);

    function sizeLayerControl() {
      $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    }

    $('.selectpicker').selectpicker();
    $('#wms-host-select').on('change', function(e){
        MT.Dom.showLoading("#sb-overlays");
        var url = $(this).find("option:selected").val();
        $('#wms-layer-select').find('option').remove();
        MT.Wms.capabilities(url, function(xml){
            var layers = $(xml).find('Layer');
            layers.each(function(index, value){
                var option = '<option value="' + $(this).children("Name").text() + '">' + $(this).children("Title").text() + '</option>';
                $("#wms-layer-select").append(option);
            });
            $("#wms-layer-select").selectpicker('refresh');
            MT.Dom.hideLoading("#sb-overlays");
        });
    });
}