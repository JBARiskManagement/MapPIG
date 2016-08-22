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
require('leaflet-loading');
require('leaflet-search');
require('leaflet-draw');
require(appPath + '/vendors/js/leaflet-sidebar.js');
require(appPath + '/vendors/js/leaflet-wms-getlegendgraphic.js');
const prunecluster = require(appPath + '/vendors/PruneCluster/PruneCluster.min.js');


const jqueryloading = require(appPath + '/vendors/jquery-loading-overlay/loadingoverlay.min.js');
require("bootstrap");
const bsSelect = require("bootstrap-select");
//const screenshot = require('electron-screenshot-app')


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
};/**
* MapThing DOM utilities
*
*/

const {dialog} = require('electron').remote;
const bootbox = require('bootbox');
require("bootstrap-switch");
require('bootstrap-modal');

MT.PluginGui = function()
{
    this._elements = [];
};


/**
 * Add a panel to the sidebar
 *
 * @example
 * sidebar.addPanel({
       title: 'My Awesome Panel'
 *     id: 'sb-awesome-panel',
 *     tab: '<i class="fa fa-fort-awesome"></i>',
 *     pane: someDomNode.innerHTML,
 *     position: 'bottom'
 * });
 *
 * @param {Object} [data] contains the data for the new Panel:
 * @param {String} [data.title] the title for the new panel
 * @param {String} [data.id] the ID for the new Panel, must be unique for the whole page
 * @param {HTMLString} {DOMnode} [data.content] content of the panel, as HTMLstring or DOM node
 * @param {String} [data.position='top'] where the tab will appear:
 *                                       on the top or the bottom of the sidebar. 'top' or 'bottom'
 * @param {HTMLString} {DOMnode} [data.tab]  content of the tab item, as HTMLstring or DOM node
 */
MT.PluginGui.prototype.sidebarPanel = function(data)
{
    var panel = MT.Dom._makeSidebarPanel(data.title, data.id+"-panel");
    this._elements.push(data.id+"-panel");
    this._elements.push(data.id);

    panel.append(data.content);
    data.pane = panel[0];
    MT.Dom._addSidebarPanel(data);
};

/**
 * Create a modal dialog. The modal can be shown by calling `modal` on the return element,
 * e.g.:
 *    var mymodal  = pluginGui.modal(data);
 *    mymodal.modal();
 *
 *  @param {bool} [data.fullwidth] If true, the modal will scale to the width of the container
 *  @param {bool} [data.draggable] If true, the modal will be draggable
 *  @param {string} [data.id] Id of the modal
 *  @param {string} [data.title] Title of the modal window
 *  @param {HTMLString} {DOMNode} [data.body] Content of the modal body
 *  @param {HTMLString} {DOMNode} [data.footer] Content of the modal footer
 */
MT.PluginGui.prototype.modal = function(data)
{
    // Check the modal doesnt already exist on the DOM and remove if so
    $("#"+data.id).remove();

    if (data.fullwidth)
    {
        data.class="modal container fade";
    }
    else
    {
        data.class="modal fade";
    }

    if (data.draggable)
    {
        data.class += " modal-draggable";
    }

    var html = MT.templates.modal(data);

    // Record the modal id in the elements to remove on plugin exit
    this._elements.push(data.id);

    // Append the modal to the main page
    $("body").append(html);

    // Return the dom node
    var modal = $("#"+data.id);
    if (data.draggable)
    {
        modal.draggable({handle: ".modal-header"});
    }
    return modal;
};

/**
 * Create a modal dialog. The modal can be shown by calling `modal` on the return element,
 * e.g.:
 *    var mymodal  = pluginGui.modal(data);
 *    mymodal.modal();
 *
 *  @param {bool} [data.fullwidth] If true, the modal will scale to the width of the container
 *  @param {bool} [data.draggable] If true, the modal will be draggable
 *  @param {string} [data.id] Id of the modal
 *  @param {string} [data.title] Title of the modal window
 *  @param {HTMLString} {DOMNode} [data.footer] Content of the modal footer
 *  @param {object} [data.chartData] Chart data
 * @param {object} [data.chartLayout] Chart layout
 */
MT.PluginGui.prototype.modalChart = function(data)
{
    var chartId = data.id+"-chart";
    data.body = "<div id='"+chartId+"'></div>";
    var mod = this.modal(data);

    Plotly.newPlot(chartId, data.chartData, data.chartLayout, {showLink: false, displaylogo: false});
    return mod;

};

