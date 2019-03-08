'use strict';
import { app, protocol, BrowserWindow, Config, screen, shell, globalShortcut, ipcMain, Tray, Menu } from 'electron';
import {createProtocol, installVueDevtools} from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';
// Keep a global reference of the window and tray objects else they will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;
let tray: Tray;

protocol.registerStandardSchemes(['app'], { secure: true })

function createWindow() {

  win = new BrowserWindow({
    minWidth: 265,
    width: 400,
    height: 400,
    minHeight: 400,
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    resizable: true
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } 
  else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }

  win.on('close', (e) => {
    e.preventDefault();
    console.log("test")
    win.hide();
  })

  win.on('closed', (e) => {
    (<any>win) = null;
  })

  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    await installVueDevtools();
  }
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    if (win.isFocused() && !win.isAlwaysOnTop()) {
      win.minimize();
    } else {
      win.restore();
      win.focus();
      ipcMain.emit("FocusEditor");
      moveWindow();
    }
  })
  createTray()
  createWindow();
  moveWindow();
})

function createTray() {
  tray = new Tray(require('path').join(__dirname, '/assets/icon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Restore', click: _ => win.show() },
    { label: 'Quit', click: _ => { win.destroy(); app.quit() } }
  ])
  tray.setContextMenu(contextMenu);
}

var locked = app.requestSingleInstanceLock();
if (!locked) {
  app.quit();
} else {
  app.on('second-instance', _ => {
    if (win) {
      if (win.isMinimized()) win.restore();
      moveWindow();
      win.focus();
    }
  })
}

function moveWindow() {
  if (!win.isVisible) win.show();
  let mousePos = screen.getCursorScreenPoint();
  let bounds = screen.getDisplayNearestPoint(mousePos).bounds;
  let winBounds = win.getBounds();
  let horizontalBleed = (bounds.x + bounds.width) - winBounds.width;
  let verticalBleed = (bounds.y + bounds.height) - winBounds.height;
  win.setPosition(mousePos.x > horizontalBleed ? horizontalBleed : mousePos.x, mousePos.y > verticalBleed ? verticalBleed : mousePos.y);
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
