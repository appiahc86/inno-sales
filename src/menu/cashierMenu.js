/*
list of menu IDs in this file
........salesReport.......
*/

import {BrowserWindow} from "electron";

//Send Route event
const sendRouteEvent = (routeName) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send('routing', routeName)
}


const cashierMenu = [

    //..........................Sales.........................
    {
        label: 'Sales',
        submenu: [
            {label: 'Retail', click(){sendRouteEvent('sales')}},
            {label: 'Wholesale', click(){sendRouteEvent('wholesale')}},
            {label: 'Held Receipts', click(){sendRouteEvent('held-items')}},
            {label: 'Sales History', click(){sendRouteEvent('sales-history')}},
            {type: 'separator'},
            {label: 'Products List', click(){sendRouteEvent('sales-products-list')}},
            {label: 'Accept Return', click(){sendRouteEvent('sales-return')}}
        ]
    },
    //..........................Sales.........................

    //..........................Customers.........................
    // {
    //     label: 'Customers',
    //     submenu: [
    //         {label: 'Manage Customers', click(){sendRouteEvent('customers')}},
    //         {label: 'Outstanding Invoices', click(){sendRouteEvent('outstanding-customers')}},
    //     ]
    // },

    //..........................Customers.........................


    //..........................Reports.........................
    {
        label: 'Reports',
        submenu: [

            //Sales
            {
                id: 'salesReport',
                label: 'Sales',
                submenu: [
                    {label: 'Sales Summary', click(){sendRouteEvent('report-sales-summary')}},
                    {label: 'Sales Details', click(){sendRouteEvent('report-sales-details')}},
                    {label: 'Sales Returns', click(){sendRouteEvent('report-sales-returns')}},
                    {type: 'separator'},
                    // {label: 'Customer Sales', click(){sendRouteEvent('report-customer-sales')}},
                    {label: 'Customer List', click(){sendRouteEvent('report-customer-list')}},

                ]
            },// ./Sales

        ]
    }
    //  .........................../Reports.............................





]

export default cashierMenu;