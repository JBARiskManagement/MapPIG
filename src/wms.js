/**
 * Helper functions for WMS
 * 
 */
const $ = jQuery = require('jQuery');

function WebService(url){
    this.url = url;
};

WebService.prototype.getCapabilities = function(options){

     if(url.indexOf('?') === -1)
            url += '?';
        else
            url += '&';

        $.ajax({
                type: "GET",
            headers: {'Access-Control-Allow-Credentials': true},
                xhrFields: {
                    withCredentials: true
                },
                url: url + 'request=GetCapabilities&service=wms',
                dataType: "xml",
                success: function(xml) {
                    options.success(xml);
                },
                error: function(){options.error}
            });

};

WebService.prototype.createLegend = function(layer){
        
        var successFunc = function(xml) {
                        var result = $(xml).find('ServiceException[code="LayerNotDefined"]');
                        if (result)
                            console.log(result[0]);
                            //MT.Dom.showMessage("No legend is available for this layer:\n"+result[0].textContent, "WMS does not provide legend");
                    };
                    
        var errorFunc = function(xhr, status, error){
                       if (status === 'parsererror')
                       {
                            legendObjs[name] = L.wmsLegend(url, layer._map);
                       }
                       else{
                           console.log(status);
                           console.log(error);
                           //MT.Dom.showMessage(error.message, "Error creating legend");
                       }

                   };
        
        var legends = layer.getLegendGraphic();
        var legendObjs = {};
        for (var name in legends)
        {
            var url = legends[name];
            $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "xml",
                    success: successFunc,

                   /*
                    * Because we specified the dataType as xml, then if the URL is valid an image will be
                    * returned, which will cause jquery to invoke the error function...
                    */
                   error: errorFunc
                });
        }
        return legendObjs;
    };