
import receiveItemsView from "@/views/purchases/receiveItemsView";
import ReceivingHistoryView from "@/views/purchases/ReceivingHistoryView";

const purchasesRouter = [
    {
        path: '/purchases/receive-items',
        name: 'receiveItems',
        component: receiveItemsView,
        meta:{
            requiresAuth: false
        }
    },
    {
        path: '/purchases/receiving-history',
        name: 'receivingHistory',
        component: ReceivingHistoryView,
        meta:{
            requiresAuth: false
        }
    }

]


export default purchasesRouter;
