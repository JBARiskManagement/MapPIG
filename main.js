const electron = require('electron');
const {app, BrowserWindow} = electron;
const fs = require('fs')
const os = require('os')
const path = require('path')
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const shell = electron.shell;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function isDebug(){
    var result = false;
    for (var i = 0; i < process.argv.length; i++){
        if (process.argv[i].indexOf("--debug") !== -1){
            result = true;
            break;
        }
    }
    return result;
}

function createWindow () {
  // Create the browser window.
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({width: width * 0.75, height: height * 0.8,
                           toolbar: false,
                           "auto-hide-menu-bar": true});
  win.setMenuBarVisibility(false);


  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDebug()){
        win.webContents.openDevTools();
        win.setMenuBarVisibility(true);
    }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});



ipc.on('save-file-dialog', function (event) {
  dialog.showSaveDialog({
    properties: ['saveFile']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
});

ipc.on('print-to-pdf', function (event, pdfPath) {
  const win = BrowserWindow.fromWebContents(event.sender)
  
  // Use default printing options
  win.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openExternal('file://' + pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
})