
import ProductIndexView from "@/views/products/ProductIndexView";
import PriceAdjustmentView from "@/views/products/PriceAdjustmentView";
import QuantityAdjustmentView from "@/views/products/QuantityAdjustmentView";
import lowStockView from "@/views/products/lowStockView";

const productRouter = [
    {
        path: '/products',
        name: 'products',
        component: ProductIndexView
    },
    {
        path: '/products/price-adjustment',
        name: 'price-adjustment',
        component: PriceAdjustmentView
    },
    {
        path: '/products/qty-adjustment',
        name: 'qty-adjustment',
        component: QuantityAdjustmentView
    },
    {
        path: '/products/low-stock',
        name: 'low-stock',
        component: lowStockView
    },
]

export default productRouter;
