import {dialog, BrowserWindow} from "electron";
import * as path from "path";
const fse = require('fs-extra');

const copyDatabaseFile = async (filePath) => {
    try {
        const win = BrowserWindow.getAllWindows()[0]
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

const adminMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: "Backup database",
                async click(){
                    const {filePath} = await dialog.showSaveDialog(BrowserWindow.getAllWindows()[0], options)
                    if (filePath) copyDatabaseFile(filePath)
                }
            },
            {role: 'quit'},
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
    },
    {
        label: 'Help',
        submenu: [
            {label: 'About', role: 'About'},
            {
                label: 'Visit website',
                click: async ()=>{
                    // await shell.openExternal('http://localhost/')
                    await dialog.showMessageBoxSync({tpye: 'question', detail: 'How are you' })
                }
            },

            {
                label: 'Reports',
                submenu: [
                    {
                        label: 'Daily Sales Report',
                        click(){dialog.showErrorBox('Sorry', 'No Report found', )}
                    }
                ]
            }
        ]
    }

]

export default adminMenu;