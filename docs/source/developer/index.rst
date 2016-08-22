.. developer


MapThing for Developers
=======================

MapThing is built using Electron & node.js.
Extending MapThing is possible through its' plugin system. 
A plugin will manipulate the MapThing UI to add its' own GUI elements. MapThing makes
this possible by exposing a simple javascript API for manipulating elements of the GUI such as the sidebar and map object.

Modules and Libraries
======================

As MapThing runs with node.js, you can use `require` to include 3rd party libraries in your own plugins.

For consistency and minimising duplication, we make the following reccomendations:

- The `map` object uses the Leaflet library. It can be manipulated directly by using `getMapControl("default")._map`, however,
  you would typically use the methods provided by the `MapControl` object to add layers etc. to the map.
- Use existing leaflet plugins where possible & avoid using other mapping libraries such as openlayers.
- For charting, MapThing will make use of `plotly` and we reccomend using this for consistency.
- For GUI styling, MapThing makes heavy use of bootstrap. All bootstrap CSS classes are available for you to use in your own GUI

Contents
--------


.. toctree::
   :maxdepth: 1

   javascript



