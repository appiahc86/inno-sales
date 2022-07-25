
import SalesSummaryView from "@/views/reports/sales/SalesSummaryView";
import SalesDetailsView from "@/views/reports/sales/SalesDetailsView";
import CustomerSalesView from "@/views/reports/sales/CustomerSalesView";
import SalesReturnsView from "@/views/reports/sales/SalesReturnsView";

const salesReportRouter = [
    {
        path: '/report/sales/report-sales-summary',
        name: 'report-sales-summary',
        component: SalesSummaryView
    },
    {
        path: '/report/sales/report-sales-details',
        name: 'report-sales-details',
        component: SalesDetailsView
    },
    {
        path: '/report/sales/report-customer-sales',
        name: 'report-customer-sales',
        component: CustomerSalesView
    },
    {
        path: '/report/sales/report-sales-returns',
        name: 'report-sales-returns',
        component: SalesReturnsView
    },
]

export default salesReportRouter;

