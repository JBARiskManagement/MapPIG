/*
 * Copyright (c) 2016 James Ramm
 */
// Interactive tour/demo of MapThing
const $ = jQuery = require("jQuery");
require("bootstrap");
require("../vendors/bootstrap-tour/js/bootstrap-tour.min.js");
module.exports.runTour = function(mapCtrl){
    var mapTour = new Tour({
        backdrop: false,
        steps: [
            {
            orphan: true,
            title: "Welcome!",
            content: "MapThing is a desktop base, extensible web GIS with an emphasis on interactive visualisation. " +
                    "This short tour is intended to get you familiar with the user interface.",
            onShow: function(tour){mapCtrl.closesidenavTab("sb-help");}
            },
            {
            element: "#container",
            placement: "top",
            title: "The map window",
            content: 
                    "The main focus of the program is on visualisation. It allows you to quickly navigate the map, add overlays from web services " +
                    "and print images. Plugins can extend the functionality " +
                    "of MapThing to create new overlays from different sources, charts and provide more complex, interactive analysis of all kinds of data. ",
            },
            {
            element: ".sidenav",
            title: "sidenav",
            content: "Clicking on a sidenav button will display a panel for the selected feature. Hovering over buttons will popup a short description."
            },
            {
            element: "#sb-btn-layers",
            title: "Display the layer control",
            content: "MapThing offers a rudimentary layer control. "
            },
            {
            element: "#sb-layers",
            title: "Layers Control",
            content: "Switch between a selection of basemap layers and show/hide or remove overlays which have been added to the map. Basemap layer providers can be configured in the conf.json file",
            onShow: function(tour){mapCtrl.showsidenavTab("sb-layers");},
            onHide: function(tour){mapCtrl.closesidenavTab("sb-layers");}
            },
            {
            element: "#sb-btn-overlays",
            title: "WMS Overlays",
            content: "MapThing can be configured to store WMS hosts" +
                    " Lets expand the tab and see what is available by default"
            },
            {
            element: "#wms-host-select",
            title: "Select a host",
            content: "Select a web service from the drop down list. Environment Agency & FEMA WMS' are available by default - this can be edited in the conf.json file.",
            onShow: function(tour){mapCtrl.showsidenavTab("sb-overlays");},
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
            onHide: function(tour){mapCtrl.closesidenavTab("sb-overlays");}
            },
            {
            element: "#sb-btn-plugin",
            title: "Plugins",
            content: "MapThings' analysis functionality and integration with other tools and methods comes from the extensible plugin framework" +
                    " Available plugins are displayed in this panel and can be enabled by clicking the corresponding button."
            },
            {
            element: "#sb-btn-print",
            title: "Print",
            content: "Print the map to a PDF image! The image is created at the current size and resolution of the window. The final image will not feature any GUI elements (such as the sidenav)."
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

    // Initialize the tour
    mapTour.init();
    // Start the tour
    mapTour.start();

};
