
import receiveItemsView from "@/views/purchases/receiveItemsView";
import ReceivingHistoryView from "@/views/purchases/ReceivingHistoryView";

const purchasesRouter = [
    {
        path: '/purchases/receive-items',
        name: 'receiveItems',
        component: receiveItemsView,
    },
    {
        path: '/purchases/receiving-history',
        name: 'receivingHistory',
        component: ReceivingHistoryView,
    }

]


export default purchasesRouter;
