# Map Thing

JBA Map Thing is a small utility to view JBA data on a map.

It is written in C++ and javascript and makes use of Qt and Leaflet.


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


### Building with Qt Creator. 

This is the easy way. Open Qt Creator and select `Load Project`. The project file can be found at `src/cpp/MapThing.pro`.
You also need to load the libmapthing project (`src/cpp/libmapthing/libmapthing.pro`)
Under the `Projects` tab, navigate to the build settings for the desired toolchain and check whether a `Custom Process Step: grunt` exists in both the `Debug` and `Release`
configurations. 
If not, create a custom process step. The command is `grunt` and the working directory is `../%{buildDir}`. The step should be first. Remember to add this to all configurations

When setup, you should be able to press `Ctrl + Shift + B` to build everything and `F5` to run in debug. 


### Building from the command line

A build script is yet to be developerd, although the `Projects` section of Qt Creator gives clues
as to how MapThing may be built from the command line

### Running in a browser.

MapThing has very limited functionality in a browser (as there is no local system access and no C++ backend). 
You can open `resources/index.html` in Google Chrome and see the UI. Printing, plugins and loading files are currently not supported in-browser. 
