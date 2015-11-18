MapThing/Master Database WMS & RESTful services
====================================================

A list of desired web map and restful services for use with mapthing and notes on implementation


WMS
------

- All raw depth rasters to be provided as wms or wmts.

MapServer is recommended over GeoServer for implementing WMS for two reasons:

- MapServer has direct support for PostGIS (Geoserver requires plugins/work arounds) and there is good documentation (http://postgis.net/docs/RT_FAQ.html#idp76930640)
- MapServer displays better raster performance especially when data requires on the fly reprojection (which is likely a requirement for display of the master data) (https://www.esdm.co.uk/mapserver-and-geoserver-and-tilecache-comparison-serving-ordnance-survey-raster-maps and http://www.slideshare.net/gatewaygeomatics.com/wms-performance-shootout-2010)

MapServer has been shown to provide far better performance than MapServer for Windows (MS4W), therefore it is reccomended that a *nix machine is used to run mapserver



RESTful services
-------------------

It is anticipated (initially at least) that the only services required will be to enable editing of DTM data. 

The following functionality would be useful:


    GET api/lock  # Lock a region of the DTM for editing. This would return some sort of key/identifier to be used in editing requests
    POST api/editline?lock=key # Create a new edit (which is stored in an 'edits' table or similar as a line feature, e.g polyline)
    PUT api/editline/id?lock=key # Replace an edit with an updated line
    DELETE api/editline/id?lock=key # Delete an edit line
    DELETE api/editline?lock=key # Delete all edits within the locked region
    GET api/release?lock=key # Release a locked region of the DTM
    