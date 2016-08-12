# Map Thing 
[![Build Status](https://travis-ci.org/JamesRamm/MapThing.svg?branch=master)](https://travis-ci.org/JamesRamm/MapThing) 
<a href="https://scan.coverity.com/projects/jamesramm-mapthing">
  <img alt="Coverity Scan Build Status"
       src="https://scan.coverity.com/projects/9787/badge.svg"/>
</a>

Desktop web map viewer with a flexible extensions framework. MapThing utilizes web technology to gear itself toward integration of geovisualisation and statistical analysis. 

It is written in C++ and javascript and makes use of Qt and Leaflet.

## Goals
1. Provide a simple and beautiful way in which to connect to WMS/WFS/WMTS/TMS services and visualise data
2. Provide an API for creating all kinds of visualisations and interactivity through plugins
3. Bring together web interactivity and desktop processing 

## Building MapThing.

Requirements:

- MinGW or MSVC
- Qt5
- NodeJS

### Setup javascript build dependencies.

3rd party javascript modules used in mapthing are kept in the repository, however modules used to build
mapthing are configured with NPM. After installing NodeJS, run `npm install` on the command line in the root directory
of the repository. 
This should scan the `package.json` and install dependencies. The main dependency is Grunt, which is used to compress & minify javascript & css files
After installing, try running `grunt` from the command line. It will run a style checker on the mapthing javascript files, compress and minify them creating a 
`dist` folder in `resources/mapthing`

### Building With CMake
Something like:

  cmake -DCMAKE_PREFIX_PATH=/path/to/qt CMakeLists.txt

### Running in a browser.

MapThing has very limited functionality in a browser (as there is no local system access and no C++ backend). 
You can open `resources/index.html` in Google Chrome and see the UI. Printing, plugins and loading files are currently not supported in-browser. 



