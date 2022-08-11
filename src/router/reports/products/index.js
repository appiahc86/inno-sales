
import ProductsListView from "@/views/reports/products/ProductsListView";
import LowStockView from "@/views/reports/products/LowStockView";
import expiredProductsView from "@/views/reports/products/expiredProductsView";

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
    },
    {
        path: '/report/products/products-expired',
        name: 'report-products-expired',
        component: expiredProductsView
    }
]

export default productsReportRouter;

