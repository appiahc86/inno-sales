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
            {label: 'Qty Adjustment', click(){sendRouteEvent('qty-adjustment')}}
        ]
    },
    //..........................Inventory.........................




    //..........................Purchasing.........................
    {
        label: 'Purchasing',
        submenu: [
            {label: 'Receive Items', click(){sendRouteEvent('receiveItems')}},
            {label: 'Receiving History', click(){sendRouteEvent('receivingHistory')}},
            {type: 'separator'},
            {label: 'Outstanding Bills', click(){sendRouteEvent('bills')}}
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
            {label: 'Add or List Customers', click(){sendRouteEvent('customers')}},
        ]
    },
    //..........................Customers.........................


                //..........................Reports.........................
    {
        label: 'Reports',
        submenu: [
            {label: 'Dashboard'},
            {label: 'Profit & Loss'},
            {type: 'separator'},

            //Sales
            {
                label: 'Sales',
                submenu: [
                    {label: 'Sales Summary', click(){sendRouteEvent('report-sales-summary')}},
                    {label: 'Sales Details', click(){sendRouteEvent('report-sales-details')}},
                    {label: 'Customer Sales', click(){sendRouteEvent('report-customer-sales')}},
                    {label: 'Sales Returns', click(){sendRouteEvent('report-sales-returns')}}
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
                    {label: 'Products List', click(){sendRouteEvent('report-products-list')}},
                    {label: 'Low Stock', click(){sendRouteEvent('report-products-low-stock')}}
                ]
            }, // ./products

            //Purchasing
            {
                label: 'Purchasing',
                submenu: [
                    {label: 'Receiving Summary'},
                    {label: 'Receiving Details'},
                    {type: 'separator'},
                    {label: 'Outstanding Bills'},
                    {label: 'Bills By Vendor'},
                ]
            }, // ./Purchasing
        ]
    }
                    //  .........................../Reports.............................





]

export default adminMenu;