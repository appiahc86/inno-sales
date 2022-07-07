
import SalesIndexView from "@/views/sales/SalesIndexView";
import HeldItemsView from "@/views/sales/HeldItemsView";

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
    }

]

export default salesRouter;


