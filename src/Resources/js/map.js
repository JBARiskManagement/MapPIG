/**
* Main JS for map thing prototype
*
*
* Demo Geoserver URL and map layer: 
*
* http://localhost:8080/geoserver/geotiff_maps/gwc/service/wmts
* geotiff_maps:River10Q200D_cm_lzw
*/


// global namespace
var MT = MT || {};



/**
* Controls creation of map, base layers and overlays
*/
MT.MapController = function (){
    this.overLays = {}; // Holds any overlay layers added
    this.jcalfLayers = [];
    var tonerLite = new L.StamenTileLayer("toner-lite");
    var toner = new L.StamenTileLayer("toner");
    var watercolor = new L.StamenTileLayer("watercolor");
    var terrain = new L.StamenTileLayer("terrain");
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          });
    this.geocoder = new google.maps.Geocoder();

    // initialise the map
    this.mmap = L.map('map', {
                      zoom: 13,
                      center: [53.952612,-2.090103],
                      layers: [tonerLite],
                      zoomControl: false,
                      attributionControl: true,
                      loadingControl: true
                    });

    // Add a zoom control
    this.zoomControl = L.control.zoom({
      position: "bottomright"
    }).addTo(this.mmap);

    // Add a layer control with the base layers
    var baseLayers = {
      "toner-lite": tonerLite,
      "toner": toner,
      "watercolor": watercolor,
      "terrain (North America only)": terrain,
      "osm": osm
    };

    //this.layerControl = L.control.extendedlayers(baseLayers).addTo(this.mmap);

    this.sidebar = L.control.sidebar('sidebar').addTo(map);
    this.layerControl = L.control.layerpanel(baseLayers, this.overLays, 'sb-layers').addTo(map);

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
    this.mmap.addControl(this.searchControl);
}

/**
  * Disable all map interaction
  *
  */
MT.MapController.prototype.disable = function()
{
    this.mmap.scrollWheelZoom.disable();
    this.mmap.dragging.disable();
    this.mmap.touchZoom.disable();
    this.mmap.doubleClickZoom.disable();
    this.mmap.boxZoom.disable();
    this.mmap.keyboard.disable();
}

/**
  * Enable all map interaction
  *
  */
MT.MapController.prototype.enable = function()
{
    this.mmap.scrollWheelZoom.enable();
    this.mmap.dragging.enable();
    this.mmap.touchZoom.enable();
    this.mmap.doubleClickZoom.enable();
    this.mmap.boxZoom.enable();
    this.mmap.keyboard.enable();
}

/**
 * addOverlay
 *      Add an overlay WMS layer to the map
 */
MT.MapController.prototype.addWmsOverlay = function ()
{
    // Get the values from the hazards-sidebar
    var host = $("#hazardmaphost").val();
    var layerName = $("#layer").val();
    var format = $("#format").val();
    var tms = $("#tms").is(':checked');
    var displayName;

    if (tms === false){
        var layer = L.tileLayer.wms(host,
            {
            maxZoom: 30,
            layers: layerName,
            format: format,
            transparent: true,
            version: '1.1.0',
            attribution: "&copy 2015 JBA Risk Management Ltd"
        });
        var layerNameParts = layerName.split(":");
        if (layerNameParts.length === 2)
        {
        displayName = layerNameParts[1];
        }
        else
        {
        displayName = layerName;
        }
     };

    this.overLays[displayName] = layer;
    this.mmap.addLayer(layer);
    this.layerControl.addOverlay(layer, displayName);
}

MT.MapController.prototype.addOverlay = function (layer, name)
{
    this.mmap.addLayer(layer);
    this.layerControl.addOverlay(layer, name);
}

/**
 * Remove one of the overlays from the map via its' name
 */
MT.MapController.prototype.removeOverlay = function(displayName)
{
    this.mmap.removeLayer(this.overLays[displayName])
}

MT.MapController.prototype.googleGeocoding = function(text, callResponse)
{
    this.geocoder.geocode({address: text}, callResponse);
}


MT.MapController.prototype.formatJSON = function(rawjson)
{
    var json = {},
        key, loc, disp = [];
    for(var i in rawjson)
    {
        key = rawjson[i].formatted_address;

        loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );

        json[ key ]= loc;	//key,value format
    }
    return json;
}

MT.showMessage = function(msg, title)
{
    bootbox.dialog({ message: msg,
                     title: title,
                     buttons: {main: {label: "Ok",
                           className: "btn-primary"}}
                   });
}


/** Jcalf interrogation
* To be integrated into the jcalfLayer class above
**/
/*
function getResultsForRisksInView()
{
    var bnds = map.getBounds();
    var ulx = bnds.getWest();
    var lrx = bnds.getEast();
    var uly = bnds.getNorth();
    var lry = bnds.getSouth();    
    npoints = pyBridge.getLecByBounds(ulx, uly, lrx, lry);
    
    var positions = [1, 20, 75, 100, 200, 500, 1000, 1500];
    
    var loss = [];
    var rp = [];
    var thisloss;
    
    for (i=0; i < positions.length; i++){
        pyBridge.nextLecResult(positions[i]-1);
        thisloss = pyBridge.getLoss();
        if (thisloss)
        {
            console.log(thisloss);
            loss.push(thisloss);
            rp.push(pyBridge.getRP());
        }
    }
    
    var data = {
        labels: rp,
        datasets: [
            { 
                label: "Loss Exceedance Curve (risks in view)",
                fillColor: "rgba(233,131,0,0.2)",
                strokeColor: "rgba(233,131,0,0.9)",
                pointColor: "rgba(233,131,0,0.9)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(233,131,0,0.9)",
                data: loss      
            }                
        ]    
    };
    
    var ctx = document.getElementById("lecPopupChart").getContext("2d");
    lecChart = new Chart(ctx).Line(data);
    
}
*/

