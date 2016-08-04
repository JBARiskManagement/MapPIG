/**
* MapThing DOM utilities
*
*/

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
 * @param {HTMLString} {DOMnode} [data.content] content of the panel, as HTMLstring or DOM node
 * @param {String} [data.position='top'] where the tab will appear:
 *                                       on the top or the bottom of the sidebar. 'top' or 'bottom'
 * @param {HTMLString} {DOMnode} [data.tab]  content of the tab item, as HTMLstring or DOM node
 */
MT.PluginGui.prototype.sidebarPanel = function(data)
{
    var panel = MT.Dom._makeSidebarPanel(data.title, data.id+"-panel");
    this._elements.push(data.id+"-panel");
    this._elements.push(data.id);

    panel.append(data.content);
    data.pane = panel[0];
    MT.Dom._addSidebarPanel(data);
};

/**
 * Create a modal dialog. The modal can be shown by calling `modal` on the return element,
 * e.g.:
 *    var mymodal  = pluginGui.modal(data);
 *    mymodal.modal();
 *
 *  @param {bool} [data.fullwidth] If true, the modal will scale to the width of the container
 *  @param {bool} [data.draggable] If true, the modal will be draggable
 *  @param {string} [data.id] Id of the modal
 *  @param {string} [data.title] Title of the modal window
 *  @param {HTMLString} {DOMNode} [data.body] Content of the modal body
 *  @param {HTMLString} {DOMNode} [data.footer] Content of the modal footer
 */
MT.PluginGui.prototype.modal = function(data)
{
    // Check the modal doesnt already exist on the DOM and remove if so
    $("#"+data.id).remove();

    if (data.fullwidth)
    {
        data.class="modal container fade";
    }
    else
    {
        data.class="modal fade";
    }

    if (data.draggable)
    {
        data.class += " modal-draggable";
    }

    var html = MT.templates.modal(data);

    // Record the modal id in the elements to remove on plugin exit
    this._elements.push(data.id);

    // Append the modal to the main page
    $("body").append(html);

    // Return the dom node
    var modal = $("#"+data.id);
    if (data.draggable)
    {
        modal.draggable({handle: ".modal-header"});
    }
    return modal;
};

/**
 * Create a modal dialog. The modal can be shown by calling `modal` on the return element,
 * e.g.:
 *    var mymodal  = pluginGui.modal(data);
 *    mymodal.modal();
 *
 *  @param {bool} [data.fullwidth] If true, the modal will scale to the width of the container
 *  @param {bool} [data.draggable] If true, the modal will be draggable
 *  @param {string} [data.id] Id of the modal
 *  @param {string} [data.title] Title of the modal window
 *  @param {HTMLString} {DOMNode} [data.footer] Content of the modal footer
 *  @param {object} [data.chartData] Chart data
 * @param {object} [data.chartLayout] Chart layout
 */
MT.PluginGui.prototype.modalChart = function(data)
{
    var chartId = data.id+"-chart";
    data.body = "<div id='"+chartId+"'></div>";
    var mod = this.modal(data);

    Plotly.newPlot(chartId, data.chartData, data.chartLayout, {showLink: false, displaylogo: false});
    return mod;

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

    /**
    * Adds a button to the 'plugin' sidebar with the name of this plugin
    */
    addPluginLauncher: function(pluginName, setupFunc, description){
        // Create an id for the launcher button
        var id = pluginName + 'launch';

        // Get the JS function which sets up the UI. The function may be namespaced, so
        // we can split the function string on the dot separator and pull out each object in turn
        // starting with the 'window'  object
        var parts = setupFunc.split(".");
        for (var i = 0, len = parts.length, obj = window; i < len; ++i)
        {
            obj = obj[parts[i]];
        }
        // Create the button
        var button = MT.templates.switch({id: id, name:id, label: pluginName});
        $("#plugin-launchers").append(button);

        $("#"+id).bootstrapSwitch();
        $("#"+id).on('switchChange.bootstrapSwitch', function(event, state){obj(state);});
        $(".bootstrap-switch-id-"+id).tooltip({
                           placement: 'right',
                           title: description
                       });
        console.log($(".bootstrap-switch-id-"+id));

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

    /*
     * Show a file browser dialog using the QT Api.
     * This sidesteps the issue of webkit obscuring filepaths using its' native API
     */
    addFileOpenHandler: function(buttonId, inputId){
        $('#'+buttonId).click(function(){
            // Connect the button event to the Qt bridge object in order to display a file browser widget/
            // We dont do this in javascript as webkit purposefully hides the file path
            BRIDGE.connectToPathField(document.getElementById(inputId));
            BRIDGE.showOpenFileDialog();

        });

    }
};
