
import BillsIndexView from "@/views/bill/BillsIndexView";
import BillPaymentView from "@/views/bill/BillPaymentView";

const billsRouter = [
    {
        path: '/bills',
        name: 'bills',
        component: BillsIndexView,
        meta:{
            requiresAuth: false
        }
    },

    {
        path: '/bills/pay/:purchaseId/:company/:invoice/:amountDue/:invoiceDue',
        name: 'pay-bill',
        component: BillPaymentView
    }

]


export default billsRouter;
