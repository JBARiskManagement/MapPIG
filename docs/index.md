
# MapPIG Documentation

MapPIG is a desktop-based, extensible web map viewer. It is intended to be beautiful, easy to use and
allow rich, interactive visualisation of geospatial data which can be hard to achieve in a traditional GIS.
MapPIG can (and should!) be extended through its' plugin system.

- [Documentation on developing plugins](plugins.md)
- [Documentation on developing the MapPIG core](core.md)


## Installation

MapPIG has not yet been released so may be installed for development by cloning the git repository, then running:

-   `npm install` to install dependencies
- `npm run templates` to compile handlebars templates.

You can then run MapPIG with:

    electron .

In the MapPIG directory. You can enable the chrome developer utilities by running:

    electron . --debug 5858

## Configuration

The MapPIG plugins directory, standard base layers and WMS hosts can be configure by editing the `conf/conf.json` file.
The `plugins` entry can be set to the `plugins` directory in the MapPIG root folder in order for example plugins to be registered.



