/*
 * Controls the OWS connections panel
 */
const {MPDom} = require('./dom.js');
const wms = require('./wms.js');
const conf = require('../conf/conf.json')

class OwsControl {

    constructor(){

        this._host_select = $('#ows-host-select')
        this._layer_select = $('#wms-layer-select')
        this._add_button = $('#overlay-submit')

        // When the OWS host is changed, update the mapCtrl
        this._host_select.on('change', this.refreshAvailableLayers.bind(this))

        this._selected_service = ''

        if (conf.hasOwnProperty('ows')){
            this.configOwsHosts(conf.ows)
        }
    }

    refreshHostSelect(){
        this._host_select.selectpicker('refresh')
    }

    configOwsHosts(data){
        for (var p in data){
            this._host_select.append($('<option>', {value: data[p][0], "ows-service": data[p][1]})
                             .text(p))
        }
        this.refreshHostSelect()
    }

    onSubmit(fn){
        $("#overlay-submit").click(function() {
            fn(this._host_select.val(), 
                this._selected_service,
                this._layer_select.val(), 
                this._layer_select.find("option:selected").text())
        }.bind(this))
    }

    /**
     * Get the capabilities for the selected WMS host 
     * and add each layer to the select picker dropdown
     */
    refreshAvailableLayers(e){
        MPDom.showLoading("#sb-overlays");
        var url = this._host_select.find("option:selected").val();
        this._selected_service =  this._host_select.find("option:selected").attr("ows-service");

        if (this._selected_service == "wms"){
            var success_func = this.updateWmsOptions
            this._add_button.text("Add WMS Layer")
        }
        else if (this._selected_service == "wfs"){
            var success_func = this.updateWfsOptions
            this._add_button.text("Add WFS Layer")
        }
        var ws = new wms.WebService(url);
        this._layer_select.find('option').remove()
        ws.getCapabilities({
            success: success_func.bind(this),
            error: function(){alert("Error connecting to OWS host")},
            service: this._selected_service})
    }

    updateWmsOptions(xml){
        var layers = $(xml).find('Layer')
        var self = this
        layers.each(function(index, value){
                        var option = '<option value="' + $(this).children("Name").text() + '">' + $(this).children("Title").text() + '</option>'
                        self._layer_select.append(option)
                    })
                    this._layer_select.selectpicker('refresh')
                    MPDom.hideLoading("#sb-overlays")
    }

    updateWfsOptions(xml){
        var layers = $(xml).find('FeatureType')
        var self = this
        layers.each(function(index, value){
                        var option = '<option value="' + $(this).children("Name").text() + '">' + $(this).children("Title").text() + '</option>'
                        self._layer_select.append(option)
                    })
                    this._layer_select.selectpicker('refresh')
                    MPDom.hideLoading("#sb-overlays")
    }
}

module.exports.OwsControl = OwsControl