/**
 * Create a modless dialog
 *
 *
 */
MT.PluginGui.prototype.modeless = function(data)
{

};

MT.PluginGui.prototype.close = function()
{
    for (var i = 0; i < this._elements.length; i++)
    {
        $('#'+this._elements[i]).remove();
    }
};

MT.Dom = {
    showMessage: function(msg, title){
        bootbox.dialog({ message: msg,
                         title: title,
                         buttons: {main: {label: "Ok",
                               className: "btn-primary"}}
                       });
    },

    _makeSidebarPanel: function(title, id)
    {
        var panel = $("<div>", {
                                class: "sidebar-pane",
                                id: id
                              });

        var header = $("<h1>",
                        {
                           class: "sidebar-header",
                           html: title+'<div class="sidebar-close"><i class="fa fa-caret-left"></i></div>'
                        });

        panel.append(header);
        return panel;

    },

    _addSidebarPanel: function(data){
        MT._mCtrl.sidebar.addPanel(data);
    },

    hideSidebar: function(){
        $('#sidebar').hide();
    },

    showSidebar: function(){
        $('#sidebar').show();
    },

    prepareMapForPrint: function(){
        this.hideSidebar();
        var mc = MT.getMap();
        mc.zoomControl.remove();
        mc.searchControl.remove();
    },

    resetMapAfterPrint: function(){
        this.showSidebar();
        var mc = MT.getMap();
        mc.zoomControl.addTo(mc._map);
        mc.searchControl.addTo(mc._map);
    },

    showLoading: function(selector){
        $(selector).LoadingOverlay("show");
    },

    hideLoading: function(selector){
        $(selector).LoadingOverlay("hide");
    },

    /**
    * Adds a button to the 'plugin' sidebar with the name of this plugin
    */
    addPluginLauncher: function(pluginName, setupFunc, description){
        // Create an id for the launcher button
        var id = pluginName + 'launch';

        // Get the JS function which sets up the UI. The function may be namespaced, so
        // we can split the function string on the dot separator and pull out each object in turn
        // starting with the 'window'  object
        var parts = setupFunc.split(".");
        for (var i = 0, len = parts.length, obj = window; i < len; ++i)
        {
            obj = obj[parts[i]];
        }
        // Create the button
        var button = MT.templates.switch({id: id, name:id, label: pluginName});
        $("#plugin-launchers").append(button);

        $("#"+id).bootstrapSwitch();
        $("#"+id).on('switchChange.bootstrapSwitch', function(event, state){obj(state);});
        $(".bootstrap-switch-id-"+id).tooltip({
                           placement: 'right',
                           title: description
                       });
        console.log($(".bootstrap-switch-id-"+id));

    },

    addFileOpenForm: function(id)
    {
        var btnId = id+'-open-file-btn';
        var spanId = id+'-file-path-span';
        // form for file input
        var form = $('<form/>', {
              class: 'csv-form'
          });

        // The form group div contains the file browser button
        var fgrp = $('<div/>', {class: 'form-group'});
        var label = $('<label/>', {for: btnId, text: 'Load file'});
        var input = $('<div/>', {class: 'input-group'});
        var brwsSpan = $('<span/>', {class: 'input-group-btn'});
        var brwsBtn = $('<button/>', {class: 'btn btn-default',
                        type: 'button',
                        id: btnId,
                        text: 'Browse...',
                        click: function(){
                            // TODO! needs a callback to actual use it
                            dialog.showOpenDialog({properties: ['openFile']});

                        }});

        var pthSpan = $('<span/>', {class: 'form-control',
                                    id: spanId});

        brwsSpan.append(brwsBtn);
        input.append(brwsSpan);
        input.append(pthSpan);
        fgrp.append(label);
        fgrp.append(input);
        form.append(fgrp);

        return form;


    },

    /*
    * Open a file browser dialog when the given buttinId is clicked
    */
    addFileOpenHandler: function(buttonId, callback){
        $('#'+buttonId).click(function(){
            // TODO - complete!
            dialog.showOpenDialog({properties: ['openFile']}, callback);

        });

    }
};
;// Interactive tour/demo of MapThing
const Tour = require("bootstrap-tour");

