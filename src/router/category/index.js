
import CategoryIndexView from "@/views/categories/CategoryIndexView";

const categoryRouter = [
    {
        path: '/categories',
        name: 'categories',
        component: CategoryIndexView,
        meta:{
            requiresAuth: false
        }
    }

]


export default categoryRouter;
