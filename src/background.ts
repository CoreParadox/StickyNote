'use strict'

import { app, protocol, BrowserWindow, Config, screen, shell } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import Configuration from './utility/Configuration';
const isDevelopment = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    minWidth: 230,
    width: 400,
    height: 400,
    minHeight: 400,
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    resizable: true
  });
  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('new-window', function(e, url){
    e.preventDefault();
    shell.openExternal(url);
 });

}


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
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  createWindow();
  moveWindow();
})

var locked = app.requestSingleInstanceLock();
if (!locked) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      moveWindow();
      win.focus()
    }
  })
}

function moveWindow(){
  let mousePos = screen.getCursorScreenPoint();
  let bounds = screen.getDisplayNearestPoint(mousePos).bounds;
  let winBounds = win.getBounds();
  let horizontalBleed = (bounds.x+bounds.width)-winBounds.width 
  let verticalBleed = (bounds.y+bounds.height)-winBounds.height
  win.setPosition(mousePos.x > horizontalBleed ? horizontalBleed : mousePos.x,mousePos.y > verticalBleed ? verticalBleed : mousePos.y)
}



// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
