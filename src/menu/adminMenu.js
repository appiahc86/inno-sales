import {dialog, BrowserWindow} from "electron";
import * as path from "path";
const fse = require('fs-extra');

//Send report event
const sendReportEvent = (routeName) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send('report', routeName)
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
            {role: 'quit'}
        ]
    },
                //..........................Reports.........................
    {
        label: 'Reports',
        submenu: [
            {label: 'Reports Center'},
            {label: 'Dashboard'},
            {type: 'separator'},

            //Sales
            {
                label: 'Sales',
                submenu: [
                    {label: 'Sales Summary', click(){sendReportEvent('report-sales-summary')}},
                    {label: 'Sales Details'}
                ]
            },// ./Sales

            //Payments
            {
                label: 'Payments',
                submenu: [
                    {label: 'Payment Summary'}
                ]
            }, // ./Payments

            //Customers
            {
                label: 'Customers',id: 'products',
                submenu: [
                    {label: 'Customer List'}
                ]
            }, // ./Customers

            //Products
            {
                id: 'products',
                label: 'Products',
                submenu: [
                    {label: 'Summary'},
                    {label: 'Products List'}
                ]
            }, // ./products
        ]
    }
                    //  .........................../Reports.............................





]

export default adminMenu;