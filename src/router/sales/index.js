
import SalesIndexView from "@/views/sales/SalesIndexView";
import HeldItemsView from "@/views/sales/HeldItemsView";
import SalesHistoryView from "@/views/sales/SalesHistoryView";
import ProductsListView from "@/views/sales/ProductsListView";
import SalesReturnView from "@/views/sales/SalesReturnView";

const salesRouter = [
    {
        path: '/sales',
        name: 'sales',
        component: SalesIndexView
    },
    {
        path: '/sales/held-items',
        name: 'held-items',
        component: HeldItemsView
    },
    {
        path: '/sales/sales-history',
        name: 'sales-history',
        component: SalesHistoryView
    },
    {
        path: '/sales/products-list',
        name: 'sales-products-list',
        component: ProductsListView
    },
    {
        path: '/sales/sales-return',
        name: 'sales-return',
        component: SalesReturnView
    }

]

export default salesRouter;


