
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

### Configuring OWS services

Currently, the only way to allow MapPIG to connect to OWS web services is by adding entries to the configuration file. Create an entry called `'ows'`. The value of this should be an object whose keys are 
the display name of the web service and values are a 2-element array. The first element should be the host URL and the second element should be the service type, e.g. `wfs` or `wms`. 

### Configuration file example

    {
        "base_layers": {
                        "Carto Light": {"type": "tileLayer",
                                        "url": "http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                                        "attribution": "Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL"},
                        "OpenStreetMap": {"type": "tileLayer",
                                        "url": "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                        "attribution": "© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"},
                        "OpenCycleMap": {"type": "tileLayer",
                                        "url": "http://b.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                                        "attribution": "© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"},
                        "TonerLite": {"type": "tileLayer",
                                    "url": "http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
                                    "attribution": "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>."},
                        "Toner":{"type": "tileLayer",
                                    "url": "http://tile.stamen.com/toner/{z}/{x}/{y}.png",
                                    "attribution": "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright'>ODbL</a>."},
                        "OS Streetview": {"type": "tileLayer",
                                        "url": "http://os.openstreetmap.org/sv/{z}/{x}/{y}.png",
                                        "attribution": "Contains Ordnance Survey Data © Crown copyright and database right 2010"}                   
                        },
                        
        "ows": {
                    "OpenGeo": ["http://demo.opengeo.org/geoserver/ows", "wfs"],
                    "Environment Agency": ["http://www.geostore.com/OGC/OGCInterface?UID=UDATAGOV2011&PASSWORD=datagov2011&INTERFACE=ENVIRONMENT&LC=0", "wms"],
                    "FEMA": ["http://hazards.fema.gov/gis/nfhl/services/public/NFHLWMS/MapServer/WMSServer", "wms"]                
                },
        "plugins": "C:/source/MapPIG/plugins"
    }



