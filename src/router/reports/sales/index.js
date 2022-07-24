
import SalesSummaryView from "@/views/reports/sales/SalesSummaryView";
import SalesDetailsView from "@/views/reports/sales/SalesDetailsView";

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
    }
]

export default salesReportRouter;

