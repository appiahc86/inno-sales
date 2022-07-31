
import ReceivingSummaryView from "@/views/reports/purchases/ReceivingSummaryView";
import VendorListView from "@/views/reports/purchases/VendorListView";
import OutstandingBillsView from "@/views/reports/purchases/OutstandingBillsView";
import VendorBillsView from "@/views/reports/purchases/VendorBillsView";
import BillPaymentHistoryView from "@/views/reports/purchases/BillPaymentHistoryView";

const purchasesReportRouter = [
    {
        path: '/report/purchases/receiving-summary',
        name: 'report-receiving-summary',
        component: ReceivingSummaryView
    },
    {
        path: '/report/purchases/vendor-list',
        name: 'report-vendor-list',
        component: VendorListView
    },
    {
        path: '/report/purchases/outstanding-bills',
        name: 'report-outstanding-bills',
        component: OutstandingBillsView
    },
    {
        path: '/report/purchases/vendor-bills',
        name: 'report-vendor-bills',
        component: VendorBillsView
    },
    {
        path: '/report/purchases/bill-payment-history',
        name: 'report-bill-payment-history',
        component: BillPaymentHistoryView
    }
]

export default purchasesReportRouter;

