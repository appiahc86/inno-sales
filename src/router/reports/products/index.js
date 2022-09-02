
import ProductsListView from "@/views/reports/products/ProductsListView";
import LowStockView from "@/views/reports/products/LowStockView";
import ExpiringProductsView from "@/views/reports/products/ExpiringProductsView";
import ExpiredProductsView from "@/views/reports/products/ExpiredProductsView";
import QuantityAdjustmentView from "@/views/reports/products/QuantityAdjustmentView";
import PriceAdjustmentView from "@/views/reports/products/PriceAdjustmentView";

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
    {
        path: '/report/products/quantity-adjustment',
        name: 'report-quantity-adjustment',
        component: QuantityAdjustmentView
    },

    {
        path: '/report/products/price-adjustment',
        name: 'report-price-adjustment',
        component: PriceAdjustmentView
    },
]

export default productsReportRouter;