// Icon creation function for cluster layers
function createIcon(data, category)
{

    return L.icon({
        iconUrl: 'qrc:/../Resources/img/ffa500-marker-32.png',
        iconSize:[32,32],
        iconAnchor: [1,16],
        popupAnchor: [16,0]
    });

}

function showModal(id){
    $("#" + id).modal("show");
}

function initMap(){

    // Sets up the actual map
    var mapCtrl = new MT.MapController();

    // Button events
    $(window).resize(function() {
      sizeLayerControl();
    });


    $("#about-btn").click(function() {
      $("#aboutModal").modal("show");
      $(".navbar-collapse.in").collapse("hide");
      return false;
    });

    $("#analysis-btn").click(function() {
      $('#analysis-sidebar').toggle();
      mapCtrl.mmap.invalidateSize();
      return false;
    });

    $("#csv-btn").click(function() {
      $('#csv-sidebar').toggle();
      mapCtrl.mmap.invalidateSize();
      return false;
    });

    $("#db-btn").click(function() {
      $('#db-sidebar').toggle();
      mapCtrl.mmap.invalidateSize();
      return false;
    });

    $("#hazards-btn").click(function() {
      $('#hazards-sidebar').toggle();
      mapCtrl.mmap.invalidateSize();
      return false;
    });

    $("#geocode-btn").click(function() {
      $('#geocode-sidebar').toggle();
      mapCtrl.mmap.invalidateSize();
      return false;
    });

    $("#nav-btn").click(function() {
      $(".navbar-collapse").collapse("toggle");
      return false;
    });

    $("#sidebar-toggle-btn").click(function() {
      $("#db-sidebar").toggle();
      mapCtrl.mmap.invalidateSize();
      return false;
    });

    $("#csv-sidebar-hide-btn").click(function() {
      $('#csv-sidebar').hide();
      mapCtrl.mmap.invalidateSize();
    });

    $("#db-sidebar-hide-btn").click(function() {
      $('#db-sidebar').hide();
      mapCtrl.mmap.invalidateSize();
    });

    $("#hazards-sidebar-hide-btn").click(function() {
      $('#hazards-sidebar').hide();
      mapCtrl.mmap.invalidateSize();
    });

    $("#analysis-sidebar-hide-btn").click(function() {
      $('#analysis-sidebar').hide();
      mapCtrl.mmap.invalidateSize();
    });

    $("#geocode-sidebar-hide-btn").click(function() {
      $('#geocode-sidebar').hide();
      mapCtrl.mmap.invalidateSize();
    });


    $("#db-submit").click(function() {
        var host = $("#host").val();
        var port = $("#port").val();
        var user = $("#user").val();
        var pwd = $("#pwd").val();

        var jcalflyr = new MT.DataLayer(mapCtrl);
        jcalflyr.jcalf(host, port, user, pwd)
        // connect signals from bridge
    });

    $("#open-file").click(function(){
        // Connect the button event to the Qt bridge object in order to display a file browser widget/
        // We dont do this in javascript as webkit purposefully hides the file path
        BRIDGE.connectToPathField(document.getElementById("file-path"));
        BRIDGE.showOpenFileDialog();

    });

    $("#csv-submit").click(function(){
        var path = $("#file-path").text();
        console.log(path);

        var csvlyr = new MT.CsvLayer(mapCtrl, path);
    });

    $("#hazard-submit").click(function() {
        mapCtrl.addWmsOverlay();
    });

    $("#geocode-submit").click(function() {
        mapCtrl.geocode($("#address").val());
    });


    $("#summarize-view-btn").click(function (){

        $("#lecModal").on('shown.bs.modal',
                            function(event)
                            {
                               getResultsForRisksInView();
                            }).on('hidden.bs.modal',
                            function(event)
                            {
                            // reset canvas size
                            var modal = $(this);
                            var canvas = modal.find('.modal-body canvas');
                            canvas.attr('width','568px').attr('height','300px');
                            // destroy modal
                            lecChart.clear();
                            lecChart.destroy();
                            $(this).data('bs.modal', null);
                            });
        showModal("lecModal");
    });

    function sizeLayerControl() {
      $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    }
}



L.Control.LayerPanel = L.Control.Layers.extend({

     initialize: function(baseLayers, overlays, id, options){

         this._container = L.DomUtil.get(id);
         return L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);


     },

    _initLayout: function(){
        console.log("Init layout");
        var className = 'leaflet-panel-layers',
            container = this._container;

        var form = this._form = L.DomUtil.create('form', className + '-list');

        var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
        link.href = '#';
        link.title = 'Layers';

        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._separator = L.DomUtil.create('div', className + '-separator', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        container.appendChild(form);
        console.log("Finished init");

    },
    onAdd: function(map){
        console.log("onAdd");
        var result = L.Control.Layers.prototype.onAdd.call(this, map);
        console.log(this._map);
        return result;
    },
    onRemove: function(){
        return L.Control.Layers.prototype.onRemove.call(this);
    }




});

L.control.layerpanel = function (baseLayers, overlays, id, options) {
    return new L.Control.LayerPanel(baseLayers, overlays, id,options);
};


