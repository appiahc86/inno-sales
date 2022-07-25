
import ProductsListView from "@/views/reports/products/ProductsListView";
import LowStockView from "@/views/reports/products/LowStockView";

const productsReportRouter = [
    {
        path: '/report/products/products-list',
        name: 'report-products-list',
        component: ProductsListView
    },
    {
        path: '/report/products/products-low-stock',
        name: 'report-products-low-stock',
        component: LowStockView
    }
]

export default productsReportRouter;

