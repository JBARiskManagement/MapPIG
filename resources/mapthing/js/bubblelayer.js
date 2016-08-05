/**
  * Creates a bubble plot scaled and coloured by the value given to each bubble.
  * Usage:
  *
  * // Create the initial layer
  * var bl = new JPA.BubbleLayer();
  *
  * // Add a bubble to the layer (typically called by a signal from the C++ Bridge object so that any
  * // processing done to calculate the bubble properties can be done in the backend)
  * // If using the default styling function, the scaledValue can be any number between 0-1 and would typically be calculated as the
  * // value/max(all_values)
  * // the value is the numeric value this bubble represents (e.g. the TIV of a portfolio locator)
  * bl.addBubble(x, y, value, scaledValue);
  *
  * // Style the layer and add it to the map
  * // style_fn is an optional function which supplies the styling properties for a single geojson feature
  * bl.addToMap([style_fn]);
  *
  */
MT.BubbleLayer = function(layerName){

    this._layer = L.geoJson();
    this.name = layerName;
};

MT.BubbleLayer.prototype.addBubble = function(x, y, value, scaledValue){
    var circle = L.circle([x,y], scaledValue * 10000);
    var circleJson = circle.toGeoJson();
    circleJson.properties.value = value;
    circleJson.properties.scaling = scaledTiv;
    //circleJson.properties.nrisks = nrisks;

    this._layer.addData(circleJson);
};

MT.BubbleLayer.prototype.addToMap = function(styleFn){

    if (typeof styleFn === 'undefined')
        styleFn = default_style;

    this._layer.setStyle(styleFn);
    var mapCtrl = MT.getMap();

    mapCtrl.addOverlay(this._layer, this.layerName);

};

function getColor(d) {
    return d > 0.8 ? '#7f2704' :
           d > 0.7 ? '#a63603' :
           d > 0.6 ? '#d94801' :
           d > 0.5 ? '#f16913' :
           d > 0.4 ? '#fd8d3c' :
           d > 0.3 ? '#fdae6b' :
           d > 0.2 ? '#fdd0a2' :
           d > 0.1 ? '#fee6ce' :
                     '#fff5eb';
}

function default_style(feature) {
    return {
        fillColor: getColor(feature.properties.scaling),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
