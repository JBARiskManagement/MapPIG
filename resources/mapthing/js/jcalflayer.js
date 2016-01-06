// global namespace
var MT = MT || {};

/*
 * DataLayer
 *      A cluster layer whose markers can be defined by exposures from a JCalf database
 *
 */
MT.DataLayer = function(mapCt){
    this.mapCt = mapCt;
    this.layerName = "unknown";
};


MT.DataLayer.prototype.jcalf = function(host, port, user, pwd)
{
    this.host = host;
    this.port = port;
    this.user = user;
    this.pwd = pwd;
    this.layerName = "JCalf: " + host;
    this.lastUpdate = +new Date();

    BRIDGE.databaseConnected.connect(this.maybeCreateLayer.bind(this));
    BRIDGE.error.connect(MT.Dom.showMessage);
    BRIDGE.connectDatabase(host,port,user,pwd);
};

MT.DataLayer.prototype.remove = function(){
       delete this.clusterLayer;
};

MT.DataLayer.prototype.maybeCreateLayer = function(status)
{
    if (status === true)
    {
        console.log("Setting up layer");
        BRIDGE.exposureUpdated.connect(this.addRiskMarker.bind(this));
        BRIDGE.workFinished.connect(this.processView.bind(this));
        // Connect map move events to updating jcalf layers
        var self = this;
        //this.mapCt._map.on('moveend', function(){self.update()});
        this.clusterLayer = new PruneClusterForLeaflet(); // The marker cluster layer
        this.mapCt.addOverlay(this.clusterLayer, this.layerName);
        this.update();
        //this.addClusterSizeWidget();
    }
    else
    {
        MT.Dom.showMessage("Unknown error", "Unable to connect to the database");
    }
};


MT.DataLayer.prototype.processView = function()
{
    $("#map").trigger("dataloading");
    this.clusterLayer.ProcessView();
    $("#map").trigger("dataload");
    $("#disable-overlay").hide();
    this.mapCt.enable();
};

/**
 * update
 *     Redraws the marker layer with all the risks in the current bounding box
 *
 */
MT.DataLayer.prototype.update = function(){
    // Only update the risks if the layer is displayed
    if (this.mapCt._map.hasLayer(this.clusterLayer))
    {
        // Prevent user from issuing another move command while we update
        $("#disable-overlay").show();
        this.mapCt.disable();
        var bounds = this.mapCt._map.getBounds();
        this.clusterLayer.RemoveMarkers();
        BRIDGE.refreshExposures(bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth());
    }
};

/*
 * addRiskMarker
 *      Add a new marker to the cluster layer. Normally this would be
 *      called by the C++ 'bridge' object which has access to the JCalf
 *      database
 *
 */
MT.DataLayer.prototype.addRiskMarker = function(lat, lon, tiv){
    var marker = new PruneCluster.Marker(lat, lon);
    //marker.category = lob;
    marker.data.icon = createIcon;
    marker.data.tiv = tiv;
    //marker.data.forceIconRedraw = true;
    this.clusterLayer.RegisterMarker(marker);
    //console.log("Add risk");
};

MT.DataLayer.prototype.addClusterSizeWidget = function(){

    $('<div href="#" id="size">Cluster size: <input type="range" value="160" min="35" max="500" step="1" id="sizeInput"><span id="currentSize">112</span></div>').insertAfter("#map");
    $("#sizeInput").onChange = this.updateSize.bind(this);
    $("#sizeInput").onChange = this.updateSize.bind(this);

};

MT.DataLayer.prototype.updateSize = function(){

    var newSize = $("#sizeInput").val();
    this.clusterLayer.Cluster.Size = parseInt(newSize);
    $("#currentSize").firstChild.data = newSize;
    var now = +new Date();
    if ((now - this.lastUpdate) < 400) {
        return;
    }
    this.clusterLayer.ProcessView();
    this.lastUpdate = now;
};

MT.DataLayer.prototype.showLoadingStats = function(loaded, skipped)
{
    bootbox.dialog({message: loaded + " markers were loaded, " + skipped + " rows were skipped (did not contain lat or long values)",
                   title: "Loading finished",
                   buttons: {main: {label: "Ok",
                         className: "btn-primary"}}
                   });
};

MT.CsvLayer = function(mapCt, path)
{
    this.mapCt = mapCt;
    this.layerName = "unknown";
    this.layerName = path.split('\\').pop().split('/').pop();
    this.createLayer(true);
    BRIDGE.loadFile();

};

MT.CsvLayer.prototype = new MT.DataLayer();
MT.CsvLayer.prototype.constructor = MT.CsvLayer;

MT.CsvLayer.prototype.createLayer = function(status)
{
    // Connect signals
    BRIDGE.exposureUpdated.connect(this.addRiskMarker.bind(this));
    BRIDGE.workFinished.connect(this.processView.bind(this));
    BRIDGE.markerLoadingStats.connect(this.showLoadingStats.bind(this));

    this.clusterLayer = new PruneClusterForLeaflet(); // The marker cluster layer
    this.mapCt.addOverlay(this.clusterLayer, this.layerName);
    //this.addClusterSizeWidget();
};
