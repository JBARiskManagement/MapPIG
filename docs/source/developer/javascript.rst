.. javascript

Javascript API
==============

MapThing javascript functions exist under the ``MT`` namespace. Functions useful for plugin development are documented below

Dom Utilities
-------------

.. js:function:: MT.getMap([id])
   
   Retrieves the ``MapController`` object for a specific map container element, allowing the caller to manipulate the underlying Leaflet map.
   
   :param string id: The id of the map element. If not set, the function will return the main ``MapController`` instance
   :returns: The ``MapController`` object for the map. This contains the Leaflet ``map`` instance.

.. js:function:: MT.Dom.hideSidebar()

   Hide the sidebar
   
.. js:function:: MT.Dom.showSidebar()

   Show the sidebar
   
.. js:function:: MT.Dom.showLoading(selector)

   Show a loading/busy spinner over the selected element. This is useful to prevent
   UI use when waiting for e.g an ajax request.
   
   :param selector: A valid JQuery selector (e.g an element id, in the form "#idName" or an element class in the form ".className"

.. js:function:: MT.Dom.showMessage(msg, title)

   Show a message in a small popup modal. Typically used for conveying error messages or important information. 
   
   :param string msg: The message body
   :param string title: The title of the window
   
.. js:function:: MT.Dom.makePluginSidebarUi(name)

   Transforms the ``Plugins`` sidebar panel into an area in which a plugin can add its' own GUI elements.
   The panel header is replaced by `name` and the list of available plugins is removed and replaced by a single 'exit' button at the top of the panel.
   When the exit button is pressed, the plugins sidebar will be returned to normal and any elements added to the sidebar are removed, to be 
   replaced by the standard plugins list (i.e. the plugin is exited).
   
   :returns: The sidebar container element in which HTML elements can be added.
  
.. js:function:: MT.Dom.createModal(content, [title])

   Creates a modal bootstrap window and returns the `.modal-body` div; Add the contents of the window to this element.
   The modal window overlays the map area and the rest of the MapThing GUI is inactive while the window is displayed. 

   :param content: The content of the window
   :param string title: The title of the window
   :returns: The DOM node for the `.modal-body` element of the window
   
.. js:function:: MT.Dom.addFileOpenForm(id)

   Create a `file open` form within the specified element. A file open form consists of a single line text area (a ``span`` element) and an attached `Browse` button within a ``form`` HTML element.
   When pressed, the browse button will display a native file open dialog and the selected file path will be displayed in the text area.
   
   The text ``span`` will have an id attribute of ``<id>-file-path-span`` and the browse button will have an id of ``<id>-open-file-btn``.
   
   The ``form`` element is returned.    
   

Map Utilities
-------------

.. js:function:: MT.Wms.Capabilities(host, callback)

      Get the WMS capabilities for a given WMS host server. The WMS standard function `GetCapabilities` is called
      using an AJAX request and the result is passed to the given `callback` function.
      
      :params host: A WMS server address
      :params callback: A javascript function which should accept a single input. This input will be the XML response of `GetCapabilities`

      

.. js:class:: MT.MapController([id])
      
      Creates a new ``MapController`` object which adds a map to the element with the given `id`.
      It is *not* reccomended to create this object directly as it will essentially create a clone of the MapThing window within 
      the given element.  
      Instead, use ``MT.getMap`` to get a handle on the main ``MapController`` instance and call methods on that.


.. js:function:: MT.MapController.disable()

   Disable all map interaction
   
.. js:function:: MT.MapController.enable()

   Enable map interaction
   
.. js:function:: MT.MapController.addWmsOverlay(host, layerName, displayName, format, attr)
   
   Add a WMS layer to the map. 
      
.. js:function:: MT.MapController.addOverlay(layer, name)

   Add a Leaflet layer to the map
   
   :param ILayer layer: An object which implements the Leaflet `ILayer` interface
   :param string name: The name of the layer
   
.. js:function:: MT.MapController.removeOverlay(displayName)

   Remove an overlay layer from the map
   
   :param string displayName: The name of the layer, as given to ``addOverlay``

Javascript - C++ signals
------------------------

A global object called ``BRIDGE`` is available. Javascript code may invoke functions in the ``BRIDGE`` object causing a Qt `Signal` to be
emitted and intercepted by the C++ MapThing backend. ``BRIDGE`` operates in the same manner as plugin `bridge` objects and signals emitted by ``BRIDGE``
cause events in the core MapThing C++ code. Note that due to the existence of the ``BRIDGE`` object, no plugin bridges may be named ``BRIDGE``

.. js:function:: BRIDGE.printRequest(path)

   Causes a PNG image of the map (at current display resolution) to be saved to `path`. 
   The following GUI elements are removed from the map prior to printing (and added back after):
   
   - The entire sidebar
   - The zoom control
   - The search control
   
   A JBA Risk logo is also added to the top left corner of the map

.. js:function:: BRIDGE.workStarted()

.. js:function:: BRIDGE.progressUpdated()

.. js:function:: BRIDGE.workFinished()

.. js:function:: BRIDGE.showOpenFileDialog()

.. js:function:: BRIDGE.showSaveFileDialog()

.. js:function:: BRIDGE.connectToPathField(element)

DataLayer
---------

.. js:class:: MT.DataLayer(mapCt)

   Creates a layer of clustered markers and adds it as an overlay to the map defined by ``mapCt``
   
   :param MapController mapCt: An instance of ``MT.MapController`` in which the cluster layer should be added
   
.. js:function:: MT.DataLayer.addRiskMarker(lat, lon, [tiv])

   Add a marker to the layer
   
   :param double lat: The latitude of the marker
   :param double lon: The longitude of the marker

.. js:function:: MT.DataLayer.processView()

   Refresh the display of the marker layer. Must be called when new markers are added to the layer.


CsvLayer
--------

.. js:class:: MT.CsvLayer(mapCt, path)

   Implements ``MT.DataLayer`` for CSV files containing lat/lon coords. 
   The CSV file must contain a `Lat` column and a `Lon` column. Reading of the CSV file is handled by the C++ backend,
   so this class is only useful in the MapThing desktop application. 
   
   :param MapController mapCt: The ``MapController`` instance in which to create the layer
   :param string path: The path to the input CSV file
   
   
BubbleLayer
-----------

.. js:class:: MT.BubbleLayer(mapCt)

   Creates a bubble chart overlay on the map. 
   
   
 