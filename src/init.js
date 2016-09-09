/*
* Copyright (c) 2016 James Ramm
*/

const app = require('electron').remote.app;
const ipc = require('electron').ipcRenderer;

const $ = jQuery = require('jQuery');
require('./vendors/jquery-loading-overlay/loadingoverlay.min.js');
require('bootstrap');

const {MapControl, registerMapCtrl, getMapCtrl} = require('./src/map_control.js');
const {MTPlugins} = require('./src/loader.js');
const runTour = require('./src/tour.js').runTour;

const appPath = app.getAppPath();
global.mtRequire = function(name){
  return require(appPath + '/src/' + name);
}

function initialise(){
    // Default appearance of the loading overlay
    $.LoadingOverlaySetup({
                        color: "rgba(255,255,255,0.8)",
                        image: "./assets/img/big_roller.gif",
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

    $("#tour-btn").click({"control": mapCtrl}, function(event){
        runTour(event.data.control)});


    function sizeLayerControl() {
      $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    };

    $('#wms-host-select').on('change', mapCtrl.updateWmsOptions);

    // Initialise file browser buttons
    const selectDirBtn = document.getElementById('save-file')

    $('#save-file').on('click', function (event) {
        ipc.send('save-file-dialog')
    });

    ipc.on('selected-directory', function (event, path) {
        document.getElementById('save-file-path').innerHTML = `${path}`
    });

    // Initialise printing
    document.getElementById('print-submit').addEventListener('click', function(event){
        $("#sidebar").hide();
        ipc.send('print-to-pdf', $('#save-file-path').text());
    });

    ipc.on('wrote-pdf', function (event, path) {
        $("#sidebar").show();
    });

    // Initialise plugins
    var loader = new MTPlugins();
    loader.findPlugins();

}