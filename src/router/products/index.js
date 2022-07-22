
import ProductIndexView from "@/views/products/ProductIndexView";
import PriceAdjustmentView from "@/views/products/PriceAdjustmentView";

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
    }
]

export default productRouter;
