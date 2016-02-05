// global namespace
var MT = MT || {};
/**
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
;/**
* MapThing DOM utilities
*
*/

// global namespace
var MT = MT || {};

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
 * @param {String} [data.position='top'] where the tab will appear:
 *                                       on the top or the bottom of the sidebar. 'top' or 'bottom'
 * @param {HTMLString} {DOMnode} [data.tab]  content of the tab item, as HTMLstring or DOM node
 * @param {HTMLString} {DOMnode} [data.pane] content of the panel, as HTMLstring or DOM node
 */
MT.PluginGui.prototype.sidebarPanel = function(data)
{
    var panel = MT.Dom._makeSidebarPanel(data.title, data.id+"-panel");
    this._elements.push(data.id+"-panel");

    panel.append(data.pane);
    data.pane = panel[0];

    MT.Dom._addSidebarPanel(data);
};

/**
 * Create a modal dialog
 *
 *
 */
MT.PluginGui.prototype.modal = function(data)
{

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

    makePluginSidebarUi: function(name){
        var header = $('#sb-plugin-header').html();
        MT.header = header;
        $('#sb-plugin-header').html(name + '<div class="sidebar-close"><i class="fa fa-caret-left"></i></div>');

        var uiArea = $('#sb-plugin-area');
        var originalState = uiArea.contents();
        originalState.detach();

        var exitBtn = $('<button/>',
                        {
                            text: 'Exit',
                            id: 'plugin-exit-btn',
                            class: 'btn btn-default',
                            click: function(){
                                uiArea.empty();
                                uiArea.append(originalState);
                                $('#sb-plugin-header').html(header);
                            }
                        });
        var hr = $('<hr>');

        uiArea.append(exitBtn);
        uiArea.append(hr);

        return uiArea;
    },

    makeModalWindow: function(name, contents){
        var modal = $("#modalWindow");
        modal.find('.modal-title').text(name);

        modal.find('.modal-body').html(contents);

        modal.modal();
        return modal;
    },


    /**
    * Adds a button to the 'plugin' sidebar with the name of this plugin
    */
    addPluginLauncher: function(pluginName, setupFunc, description){
        // Create an id for the launcher button
        var id = pluginName + 'Launch';

        // Get the JS function which sets up the UI. The function may be namespaced, so
        // we can split the function string on the dot separator and pull out each object in turn
        // starting with the 'window'  object
        var parts = setupFunc.split(".");
        for (var i = 0, len = parts.length, obj = window; i < len; ++i)
        {
            obj = obj[parts[i]];
        }
        // Create the button
        var button = $('<button/>', {
                           text: pluginName,
                           class: 'btn btn-default',
                           id: id,
                           click: function(){ obj();}
                       });

        button.tooltip({
                           placement: 'right',
                           title: description
                       });
        // Get the area in which to create the plugin launcher button
        $("#sb-plugin-area").append(button);
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
                            console.log(btnId + ' was clicked');
                            BRIDGE.connectToPathField(document.getElementById(spanId));
                            BRIDGE.showOpenFileDialog();

                        }});

        var pthSpan = $('<span/>', {class: 'form-control',
                                    id: spanId});

        //MT.Dom.addFileOpenHandler(btnId, spanId);

        brwsSpan.append(brwsBtn);
        input.append(brwsSpan);
        input.append(pthSpan);
        fgrp.append(label);
        fgrp.append(input);
        form.append(fgrp);

        return form;


    },

    addFileOpenHandler: function(buttonId, inputId){
        console.log("file open handler " + buttonId);
        $('#'+buttonId).click(function(){
            console.log(buttonId + " was clicked");
            // Connect the button event to the Qt bridge object in order to display a file browser widget/
            // We dont do this in javascript as webkit purposefully hides the file path
            BRIDGE.connectToPathField(document.getElementById(inputId));
            BRIDGE.showOpenFileDialog();

        });

    }

};
;// global namespace
var MT = MT || {};

/*
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
        this.remove();
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
;/**
* MapController
*
*
* Demo Geoserver URL and map layer: 
*
* http://localhost:8080/geoserver/geotiff_maps/gwc/service/wmts
* geotiff_maps:River10Q200D_cm_lzw
*/


// global namespace
var MT = MT || {};


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

    this.overLays = {}; // Holds any overlay layers added
    this.jcalfLayers = [];
    //var tonerLite = new L.StamenTileLayer("toner-lite");
    var jbaBasemap = L.tileLayer("https://api.mapbox.com/v4/ianmillinship.8850fe41/{z}/{x}/{y}.png256?access_token=pk.eyJ1IjoiaWFubWlsbGluc2hpcCIsImEiOiJjaWg0eWx6OGwwMHVua3JrcjU1ZnA4bjFlIn0.mcnkt1qUDw7cH0cmhxcZ8w",
                                 {
                                    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
                                 });

    var satBasemap = L.tileLayer("https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWFubWlsbGluc2hpcCIsImEiOiJjaWg0eWx6OGwwMHVua3JrcjU1ZnA4bjFlIn0.mcnkt1qUDw7cH0cmhxcZ8w",
                                 {
                                    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
                                 });
    var streetSatBasemap = L.tileLayer("https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWFubWlsbGluc2hpcCIsImEiOiJjaWg0eWx6OGwwMHVua3JrcjU1ZnA4bjFlIn0.mcnkt1qUDw7cH0cmhxcZ8w",
                                 {
                                    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
                                 });
    this.geocoder = new google.maps.Geocoder();

    // initialise the map
    this._map = L.map(id, {
                      zoom: 13,
                      center: [53.952612,-2.090103],
                      layers: [jbaBasemap],
                      zoomControl: false,
                      attributionControl: true,
                      loadingControl: true
                    });

    // Add a zoom control
    this.zoomControl = L.control.zoom({
      position: "bottomright"
    }).addTo(this._map);

    // Add a layer control with the base layers
    var baseLayers = {
      "jba-rml": jbaBasemap,
      "satellite": satBasemap,
      "streets-satellite": streetSatBasemap,
    };


    this.sidebar = L.control.sidebar('sidebar').addTo(this._map);
    this.layerControl = L.control.layerpanel(baseLayers, this.overLays, 'sb-layers').addTo(this._map);

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
        if ($("wms-host-select").text().indexOf("JBA") > -1)
            attr = "&copy 2015 JBA Risk Management Ltd";


    console.log(host);
    console.log(layerName);
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
        iconUrl: 'mapthing/img/ffa500-marker-32.png',
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
                        image: "mapthing/img/big_roller.gif",
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

        var jcalflyr = new MT.DataLayer(mapCtrl);
        jcalflyr.jcalf(host, port, user, pwd);
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
;// Instance the tour
var MT = MT || {};

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
