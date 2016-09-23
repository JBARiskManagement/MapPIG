# MapPIG
[![Build Status](https://travis-ci.org/JamesRamm/MapPIG.svg?branch=master)](https://travis-ci.org/JamesRamm/MapPIG) 

A mapping platform for interactive geodata.

Desktop web map viewer with a flexible extensions framework. MapPig utilizes web technology to gear itself toward integration of geovisualisation and statistical analysis. 

MapPIG is written in Javascript using Electron

## Goals
1. Provide a simple and beautiful interface to enable interactive visualisation of geospatial data
2. Provide an API for creating all kinds of visualisations and interactivity through plugins
3. Provide easy-to-use generic UI clients for WMS, WMTS, WFS(T), WPS and TMS web services
4. Bring together web interactivity and desktop processing


### Screenshots
MapPIG can connect to WMS and WFS services:
![MapPIG WMS](assets/img/mappig_wms.png?raw=True "WMS overlays")

Any number of TMS services can be used as base map layers. Here, OpenCycleMap shows us cycle routes around Amsterdam:
![MapPIG TMS](assets/img/mappig_cyclemap.png?raw=True "Open Cyclemap basemap")

## Running MapPig.

Requirements:

- nodejs >= 6.3
- Electron >= 1.3

run `npm install` followed by `npm run templates`. 
You should now be able to run MapPig by running `electron .` in the MapPIG directory

## Documentation

See docs/index.md for documentation