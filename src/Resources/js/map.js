/**
* Main JS for map thing prototype
*
*
* Demo Geoserver URL and map layer: 
*
* http://localhost:8080/geoserver/geotiff_maps/gwc/service/wmts
* geotiff_maps:River10Q200D
*/

/**
* Controls creation of map, base layers and overlays
*/
function mapControl(){
    this.map = L.map('map', {
                      zoom: 13,
                      center: [53.952612,-2.090103],
                      layers: [],
                      zoomControl: false,
                      attributionControl: false
                    });
    var zoomControl = L.control.zoom({
      position: "bottomright"
    }).addTo(this.map);


}




var map, featureList, layerControl, lecChart

var connected = false;
//We use this function because connect statements resolve their target once, imediately
//not at signal emission so they must be connected once the imageAnalyzer object has been added to the frame
//! <!--  [ connect slots ] -->
function connectSlots()
{
    console.log("Connecting slots");
    if ( !connected ) {
        connected = true;
        pyBridge.exposuresChanged.connect(this, addClusterLayer);
    }
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


/** Dynamic Layers **/

function createIcon(data, category)
{

    return L.icon({
        iconUrl: 'qrc:/../Resources/img/ffa500-marker-32.png',
        iconSize:[32,32],
        iconAnchor: [1,16],
        popupAnchor: [16,0]
    });

}

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


function addOverlay()
{
    // Get the values from the hazards-sidebar
    var host = $("#hazardmaphost").val();
    var layer = $("#layer").val();
    var format = $("#format").val();
    var tms = $("#tms").is(':checked');
    var layerName;

    if (tms == false){
        var hazardLayer = L.tileLayer.wms(host,
            {
            layers: layer,
            format: format,
            transparent: true,
            version: '1.1.0',
            attribution: "&copy 2015 JBA Risk Management Ltd"
        });
        var layerParts = layer.split(":");
        if (layerParts.length == 2)
        {
        layerName = layerParts[1];
        }
        else
        {
        layerName = layer;
        }
        console.log(layerName);
        
     };

    map.addLayer(hazardLayer);
    layerControl.addOverlay(hazardLayer, layerName);


}

/* BASEMAP */
accessToken = 'pk.eyJ1IjoiamFtZXNyYW1tIiwiYSI6IndSUmpORk0ifQ.OGcgNZ-H2takG6IDMq1X-g';
// Replace 'mapbox.streets' with your map id.
var mbUrl = 'https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken;
var mbstreets = L.tileLayer(mbUrl, {id: 'mapbox.streets',
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});


var mblight = L.tileLayer(mbUrl, {id: 'mapbox.light',
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

var mbsat = L.tileLayer(mbUrl, {id: 'mapbox.satellite',
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

var mbpirates = L.tileLayer(mbUrl, {id: 'mapbox.pirates',
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

map = L.map('map', {
  zoom: 13,
  center: [53.952612,-2.090103],
  layers: [mbstreets],
  zoomControl: false,
  attributionControl: false
});

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);


var baseLayers = {
  "streets": mbstreets,
  "greyscale": mblight,
  "satellite": mbsat,
  "pirates": mbpirates
};

//var overLays = {"river200": river200};


layerControl = L.control.layers(baseLayers).addTo(map);


// Button events
$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#analysis-btn").click(function() {
  $('#analysis-sidebar').toggle();
  map.invalidateSize();
  return false;
});


$("#db-btn").click(function() {
  $('#db-sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#hazards-btn").click(function() {
  $('#hazards-sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#db-sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#db-sidebar-hide-btn").click(function() {
  $('#db-sidebar').hide();
  map.invalidateSize();
});

$("#hazards-sidebar-hide-btn").click(function() {
  $('#hazards-sidebar').hide();
  map.invalidateSize();
});

$("#analysis-sidebar-hide-btn").click(function() {
  $('#analysis-sidebar').hide();
  map.invalidateSize();
});


$("#db-submit").click(function() {
    connectSlots();
    var host = $("#host").val();
    var port = $("#port").val();
    var user = $("#user").val();
    var pwd = $("#pwd").val();
    pyBridge.databaseDetailsChanged(host,port,user,pwd);
});

$("#hazard-submit").click(function() {
    addOverlay();
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

function clearHighlight() {
  highlight.clearLayers();
}






