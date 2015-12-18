/**
* MapThing DOM utilities
*
*/

// global namespace
var MT = MT || {};

MT.Dom = {
    hideSidebar: function(){
        $('#sidebar').hide();
    },

    showSidebar: function(){
        $('#sidebar').show();
    },

    prepareMapForPrint: function(){
        this.hideSidebar();
        var mc = MT.getMap();
        mc.zoomControl.remove();
        mc.searchControl.remove();
    },

    resetMapAfterPrint: function(){
        this.showSidebar();
        var mc = MT.getMap();
        mc.zoomControl.addTo(mc._map);
        mc.searchControl.addTo(mc._map);
    },

    makePluginSidebarUi: function(name){
        var header = $('#sb-plugin-header').html();
        MT.header = header;
        $('#sb-plugin-header').html(name + '<div class="sidebar-close"><i class="fa fa-caret-left"></i></div>');

        var uiArea = $('#sb-plugin-area');
        var originalState = uiArea.contents();
        originalState.detach();

        var exitBtn = $('<button/>',
                        {
                            text: 'Exit',
                            id: 'plugin-exit-btn',
                            class: 'btn btn-default',
                            click: function(){
                                uiArea.empty();
                                uiArea.append(originalState);
                                $('#sb-plugin-header').html(header);
                            }
                        });
        var hr = $('<hr>')

        uiArea.append(exitBtn);
        uiArea.append(hr);

        return uiArea;
    },

    /**
    * Adds a button to the 'plugin' sidebar with the name of this plugin
    */
    addPluginLauncher: function(pluginName, setupFunc, description){
        // Create an id for the launcher button
        var id = pluginName + 'Launch';

        // Get the JS function which sets up the UI. The function may be namespaced, so
        // we can split the function string on the dot separator and pull out each object in turn
        // starting with the 'window'  object
        var parts = setupFunc.split(".");
        for (var i = 0, len = parts.length, obj = window; i < len; ++i)
        {
            obj = obj[parts[i]];
        }
        // Create the button
        var button = $('<button/>', {
                           text: pluginName,
                           class: 'btn btn-default',
                           id: id,
                           click: function(){ obj();}
                       });

        button.tooltip({
                           placement: 'right',
                           title: description
                       });
        // Get the area in which to create the plugin launcher button
        $("#sb-plugin-area").append(button);
    },

    addFileOpenHandler: function(buttonId, inputId){
        $(document.getElementById(buttonId)).click(function(){
            // Connect the button event to the Qt bridge object in order to display a file browser widget/
            // We dont do this in javascript as webkit purposefully hides the file path
            BRIDGE.connectToPathField(document.getElementById(inputId));
            BRIDGE.showOpenFileDialog();

        });

    }

}
