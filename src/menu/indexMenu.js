/*
list of menu IDs in this file
........settings, backup, home, rebuildDb.......
*/

import {dialog, BrowserWindow, app} from "electron";
import * as path from "path";
const fse = require('fs-extra');

//Format database name
function getDbName() {
    let dbName = new Date().toLocaleDateString().replaceAll('/','-');
    return 'inno-sales-' + dbName;
}


//Send route event
const sendRouteEvent = (routeName) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send('routing', routeName)
}

// Copy database
const copyDatabaseFile = async (filePath) => {
    const win = BrowserWindow.getAllWindows()[0];
    try {
        win.webContents.send('backing-up', '')

        await fse.copy('./bk/sales.db', filePath);
        win.webContents.send('backup-complete', '')

        dialog.showMessageBox({type:'info', message: 'Backup was successful'});
    }catch (e) {
        win.webContents.send('backup-complete', '')
        dialog.showMessageBox({type:'error', message: e.message});
    }
}


const options = {
    title: 'Save database to..',
    buttonLabel: 'Save',
    // defaultPath: path.join(__dirname, `../../${getDbName()}`),
    defaultPath: app.getPath('documents') + '/' + getDbName(),
    filters: [{name: 'backup', extensions: ['db']}]
}

const indexMenu = [
    {
        label: 'File',
        submenu: [
            {
                id: 'home',
                enabled: false,
                label: 'Home',
                click(){sendRouteEvent('home')}
            },
            {
                id: 'settings',
                enabled: false,
                label: 'Settings',
                submenu: [
                    { label: 'Company Settings', click(){sendRouteEvent('settings')}},
                    { label: 'Manage Users', click(){sendRouteEvent('users')}},
                    { type: 'separator'},
                    { //Backup database
                        id: 'backup',
                        enabled: false,
                        label: "Backup database",
                        async click(){
                            const {filePath} = await dialog.showSaveDialog(BrowserWindow.getAllWindows()[0], options)
                            if (filePath) copyDatabaseFile(filePath)
                        }
                    },
                    { //Rebuild Database
                        id: 'rebuildDb',
                        enabled: false,
                        label: "Rebuild database",
                        async click(){
                            let confirm = await dialog.showMessageBox(
                                BrowserWindow.getAllWindows()[0],
                                {type: 'question',
                                    message: `This action rebuilds the database file, repacking into a minimal amount of disk space. It\'s a good Practice to perform this operation at least twice a month.
                                        \n Do you want to continue?`,
                                    buttons: ['No','Yes']
                                }
                            )
                            if (confirm.response)  BrowserWindow.getAllWindows()[0].webContents.send('rebuild-db', '')
                        }
                    }
                ],

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