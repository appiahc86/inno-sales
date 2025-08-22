
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
  import QuantityAdjustment from "@/models/QuantityAdjustment";
  import PriceAdjustment from "@/models/PriceAdjustment";
  import Profit from "@/models/Profit";

const migrations =  [
    Category, User, Product, Customer, Order, OrderDetails, Profit, Settings,
    Vendor, Purchase, PurchaseDetails, BillPayment, QuantityAdjustment, PriceAdjustment
]

  const runMigrations = async () => {

    for (const migration of migrations) {
        await migration();
    }

      console.log('Database Connected')
  }

  export default runMigrations;