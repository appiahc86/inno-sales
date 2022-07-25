import {dialog, BrowserWindow} from "electron";
import * as path from "path";
const fse = require('fs-extra');

//Send route event
const sendRouteEvent = (routeName) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send('routing', routeName)
}

// Copy database
const copyDatabaseFile = async (filePath) => {
    try {
        const win = BrowserWindow.getAllWindows()[0];
        win.webContents.send('backing-up', '')

        await fse.copy('./bk/sales.db', filePath);
        win.webContents.send('backup-complete', '')

        dialog.showMessageBox({type:'info', message: 'Backup was successful'});
    }catch (e) {
        dialog.showMessageBox({type:'error', message: e.message});
    }
}


const options = {
    title: 'Save database to..',
    buttonLabel: 'Save',
    defaultPath: path.join(__dirname, '../../bk/sales.db'),
    filters: [{name: 'backup', extensions: ['db']}]
}

const indexMenu = [
    {
        label: 'File',
        submenu: [
            {label: 'App Settings',  click(){sendRouteEvent('settings')}},
             {
                 id: 'backup',
                 label: "Backup database",
                  async click(){
                    const {filePath} = await dialog.showSaveDialog(BrowserWindow.getAllWindows()[0], options)
                     if (filePath) copyDatabaseFile(filePath)
                   }
              },
            {role: 'quit'}
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'copy'},
            {role: 'paste'},
            {role: 'cut'},
            {type: 'separator'},
            {role: 'selectAll'},
            {role: 'toggleSpellChecker'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'zoomIn'},
            {role: 'zoomOut'},
            {role: 'resetZoom'},
            {role: 'toggleFullScreen'}
        ]
    }

]

export default indexMenu;