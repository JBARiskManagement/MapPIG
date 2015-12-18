
L.Control.LayerPanel = L.Control.Layers.extend({

    options: {
       collapsed: false,
       autoZIndex: false

     },

     initialize: function(baseLayers, overlays, id, options){
         this._container = L.DomUtil.get(id);
         L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);
     },

    _initLayout: function(){
        var className = 'leaflet-panel-layers',
            container = this._container;

        var form = this._form = L.DomUtil.create('form', className + '-list');

        //var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
        //link.href = '#';
        //link.title = 'Layers';

        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._separator = L.DomUtil.create('div', className + '-separator', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        container.appendChild(form);
    },

    addTo: function(map){
        this.remove();
        this._map = map;
        var container = this._container = this.onAdd(map);
        return this;
    },

    _createOverlayControl: function(obj){
        var div = document.createElement('div');

    },
    _onExpandClick: function(layerId){
        console.log("Expand click");
        layer = this._layers[layerId].layer;
        console.log(layer);
        console.log(layer.Cluster.ComputeBounds());
        console.log(layer.getBounds());

    },
    _onDeleteClick: function(layerId){
        layer = this._layers[layerId].layer;
        this._map.removeLayer(layer);
        this.removeLayer(layer);
        layer.remove && layer.remove();
        delete layer;
    },

    _addItem: function(obj){
        var label = document.createElement('label'),
            checked = this._map.hasLayer(obj.layer),
            input, expandBtn, deleteBtn, pullLeft, pullRight,
            holder = document.createElement('div');
        holder.className = "row row-layer-control";
        pullLeft = document.createElement('div');
        pullLeft.className = "pull-left";
        pullRight = document.createElement('div');
        pullRight.className = "pull-right";

        if (obj.overlay){
            //holder.className = 'checkbox';
            input = document.createElement('input');
            input.className = 'leaflet-control-layers-selector';
            input.type='checkbox';
            input.defaultChecked = checked;

            var buttonClass = "btn btn-secondary btn-layer-control";
            expandBtn = document.createElement('a');
            expandBtn.className = buttonClass;
            var expandIcon = document.createElement('i');
            expandIcon.className = "fa fa-arrows-alt";
            expandBtn.appendChild(expandIcon);

            deleteBtn = document.createElement('a');
            deleteBtn.className = buttonClass;
            var deletIcon = document.createElement('i');
            deletIcon.className = "fa fa-trash";
            deleteBtn.appendChild(deletIcon);

            pullRight.appendChild(expandBtn);
            pullRight.appendChild(deleteBtn);

            L.DomEvent.on(expandBtn, 'click', function(){this._onExpandClick(input.layerId)}, this);
            L.DomEvent.on(deleteBtn, 'click', function(){this._onDeleteClick(input.layerId)}, this);

        } else {

            input = this._createRadioElement('leaflet-base-layers', checked);
        }

        input.layerId = L.stamp(obj.layer);
        L.DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        label.appendChild(input);
        label.appendChild(name);
        pullLeft.appendChild(label);

        holder.appendChild(pullLeft);
        holder.appendChild(pullRight);

        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
        container.appendChild(holder);
        this._checkDisabledLayers();
        return holder;

    },

    _checkDisabledLayers: function () {
        var inputs = this._form.getElementsByTagName('input'),
           input,
           layer,
           zoom = this._map.getZoom();

        for (var i = inputs.length - 1; i >= 0; i--) {
           input = inputs[i];
           layer = this._layers[input.layerId].layer;
           input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
                            (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

        }
    },
    _expand: function(){},
    _collapse: function(){}

});

L.control.layerpanel = function (baseLayers, overlays, id, options) {
    return new L.Control.LayerPanel(baseLayers, overlays, id,options);
};

