
import ProductsListView from "@/views/reports/products/ProductsListView";
import LowStockView from "@/views/reports/products/LowStockView";
import ExpiringProductsView from "@/views/reports/products/ExpiringProductsView";
import ExpiredProductsView from "@/views/reports/products/ExpiredProductsView";

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
        path: '/report/products/products-expiring',
        name: 'report-products-expiring',
        component: ExpiringProductsView
    },
    {
        path: '/report/products/products-expired',
        name: 'report-products-expired',
        component: ExpiredProductsView
    },
]

export default productsReportRouter;