MT.tour = new Tour({
  backdrop: false,
  steps: [
    {
    orphan: true,
    title: "Welcome!",
    content: "MapThing is a visual showcase and integration platform for JBA RML data and tools. " +
             "This short tour is intended to get you familiar with the user interface.",
    onShow: function(tour){MT.getMap().closeSidebarTab("sb-help");}
    },
    {
    element: "#container",
    placement: "top",
    title: "The Map",
    content: "It's all about the map. The key idea behind MapThing is simplicity. " +
            "As such the main focus of the core program is on visualisation and generating images. It allows you to quickly navigate the map, add overlays from web services " +
             "and print images. Plugins can extend the functionality " +
             "of MapThing to create new overlays from different sources, charts and provide more complex analysis of JBA data. ",
    },
    {
    element: ".sidebar",
    title: "Sidebar",
    content: "Clicking on a sidebar button will display a panel for the selected feature. Hovering over buttons will popup a short description."
    },
    {
    element: "#sb-btn-layers",
    title: "Display the layer control",
    content: "MapThing offers a rudimentary layer control. "
    },
    {
    element: "#sb-layers",
    title: "Layers Control",
    content: "Switch between a selection of basemap layers and show/hide or remove overlays which have been added to the map",
    onShow: function(tour){MT.getMap().showSidebarTab("sb-layers");},
    onHide: function(tour){MT.getMap().closeSidebarTab("sb-layers");}
    },
    {
    element: "#sb-btn-overlays",
    title: "WMS Overlays",
    content: "MapThing is pre-configured to connect to a few WMS' suitable for JBA RML needs in order to quickly add overlays." +
             " Lets expand the tab and see what is available"
    },
    {
    element: "#wms-host-select",
    title: "Select a host",
    content: "Select a web service from the drop down list. Environment Agency & FEMA WMS' are available. JBA RML's own service for hazard map data will be available in the near future",
    onShow: function(tour){MT.getMap().showSidebarTab("sb-overlays");},
    },
    {
    element: "#wms-layer-select",
    title: "Select a layer",
    content: "Once a host has been selected, this dropdown will populate with the available layers. You can browse through or search for a desired layer and select it"
    },
    {
    element: "#overlay-submit",
    title: "Add the layer",
    content: "Found a layer you want? Click this button to add it to the map. It will appear in the layer control. Some WMS layers have legends. If a legend is available, it will be displayed and can be hidden/shown via the layer control",
    onHide: function(tour){MT.getMap().closeSidebarTab("sb-overlays");}
    },
    {
    element: "#sb-btn-plugin",
    title: "Plugins",
    content: "MapThings' analysis functionality and integration with other JBA tools and methods comes from the extensible plugin framework" +
             " Available plugins are displayed in this panel and can be enabled by clicking the corresponding button." +
             "The plugin possibilities are huge, so don't hesitate to get in touch with any wild and crazy ideas."
    },
    {
    element: "#sb-btn-print",
    title: "Print",
    content: "Print the map to a PNG image! The image is created at the current size and resolution of the window. The final image will not feature any GUI elements (such as the sidebar) and a JBA RML logo will be inserted into the top left corner."
    },
    {
    placement: 'left',
    element: ".leaflet-control-search",
    title: "Search for places",
    content: "A typeahead search which makes use of Googles' Geocoding API. Type in a placename or word to search for and it will search for matching places."
    },
    {
    placement: 'left',
    element: ".leaflet-control-zoom-in",
    title: "Zoom",
    content: "No mouse wheel? No worries. Use these buttons to zoom in and out." +
             " You can also zoom with the +/- keys and navigate with the arrow keys."
    }
]});

MT.runTour = function(){

    // Initialize the tour
    MT.tour.init();

    // Start the tour
    MT.tour.start();

};
;/**
  * Creates a bubble plot scaled and coloured by the value given to each bubble.
  * Usage:
  *
  * // Create the initial layer
  * var bl = new JPA.BubbleLayer();
  *
  * // Add a bubble to the layer (typically called by a signal from the C++ Bridge object so that any
  * // processing done to calculate the bubble properties can be done in the backend)
  * // If using the default styling function, the scaledValue can be any number between 0-1 and would typically be calculated as the
  * // value/max(all_values)
  * // the value is the numeric value this bubble represents (e.g. the TIV of a portfolio locator)
  * bl.addBubble(x, y, value, scaledValue);
  *
  * // Style the layer and add it to the map
  * // style_fn is an optional function which supplies the styling properties for a single geojson feature
  * bl.addToMap([style_fn]);
  *
  */
