
const app = require('electron').remote.app
const ipc = require('electron').ipcRenderer

const $ = jQuery = require('jQuery')
require('./vendors/jquery-loading-overlay/loadingoverlay.min.js')
require('bootstrap')

const {MapControl, registerMapCtrl, getMapCtrl} = require('./src/map_control.js')
const {PluginLoader, PluginInstaller} = require('./src/plugins.js')
const {OwsControl} = require('./src/ows_control.js')
const runTour = require('./src/tour.js').runTour

const appPath = app.getAppPath()
global.mtRequire = function(name){
  return require(appPath + '/src/' + name)
}

function initialise(){
    // Default appearance of the loading overlay
    $.LoadingOverlaySetup({
                        color: "rgba(255,255,255,0.8)",
                        image: "./assets/img/big_roller.gif",
                        maxSize: "40px"
                          })
    
    // Initialise tooltips
    $('[data-toggle="tooltip"]').tooltip({ container: '#container' })

    // Create the MapControl and register it as the default map
    var mapCtrl = new MapControl()
    var owsCtrl = new OwsControl() // Controls the OWS connections panel
    registerMapCtrl(mapCtrl, "default")

    // Callback for adding an overlay
    owsCtrl.onSubmit(mapCtrl.addWmsOverlay.bind(mapCtrl))

    $("#geocode-submit").click(function() {
        mapCtrl.geocode($("#address").val())
    })

    $("#tour-btn").click({"control": mapCtrl}, function(event){
        runTour(event.data.control)})

    // Initialise file browser buttons
    $('#save-file').on('click', function (event) {
        ipc.send('save-file-dialog')
    })

    ipc.on('selected-directory', function (event, path) {
        document.getElementById('save-file-path').innerHTML = `${path}`
    })

    // Initialise printing
    document.getElementById('print-submit').addEventListener('click', function(event){
        $("#sidenav").hide();
        ipc.send('print-to-pdf', $('#save-file-path').text())
    })

    ipc.on('wrote-pdf', function (event, path) {
        $("#sidenav").show()
    })

    // Initialise plugins
    var loader = new PluginLoader()
    var installer = new PluginInstaller(loader)    
    loader.findPlugins()

}