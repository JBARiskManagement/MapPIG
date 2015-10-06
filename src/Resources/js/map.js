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
    var watercolor = new L.StamenTileLayer("watercolor");

    this.geocoder = new L.GeoSearch.Provider.Google();


    this.mmap = L.map('map', {
                      zoom: 13,
                      center: [53.952612,-2.090103],
                      layers: [tonerLite],
                      zoomControl: false,
                      attributionControl: true
                    });

    this.zoomControl = L.control.zoom({
      position: "bottomright"
    }).addTo(this.mmap);

    var baseLayers = {
      "toner-lite": tonerLite,
      "watercolor": watercolor
    };

    this.layerControl = L.control.layers(baseLayers).addTo(this.mmap);
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

/*
 * geocode
 *      Use the google maps geocoding API to navigate to a location
 */
MT.MapController.prototype.geocode = function(address)
{
    var mapctl = this;
    this.geocoder.GetLocations(address, function(data){
        if (data.length > 0)
        {
            var latlng= L.latLng(data[0].Y, data[0].X);
            mapctl.mmap.fitBounds(data[0].bounds,
                                   {
                                       animate: true
                                   });
            //mapctrl.mmap.invalidateSize();
        }
        else
        {
            bootbox.alert("Geocoding was not successful! " + status);
        }
    });
}

/*
 * JcalfLayer
 *      A cluster layer whose markers can be defined by exposures from a JCalf database
 *
 */
MT.JcalfLayer = function(mapCt, host, port, user, pwd){
    console.log("Creating Jcalf Layer");
    this.clusterLayer = new PruneClusterForLeaflet(); // The marker cluster layer
    this.mapCt = mapCt;
    this.mapCt.addOverlay(this.clusterLayer, "Exposures");
    this.host = host;
    this.port = port;
    this.user = user;
    this.pwd = pwd

    /*
    this.processView = function()
    {
        console.log("Process View");
        console.log(this.clusterLayer);
        this.clusterLayer.ProcessView();
        this.clusterLayer.RedrawIcons();
    }
    */


    status = BRIDGE.setJcalfDatabase(host,port,user,pwd);
    if (status === "true")
    {
        this.update();
    }
    else
    {
        bootbox.alert("Unable to connect to the database");
    }

    // Connect map move events to updating jcalf layers
    var self = this;
    mapCt.mmap.on('moveend', function(){self.update()});


}


MT.JcalfLayer.prototype.processView = function()
{
    console.log("Process View");
    console.log(this.clusterLayer);
    console.log(self);
    this.clusterLayer.ProcessView();
    this.clusterLayer.RedrawIcons();
}

/**
 * update
 *     Redraws the marker layer with all the risks in the current bounding box
 *
 * bounds:
 *  A Leaflet LatLngBounds instance
 *
 */
MT.JcalfLayer.prototype.update = function(){

    var bounds = this.mapCt.mmap.getBounds();
    // Call the C++ bridge object to get the lat longs from the jcalf database within this bounding box
    this.clusterLayer.RemoveMarkers();
    BRIDGE.refreshExposures(bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth());
}

/*
 * addRiskMarker
 *      Add a new marker to the cluster layer. Normally this would be
 *      called by the C++ 'bridge' object which has access to the JCalf
 *      database
 *
 */
MT.JcalfLayer.prototype.addRiskMarker = function(lat, lon){
    var marker = new PruneCluster.Marker(lat, lon);
    //marker.data.icon = createIcon;
    marker.data.forceIconRedraw = true;
    this.clusterLayer.RegisterMarker(marker);
}

function showModal(id){
	$("#" + id).modal("show");
}

/** Jcalf interrogation **/

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

function createIcon(data, category)
{

    return L.icon({
        iconUrl: 'qrc:/../Resources/img/ffa500-marker-32.png',
        iconSize:[32,32],
        iconAnchor: [1,16],
        popupAnchor: [16,0]
    });

}

/*
function addClusterLayer(npoints)
{
    console.log("Adding cluster layer");
    var pruneCluster = new PruneClusterForLeaflet();
    var lat, lon;    
    for (i = 0; i < npoints; i++) { 
        pyBridge.nextExposure();
        lat = pyBridge.getRiskLat();
        lon = pyBridge.getRiskLong();
        var lob = pyBridge.getRiskLobId();
        var tiv = pyBridge.getRiskTiv();
        var marker = new PruneCluster.Marker(lat, lon);
        marker.data.ID = pyBridge.getRiskId();
        marker.category = lob;
        marker.data.popup = "<b>TIV</b> = " + tiv //Example of popup content
        marker.data.icon = createIcon;
        pruneCluster.RegisterMarker(marker);
    }
    map.addLayer(pruneCluster);
    layerControl.addOverlay(pruneCluster, "Exposures");
}
*/

function initMap(){
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
        console.log(mapCtrl);
        var jcalflyr = new MT.JcalfLayer(mapCtrl, host, port, user, pwd);
        // connect signals from bridge
        BRIDGE.riskUpdated.connect(jcalflyr.addRiskMarker);
        BRIDGE.updatesFinished.connect(jcalflyr.processView);

    });

    $("#hazard-submit").click(function() {
        mapCtrl.addWmsOverlay();
    });

    $("#geocode-submit").click(function() {
        console.log($("#address").val());
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






