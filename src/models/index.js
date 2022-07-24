
  import User from  "./User";
  import Category from  "./Category";
  import Product from  "./Product";
  import Customer from "./Customer";
  import Order from "./Order";
  import OrderDetails from "./OrderDetails";
  import Settings from "@/models/Settings";
  import Vendor from "@/models/Vendor";
  import Purchase from "@/models/Purchase";
  import PurchaseDetails from "@/models/PurchaseDetails";
  import BillPayment from "@/models/BillPayment";
  // import SalesReturn from "@/models/SalesReturn";
  import QuantityAdjustment from "@/models/QuantityAdjustment";
  import PriceAdjustment from "@/models/PriceAdjustment";

const migrations =  [
    Category, User, Product, Customer, Order, OrderDetails, Settings,
    Vendor, Purchase, PurchaseDetails, BillPayment, QuantityAdjustment, PriceAdjustment
]

  const runMigrations = ()=> {

    for (const migration of migrations) {
        migration();
    }
      console.log('Database Connected')
  }

  export default runMigrations;