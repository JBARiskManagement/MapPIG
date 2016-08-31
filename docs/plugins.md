# MapThing Plugin Development

Plugins make it possible for MapThing to become more than just a web map viewer. The intention is for plugins to take care of
creating interactive visualisations from different datasources and interacting with custom data & processing services/libraries.

A plugin will manipulate the MapThing UI to add its' own GUI elements. MapThing makes
this possible by exposing a simple javascript API for manipulating elements of the GUI such as the `sidebar` and `map` object.

## Package.json
A `package.json` file is require for MapThing to load the plugin. This is a standard NPM `package.json` file which should declare a `main`, `name` and `description` field as described [here](https://docs.npmjs.com/files/package.json).

## Plugin `exports`

The `main` module of the package should export a single function, `setup` which will activate the plugin. This function is responsible for adding the plugins' GUI elements to the MapThing UI and declaring callbacks and any other relationships.
The `setup` function should accept a single argument which is the `state` of the activation toggle switch for the plugin. This is either `on` or `off` 

### Plugin template

main.js:

    module.exports.setup = function(){
        console.log("Doing the plugin setup...");
    };

package.json:

    {
       "name": "MyPlugin",
       "version": 1.0.0,
       "description": "Plugin which does some stuff",
       "main": "main.js"
    }

## Using MapThing Modules

MapThing has a number of modules which can be used to create UI elements and map layers for plugins. 
In order to simplify the use of the modules (and not have to worry about their exact location), MapThing provides a 
global function called `mtRequire`, which can be used to import modules by name only. 

Documentation on the javascript API is [here](api/toc.md)


## 3rd Party Modules and Libraries

As MapThing runs with node.js, you can use `require` to include 3rd party libraries in your own plugins.

For consistency and minimising duplication, we make the following reccomendations:

- The `map` object uses the Leaflet library. It can be manipulated directly by using `getMapControl("default")._map`, however,
  you would typically use the methods provided by the `MapControl` object to add layers etc. to the map.
- Use existing leaflet plugins where possible & avoid using other mapping libraries such as openlayers.
- For charting, MapThing will make use of `plotly` and we reccomend using this for consistency.
- For GUI styling, MapThing makes heavy use of bootstrap. All bootstrap CSS classes are available for you to use in your own GUI

## C++

Plugins may wish to carry out calculations in C++. This is entirely possible with nodejs and is 
up to the plugin to use its' own method of communicating with a C++ backend. 

We reccomend using [nbind](https://github.com/charto/nbind) for accessing C++11 code.

## OGC OSW

MapThing aims to eventually provide in-built clients for OGC web services:

- WMS
- WMTS
- WFS(T)
- WPS

A developer API for interacting with these will also be made available.