MT.BubbleLayer = function(layerName){

    this._layer = L.geoJson();
    this.name = layerName;
};

MT.BubbleLayer.prototype.addBubble = function(x, y, value, scaledValue){
    var circle = L.circle([x,y], scaledValue * 10000);
    var circleJson = circle.toGeoJson();
    circleJson.properties.value = value;
    circleJson.properties.scaling = scaledTiv;
    //circleJson.properties.nrisks = nrisks;

    this._layer.addData(circleJson);
};

MT.BubbleLayer.prototype.addToMap = function(styleFn){

    if (typeof styleFn === 'undefined')
        styleFn = default_style;

    this._layer.setStyle(styleFn);
    var mapCtrl = MT.getMap();

    mapCtrl.addOverlay(this._layer, this.layerName);

};

function getColor(d) {
    return d > 0.8 ? '#7f2704' :
           d > 0.7 ? '#a63603' :
           d > 0.6 ? '#d94801' :
           d > 0.5 ? '#f16913' :
           d > 0.4 ? '#fd8d3c' :
           d > 0.3 ? '#fdae6b' :
           d > 0.2 ? '#fdd0a2' :
           d > 0.1 ? '#fee6ce' :
                     '#fff5eb';
}

function default_style(feature) {
    return {
        fillColor: getColor(feature.properties.scaling),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
;/*
 * DataLayer
 *      A cluster layer whose markers can be defined by exposures from a JCalf database
 *
 */
MT.DataLayer = function(mapCt){
    this.mapCt = mapCt;
    this.layerName = "unknown";
};


MT.DataLayer.prototype.jcalf = function(host, port, user, pwd)
{
    this.host = host;
    this.port = port;
    this.user = user;
    this.pwd = pwd;
    this.layerName = "JCalf: " + host;
    this.lastUpdate = +new Date();
};

MT.DataLayer.prototype.remove = function(){
       delete this.clusterLayer;
};

MT.DataLayer.prototype.maybeCreateLayer = function(status)
{
    if (status === true)
    {
        console.log("Setting up layer");
        // Connect map move events to updating jcalf layers
        var self = this;
        //this.mapCt._map.on('moveend', function(){self.update()});
        this.clusterLayer = new PruneClusterForLeaflet(); // The marker cluster layer
        this.mapCt.addOverlay(this.clusterLayer, this.layerName);
        this.update();
        //this.addClusterSizeWidget();
    }
    else
    {
        MT.Dom.showMessage("Unknown error", "Unable to connect to the database");
    }
};


MT.DataLayer.prototype.processView = function()
{
    $("#map").trigger("dataloading");
    this.clusterLayer.ProcessView();
    $("#map").trigger("dataload");
    $("#disable-overlay").hide();
    this.mapCt.enable();
};

/**
 * update
 *     Redraws the marker layer with all the risks in the current bounding box
 *
 */
MT.DataLayer.prototype.update = function(){
    // Only update the risks if the layer is displayed
    if (this.mapCt._map.hasLayer(this.clusterLayer))
    {
        // Prevent user from issuing another move command while we update
        $("#disable-overlay").show();
        this.mapCt.disable();
        var bounds = this.mapCt._map.getBounds();
        this.clusterLayer.RemoveMarkers();
    }
};

/*
 * addRiskMarker
 *      Add a new marker to the cluster layer. Normally this would be
 *      called by the C++ 'bridge' object which has access to the JCalf
 *      database
 *
 */
MT.DataLayer.prototype.addRiskMarker = function(lat, lon, tiv){
    var marker = new PruneCluster.Marker(lat, lon);
    //marker.category = lob;
    marker.data.icon = createIcon;
    marker.data.tiv = tiv;
    //marker.data.forceIconRedraw = true;
    this.clusterLayer.RegisterMarker(marker);
    //console.log("Add risk");
};

MT.DataLayer.prototype.addClusterSizeWidget = function(){

    $('<div href="#" id="size">Cluster size: <input type="range" value="160" min="35" max="500" step="1" id="sizeInput"><span id="currentSize">112</span></div>').insertAfter("#map");
    $("#sizeInput").onChange = this.updateSize.bind(this);
    $("#sizeInput").onChange = this.updateSize.bind(this);

};

MT.DataLayer.prototype.updateSize = function(){

    var newSize = $("#sizeInput").val();
    this.clusterLayer.Cluster.Size = parseInt(newSize);
    $("#currentSize").firstChild.data = newSize;
    var now = +new Date();
    if ((now - this.lastUpdate) < 400) {
        return;
    }
    this.clusterLayer.ProcessView();
    this.lastUpdate = now;
};

MT.DataLayer.prototype.showLoadingStats = function(loaded, skipped)
{
    bootbox.dialog({message: loaded + " markers were loaded, " + skipped + " rows were skipped (did not contain lat or long values)",
                   title: "Loading finished",
                   buttons: {main: {label: "Ok",
                         className: "btn-primary"}}
                   });
};

MT.CsvLayer = function(layerName, mapCt)
{
    this.mapCt = mapCt;
    this.layerName = "unknown";
    this.layerName = layerName;
    this.createLayer(true);
};

MT.CsvLayer.prototype = new MT.DataLayer();
MT.CsvLayer.prototype.constructor = MT.CsvLayer;

MT.CsvLayer.prototype.addToMap = function()
{
    this.mapCt.addOverlay(this.clusterLayer, this.layerName);
};

MT.CsvLayer.prototype.createLayer = function(status)
{
    this.clusterLayer = new PruneClusterForLeaflet(); // The marker cluster layer
    //this.addClusterSizeWidget();
};
;
L.Control.LayerPanel = L.Control.Layers.extend({

    options: {
       collapsed: false,
       autoZIndex: false

     },

     initialize: function(baseLayers, overlays, id, options){
         this._container = L.DomUtil.get(id);
         L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);
     },

    _initLayout: function(){
        var className = 'leaflet-panel-layers',
            container = this._container;

        var form = this._form = L.DomUtil.create('form', className + '-list');

        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._separator = L.DomUtil.create('div', className + '-separator', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        container.appendChild(form);
    },

    addTo: function(map){
        //this.remove();
        this._map = map;
        this._container = this.onAdd(map);
        return this;
    },


    _onLegendClick: function(layerId){

        // TODO
        var layer = this._layers[layerId].layer;
        if (typeof layer.legendObjs === 'undefined')
        {
            layer.legendObjs = MT.Wms.createLegend(layer);
        }
        else
        {
            for (var name in layer.legendObjs)
            {
                var control = layer.legendObjs[name];
                console.log(control);
                if (control.container.hidden === false)
                {
                    console.log("Hide Control");
                    control.container.hidden = true;
                    control.container.style.visibility = 'hidden';
                    console.log(control.container.isActive);
                }
                else
                {
                    console.log("Show Control");
                    control.container.hidden = false;
                    control.container.style.visibility = 'visible';
                }
            }
        }
    },
    _onDeleteClick: function(layerId){
        layer = this._layers[layerId].layer;

        if (typeof layer.legendObjs != 'undefined')
            for (var name in layer.legendObjs)
            {
                layer._map.removeControl(layer.legendObjs[name]);
            }

        this._map.removeLayer(layer);
        this.removeLayer(layer);
        layer.remove();
    },

    _addItem: function(obj){
        var label = document.createElement('label'),
            checked = this._map.hasLayer(obj.layer),
            input, legendBtn, deleteBtn, pullLeft, pullRight,
            holder = document.createElement('div');
        holder.className = "row row-layer-control";
        pullLeft = document.createElement('div');
        pullLeft.className = "pull-left";
        pullRight = document.createElement('div');
        pullRight.className = "pull-right";

        if (obj.overlay){
            //holder.className = 'checkbox';
            input = document.createElement('input');
            input.className = 'leaflet-control-layers-selector';
            input.type='checkbox';
            input.defaultChecked = checked;

            //data-placement="bottom" data-toggle="tooltip" title="Select a WMS service to browse layers

            var buttonClass = "btn btn-secondary btn-layer-control";
            legendBtn = document.createElement('a');
            legendBtn.className = buttonClass;
            var legendIcon = document.createElement('i');
            legendIcon.className = "fa fa-list-ul";
            legendBtn.setAttribute("data-placement", "left");
            legendBtn.setAttribute("data-toggle", "tooltip");
            legendBtn.setAttribute("title", "Add the layer's legend to the map (if available)");
            legendBtn.appendChild(legendIcon);

            deleteBtn = document.createElement('a');
            deleteBtn.className = buttonClass;
            deleteBtn.setAttribute("data-placement", "left");
            deleteBtn.setAttribute("data-toggle", "tooltip");
            deleteBtn.setAttribute("title", "Delete layer");
            var deletIcon = document.createElement('i');
            deletIcon.className = "fa fa-trash";
            deleteBtn.appendChild(deletIcon);

            pullRight.appendChild(legendBtn);
            pullRight.appendChild(deleteBtn);

            L.DomEvent.on(legendBtn, 'click', function(){this._onLegendClick(input.layerId);}, this);
            L.DomEvent.on(deleteBtn, 'click', function(){this._onDeleteClick(input.layerId);}, this);

        } else {

            input = this._createRadioElement('leaflet-base-layers', checked);
        }

        input.layerId = L.stamp(obj.layer);
        L.DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        label.appendChild(input);
        label.appendChild(name);
        pullLeft.appendChild(label);

        holder.appendChild(pullLeft);
        holder.appendChild(pullRight);

        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
        container.appendChild(holder);
        this._checkDisabledLayers();
        return holder;

    },

    _checkDisabledLayers: function () {
        var inputs = this._form.getElementsByTagName('input'),
           input,
           layer,
           zoom = this._map.getZoom();

        for (var i = inputs.length - 1; i >= 0; i--) {
           input = inputs[i];
           layer = this._layers[input.layerId].layer;
           input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
                            (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

        }
    },
    _expand: function(){},
    _collapse: function(){}

});

L.control.layerpanel = function (baseLayers, overlays, id, options) {
    return new L.Control.LayerPanel(baseLayers, overlays, id,options);
};

;/*
 * L.Control.WMSLegend is used to add a WMS Legend to the map
 */

L.Control.WMSLegend = L.Control.extend({
    options: {
        position: 'topright',
        uri: ''
    },

    onAdd: function () {
        var controlClassName = 'leaflet-control-wms-legend',
            legendClassName = 'wms-legend',
            stop = L.DomEvent.stopPropagation;
        this.container = L.DomUtil.create('div', controlClassName);
        this.container.id = this.options.uri;
        this.img = L.DomUtil.create('img', legendClassName, this.container);
        this.img.src = this.options.uri;
        this.img.alt = 'Legend';

        L.DomEvent
            .on(this.img, 'click', this._click, this)
            .on(this.container, 'click', this._click, this)
            .on(this.img, 'mousedown', stop)
            .on(this.img, 'dblclick', stop)
            .on(this.img, 'click', L.DomEvent.preventDefault)
            .on(this.img, 'click', stop);
        this.height = null;
        this.width = null;
        return this.container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        // toggle legend visibility
        var style = window.getComputedStyle(this.img);
        if (style.display === 'none') {
            this.container.style.height = this.height + 'px';
            this.container.style.width = this.width + 'px';
            this.img.style.display = this.displayStyle;
        }
        else {
            if (this.width === null && this.height === null) {
                // Only do inside the above check to prevent the container
                // growing on successive uses
                this.height = this.container.offsetHeight;
                this.width = this.container.offsetWidth;
            }
            this.displayStyle = this.img.style.display;
            this.img.style.display = 'none';
            this.container.style.height = '20px';
            this.container.style.width = '20px';
        }
    },
});

L.wmsLegend = function (uri, map) {
    var wmsLegendControl = new L.Control.WMSLegend();
    wmsLegendControl.options.uri = uri;
    map.addControl(wmsLegendControl);
    return wmsLegendControl;
};
;this["MT"] = this["MT"] || {};
this["MT"]["templates"] = this["MT"]["templates"] || {};

this["MT"]["templates"]["modal"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + alias4(((helper = (helper = helpers["class"] || (depth0 != null ? depth0["class"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"class","hash":{},"data":data}) : helper)))
    + "\" role=\"dialog\" tabindex=\"-1\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">x</button>\n      <h3>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\n    </div>\n    <div class=\"modal-body\">\n      "
    + ((stack1 = ((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"body","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n    <div class=\"modal-footer\">\n      "
    + ((stack1 = ((helper = (helper = helpers.footer || (depth0 != null ? depth0.footer : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"footer","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n</div>\n";
},"useData":true});

this["MT"]["templates"]["switch"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<input type=\"checkbox\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-label-text=\""
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\">\n";
},"useData":true});