.. developer


MapThing for Developers
=======================

MapThing is built using Electron & node.js.
Extending MapThing is possible through its' plugin system. 
A plugin will manipulate the MapThing UI to add its' own GUI elements. MapThing makes
this possible by exposing a simple javascript API for manipulating elements of the GUI such as the sidebar and map object.

Plugin Specification
====================
A plugin should be written as a NPM package, with the main module of the plugin listed under the ``main`` entry
of ``package.json``. 

The plugin will be imported using the ``nodejs`` module mechanism - i.e. ``require``. The plugin should export the following
attributes:

- ``name``: (string) The human-readable name of the plugin
- ``description``: (string) A short description of the plugin, which will appear in a popover in the UI.
- ``setup``: (function): A function which will be called when the plugin is activated. ``setup`` is responsible for building the
  UI of the plugin by adding elements to the MapThing UI.

Plugin packages (i.e folders) would be placed in a ``plugins`` folder in the top level directory (alongside ``package.json``). 


Modules and Libraries
======================

As MapThing runs with node.js, you can use `require` to include 3rd party libraries in your own plugins.

For consistency and minimising duplication, we make the following reccomendations:

- The `map` object uses the Leaflet library. It can be manipulated directly by using `getMapControl("default")._map`, however,
  you would typically use the methods provided by the `MapControl` object to add layers etc. to the map.
- Use existing leaflet plugins where possible & avoid using other mapping libraries such as openlayers.
- For charting, MapThing will make use of `plotly` and we reccomend using this for consistency.
- For GUI styling, MapThing makes heavy use of bootstrap. All bootstrap CSS classes are available for you to use in your own GUI

C++
=====
Plugins may wish to carry out calculations in C++. This is entirely possible with nodejs and is 
up to the plugin to use its' own method of communicating with a C++ backend. 

We reccomend using [nbind](https://github.com/charto/nbind) for accessing C++11 code.

OGC OSW
========
MapThing aims to eventually provide in-built clients for OGC web services:

- WMS
- WMTS
- WFS(T)
- WPS

A developer API for interacting with these will also be made available.

Contents
--------


.. toctree::
   :maxdepth: 1

   javascript



