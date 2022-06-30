
  import User from  "./User";
  import Category from  "./Category";
  import Product from  "./Product";
  import Customer from "./Customer";
  import Order from "./Order";
  import OrderDetails from "./OrderDetails";
  import Settings from "@/models/Settings";
  import Vendor from "@/models/Vendor";

const migrations =  [
    Category, User, Product, Customer, Order, OrderDetails, Settings, Vendor
]

  const runMigrations = ()=> {

    for (const migration of migrations) {
        migration();
    }
      console.log('Database Connected')
  }

  export default runMigrations;