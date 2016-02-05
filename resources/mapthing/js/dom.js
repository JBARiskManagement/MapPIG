/**
* MapThing DOM utilities
*
*/

// global namespace
var MT = MT || {};

MT.PluginGui = function()
{
    this._elements = [];
};


/**
 * Add a panel to the sidebar
 *
 * @example
 * sidebar.addPanel({
       title: 'My Awesome Panel'
 *     id: 'sb-awesome-panel',
 *     tab: '<i class="fa fa-fort-awesome"></i>',
 *     pane: someDomNode.innerHTML,
 *     position: 'bottom'
 * });
 *
 * @param {Object} [data] contains the data for the new Panel:
 * @param {String} [data.title] the title for the new panel
 * @param {String} [data.id] the ID for the new Panel, must be unique for the whole page
 * @param {String} [data.position='top'] where the tab will appear:
 *                                       on the top or the bottom of the sidebar. 'top' or 'bottom'
 * @param {HTMLString} {DOMnode} [data.tab]  content of the tab item, as HTMLstring or DOM node
 * @param {HTMLString} {DOMnode} [data.pane] content of the panel, as HTMLstring or DOM node
 */
MT.PluginGui.prototype.sidebarPanel = function(data)
{
    var panel = MT.Dom._makeSidebarPanel(data.title, data.id+"-panel");
    this._elements.push(data.id+"-panel");

    panel.append(data.pane);
    data.pane = panel[0];

    MT.Dom._addSidebarPanel(data);
};

/**
 * Create a modal dialog
 *
 *
 */
MT.PluginGui.prototype.modal = function(data)
{

};


/**
 * Create a modless dialog
 *
 *
 */
MT.PluginGui.prototype.modeless = function(data)
{

};

MT.PluginGui.prototype.close = function()
{
    for (var i = 0; i < this._elements.length; i++)
    {
        $('#'+this._elements[i]).remove();
    }
};

MT.Dom = {
    showMessage: function(msg, title){
        bootbox.dialog({ message: msg,
                         title: title,
                         buttons: {main: {label: "Ok",
                               className: "btn-primary"}}
                       });
    },

    _makeSidebarPanel: function(title, id)
    {
        var panel = $("<div>", {
                                class: "sidebar-pane",
                                id: id
                              });

        var header = $("<h1>",
                        {
                           class: "sidebar-header",
                           html: title+'<div class="sidebar-close"><i class="fa fa-caret-left"></i></div>'
                        });

        panel.append(header);
        return panel;

    },

    _addSidebarPanel: function(data){
        MT._mCtrl.sidebar.addPanel(data);
    },


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

    showLoading: function(selector){
        $(selector).LoadingOverlay("show");
    },

    hideLoading: function(selector){
        $(selector).LoadingOverlay("hide");
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
        var hr = $('<hr>');

        uiArea.append(exitBtn);
        uiArea.append(hr);

        return uiArea;
    },

    makeModalWindow: function(name, contents){
        var modal = $("#modalWindow");
        modal.find('.modal-title').text(name);

        modal.find('.modal-body').html(contents);

        modal.modal();
        return modal;
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

    addFileOpenForm: function(id)
    {
        var btnId = id+'-open-file-btn';
        var spanId = id+'-file-path-span';
        // form for file input
        var form = $('<form/>', {
              class: 'csv-form'
          });

        // The form group div contains the file browser button
        var fgrp = $('<div/>', {class: 'form-group'});
        var label = $('<label/>', {for: btnId, text: 'Load file'});
        var input = $('<div/>', {class: 'input-group'});
        var brwsSpan = $('<span/>', {class: 'input-group-btn'});
        var brwsBtn = $('<button/>', {class: 'btn btn-default',
                        type: 'button',
                        id: btnId,
                        text: 'Browse...',
                        click: function(){
                            console.log(btnId + ' was clicked');
                            BRIDGE.connectToPathField(document.getElementById(spanId));
                            BRIDGE.showOpenFileDialog();

                        }});

        var pthSpan = $('<span/>', {class: 'form-control',
                                    id: spanId});

        //MT.Dom.addFileOpenHandler(btnId, spanId);

        brwsSpan.append(brwsBtn);
        input.append(brwsSpan);
        input.append(pthSpan);
        fgrp.append(label);
        fgrp.append(input);
        form.append(fgrp);

        return form;


    },

    addFileOpenHandler: function(buttonId, inputId){
        console.log("file open handler " + buttonId);
        $('#'+buttonId).click(function(){
            console.log(buttonId + " was clicked");
            // Connect the button event to the Qt bridge object in order to display a file browser widget/
            // We dont do this in javascript as webkit purposefully hides the file path
            BRIDGE.connectToPathField(document.getElementById(inputId));
            BRIDGE.showOpenFileDialog();

        });

    }

};
