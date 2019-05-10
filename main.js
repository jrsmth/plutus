const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin
let dataChangeOneWin


/// /// /// /// /// /// Main Window /// /// /// /// /// ///

function createMainWindow () {
  // Create the main browser window.
  mainWin = new BrowserWindow({ width: 840,
                                height: 630,
                                backgroundColor: '#010101',
                                maximizable: false,
                                resizable: false,
                                fullscreenable: false,
                                webPreferences: { nodeIntegration: true }
                              })

  // and load the index.html of the app.
  mainWin.loadFile('index.html')

  // close the DevTools.
  mainWin.webContents.closeDevTools()

  // Emitted when the window is closed.
  mainWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWin = null
  })
}


/// /// /// /// /// /// Data Change Window /// /// /// /// /// ///

// // // Data Change 1 (single item)

ipcMain.on('change_data_1', () => {
  // if dataChangeOneWin does not already exist
  if (!dataChangeOneWin) {
    dataChangeOneWin = new BrowserWindow({ width: 500,
                                           height: 120,
                                           backgroundColor: '#0f0f0f',
                                           movable: false,
                                           maximizable: false,
                                           resizable: false,
                                           frame: false,
                                           show: false,
                                           fullscreenable: false,
                                           parent: mainWin,
                                           webPreferences: { nodeIntegration: true }
                                })

    // Centralise dc1 w/ the main window
    winCoords = mainWin.getPosition()
    dataChangeOneWin.setPosition(winCoords[0] + 150, winCoords[1] + 225)

    dataChangeOneWin.loadFile('dc1.html')
    dataChangeOneWin.setMenu(null)
    dataChangeOneWin.once('ready-to-show', () => {
      dataChangeOneWin.show()
    })

    // Close dc1 - using enter
    ipcMain.on('close_change_data_1', () => {
      if (dataChangeOneWin) {
        dataChangeOneWin.destroy()
        // mainWin.reload()
        mainWin.webContents.send('message1', 'close dc1');
        globalShortcut.unregisterAll()
        }
    })

    // Close dc1 - using left click (blur)
    dataChangeOneWin.on('blur', () => {
      if (dataChangeOneWin) {
        dataChangeOneWin.destroy()
        mainWin.webContents.send('message1', 'close dc1');
        globalShortcut.unregisterAll()
        }
    })

    // cleanup
    dataChangeOneWin.on('closed', () => {
      dataChangeOneWin = null
    })
  }
})


/// /// /// /// /// /// Other Application Logic /// /// /// /// /// ///

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWin === null) {
    createMainWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
