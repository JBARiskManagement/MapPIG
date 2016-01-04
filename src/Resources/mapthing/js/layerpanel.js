
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

        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._separator = L.DomUtil.create('div', className + '-separator', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        container.appendChild(form);
    },

    addTo: function(map){
        this.remove();
        this._map = map;
        this._container = this.onAdd(map);
        return this;
    },


    _onLegendClick: function(layerId){

        // TODO
        var layer = this._layers[layerId].layer;
        if (typeof layer.legendObjs === 'undefined')
        {
            layer.legendObjs = MT.Wms.createLegend(layer);
        }
        else
        {
            for (var name in layer.legendObjs)
                var control = layer.legendObjs[name];
                console.log(control);
                if (control.container.hidden === false)
                {
                    console.log("Hide Control");
                    control.container.hidden = true;
                    control.container.style.visibility = 'hidden';
                    console.log(control.container.isActive);
                }
                else
                {
                    console.log("Show Control");
                    control.container.hidden = false;
                    control.container.style.visibility = 'visible';
                }
        }
    },
    _onDeleteClick: function(layerId){
        layer = this._layers[layerId].layer;

        if (typeof layer.legendObjs != 'undefined')
            for (var name in layer.legendObjs)
            {
                layer._map.removeControl(layer.legendObjs[name]);
            }

        this._map.removeLayer(layer);
        this.removeLayer(layer);
        layer.remove && layer.remove();
        delete layer;
    },

    _addItem: function(obj){
        var label = document.createElement('label'),
            checked = this._map.hasLayer(obj.layer),
            input, legendBtn, deleteBtn, pullLeft, pullRight,
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

            //data-placement="bottom" data-toggle="tooltip" title="Select a WMS service to browse layers

            var buttonClass = "btn btn-secondary btn-layer-control";
            legendBtn = document.createElement('a');
            legendBtn.className = buttonClass;
            var legendIcon = document.createElement('i');
            legendIcon.className = "fa fa-list-ul";
            legendBtn.setAttribute("data-placement", "left");
            legendBtn.setAttribute("data-toggle", "tooltip");
            legendBtn.setAttribute("title", "Add the layer's legend to the map (if available)");
            legendBtn.appendChild(legendIcon);

            deleteBtn = document.createElement('a');
            deleteBtn.className = buttonClass;
            deleteBtn.setAttribute("data-placement", "left");
            deleteBtn.setAttribute("data-toggle", "tooltip");
            deleteBtn.setAttribute("title", "Delete layer");
            var deletIcon = document.createElement('i');
            deletIcon.className = "fa fa-trash";
            deleteBtn.appendChild(deletIcon);

            pullRight.appendChild(legendBtn);
            pullRight.appendChild(deleteBtn);

            L.DomEvent.on(legendBtn, 'click', function(){this._onLegendClick(input.layerId)}, this);
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

