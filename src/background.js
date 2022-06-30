'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain, dialog, exec, globalShortcut } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';
const path = require('path');

//Import menus
import indexMenu from "@/menu/indexMenu";
import adminMenu from "@/menu/adminMenu";

let template = indexMenu;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1300,
    height: 720,
    minHeight: 720,
    minWidth: 1300,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegration: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      nativeWindowOpen: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })


  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()

  } else {
    createProtocol('app')
    // Load the index.js when not in development
    win.loadURL('app://./index.html')
  }

}


//Prevent multiple instances of this app
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();
else {
  app.on('second-instance', (event, argv, cwd)=>{
    if (BrowserWindow.getAllWindows().length) BrowserWindow.getAllWindows()[0].focus()
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
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {

  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

app.on('browser-window-focus', () => {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.register('CommandOrControl+Alt+O', () => win.webContents.openDevTools() )
})

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
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


//Error Message
ipcMain.on('errorMessage', async (event, args) => {
  template = adminMenu;
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  await dialog.showMessageBox(win,{type: 'warning', detail: args, title: 'error'  })
})

ipcMain.on('successMessage', async (event, args) => {
  await dialog.showMessageBox(win,{type: 'info', detail: args, title: 'Success'  })
})



//Confirm Dialog box
ipcMain.on('confirm', async (event, {id, type}) => {
  let confirm = await dialog.showMessageBox(
      win,
      {type: 'question',
        message: 'Are you sure you want to delete this item?',
        buttons: ['No','Yes']
      }
  )

  if(confirm.response) {

    switch (type) {
      case 'category': event.sender.send('deleteCategory', id);
      break;
      case 'product': event.sender.send('deleteProduct', id);
      break;
      case 'customer': event.sender.send('deleteCustomer', id);
      break;
      default:
        console.clear();
            break;
    }
  }
  else console.clear();

})