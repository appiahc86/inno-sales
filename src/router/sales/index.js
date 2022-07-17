
import SalesIndexView from "@/views/sales/SalesIndexView";
import HeldItemsView from "@/views/sales/HeldItemsView";
import SalesHistoryView from "@/views/sales/SalesHistoryView";

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
    }

]

export default salesRouter;


