const app = require('electron').remote.app;
const appPath = app.getAppPath();
const {MapControl, registerMapCtrl, getMapCtrl} = require(appPath + '/js/map_control.js');
const runTour = require(appPath + "/js/tour.js").runTour;
const $ = jQuery = require('jQuery');
require(appPath + '/vendors/jquery-loading-overlay/loadingoverlay.min.js');
require("bootstrap");
function initialise(){

    // Default appearance of the loading overlay
    $.LoadingOverlaySetup({
                        color: "rgba(255,255,255,0.8)",
                        image: appPath + "/img/big_roller.gif",
                        maxSize: "40px"
                          });
    
    // Initialise tooltips
    $('[data-toggle="tooltip"]').tooltip({ container: 'body' });

    var mapCtrl = new MapControl();
    registerMapCtrl(mapCtrl, "default");

    $("#overlay-submit").click(function() {
        mapCtrl.addWmsOverlay();
    });

    $("#geocode-submit").click(function() {
        mapCtrl.geocode($("#address").val());
    });

    $("#tour-btn").click({"control": mapCtrl}, function(event){runTour(event.data.control)});


    function sizeLayerControl() {
      $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    };

}