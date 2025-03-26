
import CustomerCreditHistory from "@/views/reports/customers/CustomerCreditHistory.vue";
import CustomerListView from "@/views/reports/customers/CustomerListView.vue";
import OutstantingReceivable from "@/views/reports/customers/OutstantingReceivable.vue";

const customersReportRouter = [
    {
        path: '/report/customer/report-customer-outstanding-receivables',
        name: 'customer-outstanding-receivables',
        component: OutstantingReceivable
    },

    {
        path: '/report/customer/report-customer-credit-history',
        name: 'customer-credit-history',
        component: CustomerCreditHistory
    },

    {
        path: '/report/customer/report-customer-list',
        name: 'report-customer-list',
        component: CustomerListView
    }
]

export default customersReportRouter;

