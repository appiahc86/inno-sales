
import DashboardView from "@/views/reports/DashboardView"
import ProfitAndLossView from "@/views/reports/ProfitAndLossView"

const indexReportRouter = [
    {
        path: '/report/index/report-dashboard',
        name: 'report-dashboard',
        component: DashboardView
    },
    {
        path: '/report/index/report-profit-and-loss',
        name: 'report-profit-and-loss',
        component: ProfitAndLossView
    },
]

export default indexReportRouter;

