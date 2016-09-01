
# MapThing Documentation

MapThing is a desktop-based, extensible web map viewer. It is intended to be beautiful, easy to use and
allow rich, interactive visualisation of geospatial data which can be hard to achieve in a traditional GIS.
MapThing can (and should!) be extended through its' plugin system.

- [Documentation on developing plugins](plugins.md)
- [Documentation on developing the MapThing core](core.md)


## Installation

MapThing has not yet been released so may be installed for development by cloning the git repository, then running:

-   `npm install` to install dependencies
- `npm run templates` to compile handlebars templates.

You can then run MapThing with:

    electron .

In the MapThing directory. You can enable the chrome developer utilities by running:

    electron . --debug 5858

## Configuration

The MapThing plugins directory, standard base layers and WMS hosts can be configure by editing the `conf/conf.json` file.
The `plugins` entry can be set to the `plugins` directory in the MapThing root folder in order for example plugins to be registered.



