
import receiveItemsView from "@/views/purchases/receiveItemsView";

const purchasesRouter = [
    {
        path: '/purchases/receive-items',
        name: 'receiveItems',
        component: receiveItemsView,
        meta:{
            requiresAuth: false
        }
    }

]


export default purchasesRouter;
