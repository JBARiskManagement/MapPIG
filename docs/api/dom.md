
# dom

Helpers for manipulating the MapPIG UI.

### MPDom.hideSidebar()

Hide the sidebar

### MPDom.showSidebar()

Show the sidebar

### MPDom.showLoading(selector)

Show a loading/busy spinner over the selected element. This is useful to prevent
UI use when waiting for e.g an ajax request.

- `selector` A valid JQuery selector (e.g an element id, in the form "###idName" or an element class in the form ".className"

### MPDom.showMessage(msg, title)

Show a message in a small popup modal. Typically used for conveying error messages or important information. 

- `msg` String. The message body
- `title` String The title of the window

### MPDom.makePluginSidebarUi(name)

Transforms the `Plugins` sidebar panel into an area in which a plugin can add its' own GUI elements.
The panel header is replaced by `name` and the list of available plugins is removed and replaced by a single 'exit' button at the top of the panel.
When the exit button is pressed, the plugins sidebar will be returned to normal and any elements added to the sidebar are removed, to be 
replaced by the standard plugins list (i.e. the plugin is exited).

Returns the sidebar container element in which HTML elements can be added.

### MPDom.createModal(content, [title])

Creates a modal bootstrap window and returns the `.modal-body` div; Add the contents of the window to this element.
The modal window overlays the map area and the rest of the MapPIG GUI is inactive while the window is displayed. 

- `content` HTML string. The content of the window
- `title` String. The title of the window

Returns the DOM node for the `.modal-body` element of the window

### MPDom.addFileOpenForm(id, callback)

Create a `file open` form within the specified element. A file open form consists of a single line text area (a ``span`` element) and an attached `Browse` button within a ``form`` HTML element.
When pressed, the browse button will display a native file open dialog and the selected file path will be displayed in the text area.

The text `span` will have an id attribute of `<id>-file-path-span` and the browse button will have an id of ``<id>-open-file-btn``.

- `id` String. A unique ID to be given to the form.
- `callback` Function. Will be called when the file dialog is closed (by pressing the Ok button). The filename(s) selected will be passed

The `form` element is returned.     


## Class: MPContainer

### new MPContainer()

Create a new MPContainer instance. This is a small helper class to add container elements such as sidebar panels and dialog boxes to
the MapPIG UI:

    container = new MPContainer();

### container.sidebarPanel(data)

Add a panel to the sidebar

- `data` Object containing data for the new panel
- `data.title` String. Title of the new panel
- `data.id` String ID of the new panel
- `data.content` DOMnode. Content of the panel. Can be a HTML string or a DOM node.
- `data.position` String. Where the tab will appear - the top or bottom of the sidebar. Default is top
- `data.tab` DOMnode. Content of the tab item (e.g the tab icon). It is possible to use font awesome classes for icons. e.g. ` '<i class="fa fa-fort-awesome"></i>'`

### container.modal(data)

Create a modal dialog. The modal can then be shown by calling `modal` on the returned element:

    var mymodal = container.modal(data);
    mymodal.modal();

- `data.fullwidth` Boolean. If `true`, modal will scale to full width of containing element
- `data.draggable` Boolean.
- `data.id` String
- `data.title` String
- `data.body` DOMnode
- `data.footer` DOMnode

### container.modalChart(data)

Create a plotly chart in a modal dialog

- `data.fullwidth` Boolean. If `true`, modal will scale to full width of containing element
- `data.draggable` Boolean.
- `data.id` String
- `data.title` String
- `data.footer` DOMnode
- `data.chartData` Chart data
- `data.chartLayout` Chart layout

### container.close()

Remove all elements added in this container and the container itself. (e.g. remove a sidebar panel if one was created)