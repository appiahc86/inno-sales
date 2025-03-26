/*
list of menu IDs in this file
........receiveItems, receivingHistory, outstandingBills.......
*/

import {BrowserWindow} from "electron";

//Send Route event
const sendRouteEvent = (routeName) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send('routing', routeName)
}


const adminMenu = [

    //..........................Sales.........................
    {
        label: 'Sales',
        submenu: [
            {label: 'New Sales Receipt', click(){sendRouteEvent('sales')}},
            {label: 'Held Receipts', click(){sendRouteEvent('held-items')}},
            {label: 'Sales History', click(){sendRouteEvent('sales-history')}},
            {type: 'separator'},
            {label: 'Products List', click(){sendRouteEvent('sales-products-list')}},
            {label: 'Accept Return', click(){sendRouteEvent('sales-return')}}
        ]
    },
    //..........................Sales.........................



    //..........................Inventory.........................
    {
        label: 'Inventory',
        submenu: [
            {label: 'Products', click(){sendRouteEvent('products')}},
            {label: 'Categories', click(){sendRouteEvent('categories')}},
            {label: 'Price Adjustment', click(){sendRouteEvent('price-adjustment')}},
            {label: 'Qty Adjustment', click(){sendRouteEvent('qty-adjustment')}},
            {type: 'separator'},
            {label: 'Stock Transfers', click(){sendRouteEvent('transfers')}}
        ]
    },
    //..........................Inventory.........................




    //..........................Purchasing.........................
    {
        label: 'Purchasing',
        submenu: [
            {id: 'receiveItems', label: 'Receive Items', click(){sendRouteEvent('receiveItems')}},
            {id: 'receivingHistory', label: 'Receiving History', click(){sendRouteEvent('receivingHistory')}},
            {type: 'separator'},
            {id: 'outstandingBills', label: 'Outstanding Bills', click(){sendRouteEvent('bills')}}
        ]
    },
    //..........................Purchasing.........................



    //..........................Vendors.........................
    {
        label: 'Vendors',
        submenu: [
            {label: 'Add or List Vendors', click(){sendRouteEvent('vendors')}},
        ]
    },
    //..........................Vendors.........................



    //..........................Customers.........................
    {
        label: 'Customers',
        submenu: [
            {label: 'Manage Customers', click(){sendRouteEvent('customers')}},
            {label: 'Outstanding Invoices', click(){sendRouteEvent('outstanding-customers')}},
        ]
    },

    //..........................Customers.........................


                //..........................Reports.........................
    {
        label: 'Reports',
        submenu: [
            {label: 'Dashboard', click(){sendRouteEvent('report-dashboard')}},
            // {label: 'Profit And Loss', click(){sendRouteEvent('report-profit-and-loss')}},
            {type: 'separator'},

            //Sales
            {
                label: 'Sales',
                submenu: [
                    {label: 'Sales Summary', click(){sendRouteEvent('report-sales-summary')}},
                    {label: 'Sales Details', click(){sendRouteEvent('report-sales-details')}},
                    {label: 'Sales Returns', click(){sendRouteEvent('report-sales-returns')}},
                ]
            },// ./Sales


            //Products
            {
                id: 'products',
                label: 'Products',
                submenu: [
                    {label: 'Products List', click(){sendRouteEvent('report-products-list')}},
                    {label: 'Low Stock', click(){sendRouteEvent('report-products-low-stock')}},
                    {type: 'separator'},
                    {label: 'Quantity Adjustment History', click(){sendRouteEvent('report-quantity-adjustment')}},
                    {label: 'Price Adjustment History', click(){sendRouteEvent('report-price-adjustment')}},
                    {type: 'separator'},
                    {label: 'Expiring Products', click(){sendRouteEvent('report-products-expiring')}},
                    {label: 'Expired Products', click(){sendRouteEvent('report-products-expired')}}
                ]
            }, // ./products

            //Purchasing
            {
                label: 'Purchasing',
                submenu: [
                    {label: 'Receiving Summary', click(){sendRouteEvent('report-receiving-summary')}},
                    {label: 'Vendor List', click(){sendRouteEvent('report-vendor-list')}},
                    {type: 'separator'},
                    {label: 'Outstanding Bills', click(){sendRouteEvent('report-outstanding-bills')}},
                    {label: 'Bills By Vendor', click(){sendRouteEvent('report-vendor-bills')}},
                    {type: 'separator'},
                    {label: 'Bill Payment History', click(){sendRouteEvent('report-bill-payment-history')}},
                ]
            }, // ./Purchasing


            //Customers
            {
                label: 'Customers',
                submenu: [
                    {label: 'Outstanding Receivables', click(){sendRouteEvent('customer-outstanding-receivables')}},
                    {label: 'Customer Credit History', click(){sendRouteEvent('customer-credit-history')}},
                    {type: 'separator'},
                    {label: 'Customer List', click(){sendRouteEvent('report-customer-list')}},
                ]
            },// ./Customers


        ]
    }
                    //  .........................../Reports.............................





]

export default adminMenu;