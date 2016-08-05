// Interactive tour/demo of MapThing
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
