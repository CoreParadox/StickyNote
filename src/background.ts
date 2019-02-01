'use strict'

import { app, protocol, BrowserWindow, Config } from 'electron'
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
}
import * as fs from 'fs';
import * as path from 'path';
function ensureExists(callback) {
  Configuration.getConfig().then(c => {
    fs.exists(c.notePath, folderExists => {
      if (!folderExists) {
        createDirectory(c, _ => {
          createDefault(c, _ => callback());
        })
      } else {
        fs.exists(path.join(c.notePath, c.defaultNote), fileExists => {
          if (!fileExists) createDefault(c, _ => callback())
          else callback();
        })
      };
    })
  });
}

function createDirectory(config: Configuration, callback) {
  fs.mkdir(config.notePath, e => {
    if (e){
      console.log(e);
      alert(e); 
      process.exit();
    }else{ 
      callback(e);
    }
  });
}

function createDefault(config: Configuration, callback) {
  fs.writeFile(path.join(config.notePath, config.defaultNote), "# Welcome to your new note!\nLet's write something awesome.", e => {
    callback(e)
  })
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

  ensureExists(function(){
    createWindow()
  })
})

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
