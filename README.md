# Map Thing 
[![Build Status](https://travis-ci.org/JamesRamm/MapThing.svg?branch=master)](https://travis-ci.org/JamesRamm/MapThing) 
<a href="https://scan.coverity.com/projects/jamesramm-mapthing">
  <img alt="Coverity Scan Build Status"
       src="https://scan.coverity.com/projects/9787/badge.svg"/>
</a>

Desktop web map viewer with a flexible extensions framework. MapThing utilizes web technology to gear itself toward integration of geovisualisation and statistical analysis. 

MapThing is written in javascript using Electron

## Goals
1. Provide a simple and beautiful way in which to connect to WMS/WFS/WMTS/TMS services and visualise data
2. Provide an API for creating all kinds of visualisations and interactivity through plugins
3. Bring together web interactivity and desktop processing 

## Running MapThing.

Requirements:

- nodejs >= 6.3
- Electron >= 1.3

3rd party javascript modules used in mapthing are kept in the repository, however modules used to build
mapthing are configured with NPM. After installing NodeJS, run `npm install` on the command line in the root directory
of the repository. 
This should scan the `package.json` and install dependencies. The main dependency is Grunt, which is used to compress & minify javascript & css files
After installing, try running `grunt` from the command line. It will run a style checker on the mapthing javascript files, compress and minify them creating a 
`dist`

Then run `grunt --gruntfile Gruntfile.js`.

You should now be able to run `electron .` in the mapthing directory
