<template>
  <div ref="root">

    <nav id="sidebarMenu" class="d-md-block sidebar" ref="sidebarMenu">
      <div class="position-sticky">

        <h4 class="mt-2">&#128337; <span class="" ref="time" style="color: goldenrod"></span></h4>

        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link">
              <span class="pi pi-home"></span>
              Home
            </router-link>
          </li>

          <li class="nav-item">
            <div class="dropdown">
              <a class="dropdown-toggle nav-link" id="sales" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="pi pi-shopping-cart"></span>
                Sales
              </a>
              <ul class="dropdown-menu" aria-labelledby="sales" style="font-size: 0.9em !important;">
                <li><router-link :to="{name: 'sales'}" class="dropdown-item fw-bold">New Sales Receipt</router-link></li>
                <li><router-link :to="{name: 'held-items'}" class="dropdown-item fw-bold">Held Receipts</router-link></li>
                <li><router-link :to="{name: 'sales-history'}" class="dropdown-item fw-bold">Sales History</router-link></li>
                <li class="dropdown-divider fw-bold"></li>
                <li><router-link :to="{name: 'sales-products-list'}" class="dropdown-item fw-bold">Products List</router-link></li>
                <li><router-link :to="{name: 'sales-return'}" class="dropdown-item fw-bold">Accept Return</router-link></li>
              </ul>
            </div>
          </li>


            <!--   Set Permissions       -->
          <template v-if="user">
          <template v-if="parseInt(user.role) === 1 || parseInt(user.role) === 2">


          <!-- Inventory -->
          <li class="nav-item">
            <div class="dropdown">
              <a class="dropdown-toggle nav-link" id="purchasing" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="pi pi-tag"></span>
                Inventory
              </a>
              <ul class="dropdown-menu" aria-labelledby="purchasing" style="font-size: 0.9em !important;">
                <li><router-link :to="{name: 'products'}" class="dropdown-item fw-bold">Products</router-link>
                </li>
                <li>
                  <router-link :to="{name: 'categories'}" class="dropdown-item fw-bold">Categories</router-link>
                </li>
                <li>
                  <router-link :to="{name: 'price-adjustment'}" class="dropdown-item fw-bold">Price Adjustment</router-link>
                  <router-link :to="{name: 'qty-adjustment'}" class="dropdown-item fw-bold">Qty Adjustment</router-link>
                </li>
              </ul>
            </div>
          </li>

          <!-- Customers -->
          <li class="nav-item">
            <router-link :to="{name: 'customers'}" class="nav-link">
              <span class="pi pi-users"> </span>
              Customers
            </router-link>
          </li>

          <!-- Vendors -->
          <li class="nav-item">
            <router-link :to="{name: 'vendors'}" class="nav-link">
              <span class="pi pi-users"></span>
              Vendors
            </router-link>
          </li>

          <!-- Purchasing -->
        <template v-if="parseInt(user.role) === 1">
          <li class="nav-item">
            <div class="dropdown">
              <a class="dropdown-toggle nav-link" id="purchasing" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="pi pi-shopping-bag"></span>
                Purchasing
              </a>
              <ul class="dropdown-menu" aria-labelledby="purchasing" style="font-size: 0.9em !important;">
                <li><router-link :to="{name: 'receiveItems'}" class="dropdown-item fw-bold">Receive Items</router-link></li>
                <li><router-link :to="{name: 'receivingHistory'}" class="dropdown-item fw-bold">Receiving History</router-link></li>
                <li class="dropdown-header">Bills</li>
                <li><router-link :to="{name: 'bills'}" class="dropdown-item fw-bold">Outstanding Bills</router-link></li>
              </ul>
            </div>
          </li>
        </template>

            <!-- Settings -->
            <div class="align-items-center px-2 mt-4 mb-1 text-white-50" style="font-size: 1em;">
              <span>Settings</span>
            </div>
            <li class="nav-item">
              <div class="dropdown">
                <a class="dropdown-toggle nav-link" id="app-settings" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="pi pi-cog"></span>
                  App Settings
                </a>
                <ul class="dropdown-menu" aria-labelledby="app-settings" style="font-size: 0.9em !important;">
                  <li>
                    <router-link :to="{name: 'settings'}" class="dropdown-item fw-bold">
                      Company Settings
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'users'}" class="dropdown-item fw-bold">
                      Manage Users
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>

          </template>
          </template>
        </ul>  <!-- ./ permissions -->


        <!-- User -->
        <br v-if="user && parseInt(user.role) === 3">
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <div class="dropdown">
              <a class="dropdown-toggle nav-link" id="purchasing" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="pi pi-user"></span>
                {{ user ? user.firstName : '' }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="purchasing" style="font-size: 0.9em !important;">
                <li><router-link :to="{name: 'reset-password'}" class="dropdown-item fw-bold"><span class="pi pi-lock"></span> Reset Password</router-link></li>
                <li><a class="dropdown-item fw-bold" @click="logout">
                  <span class="pi pi-power-off text-danger"></span> Logout</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>



      </div>

      <div class="d-flex" style="position: absolute; bottom: 0">
        <b class="text-light">&nbsp;Inno Sales 1.0.0</b>
        <b><span class="pi pi-arrow-circle-left text-white" style="margin-left: 3.5em; font-size: 1.5em; cursor: pointer;"
                 @click="collapseSidebar" title="Collapse Sidebar"></span></b>
      </div>

    </nav>


    <div class="sidebar-toggle hideMe" title="Click To Expand" ref="sidebarToggle" @click="restoreSidebar">
      <div class="top text-center"><span class="pi pi-arrow-circle-right text-white" style="margin-top: 3px;"></span></div>
      <div class="middle-text"><b style="font-size: 1.3em;">click here to expand</b></div>
      <div class="bottom text-center">&nbsp;<span class="pi pi-arrow-circle-right text-white"></span></div>
    </div>

    <main class="main mb-3" ref="main">
      <div class="container-fluid">
      <div class="row">
        <div class="col-12">

            <hr class="mt-0 fw-bold">

          <!--       Notification Area         -->
          <ul class="nav flex-column" style="position: absolute; right: 5%;"
              v-if="(lowQuantityProducts && lowQuantityProducts.length)
               || (getExpiringProducts && getExpiringProducts.length)
               || (getAlreadyExpiredProducts && getAlreadyExpiredProducts.length)">
            <li class="nav-item">
              <div class="dropdown">

                <a class="dropdown-toggle position-relative" id="purchasing" data-bs-toggle="dropdown"
                   aria-expanded="false" style="cursor: pointer;" title="Notifications">
                  <span class="pi pi-bell" style="font-size: 1.5em;"></span>
                  <sup class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.9em;">
                    <span class="pi pi-envelope blink"></span>
                  </sup>
                </a>

                <div class="dropdown-menu dropdown-menu-right">
                  <span class="dropdown-item dropdown-header">Notifications</span>

                  <!--       Low Quantity products         -->
                  <template v-if="getExpiringProducts && getExpiringProducts.length">
                    <div class="dropdown-divider"></div>
                    <router-link :to="{name: 'report-products-expiring'}" class="dropdown-item">
                      <i class="pi pi-envelope"></i>&nbsp;
                      <b>{{ getExpiringProducts.length }}</b>
                      product(s) expiring
                    </router-link>
                  </template>

                  <!--       Expiring products         -->
                  <template v-if="lowQuantityProducts && lowQuantityProducts.length">
                    <div class="dropdown-divider"></div>
                    <router-link :to="{name: 'low-stock'}" class="dropdown-item">
                      <i class="pi pi-envelope"></i>
                      <b>&nbsp; {{ lowQuantityProducts.length }}</b>
                      product(s) below qty of 5
                    </router-link>
                  </template>

                  <!--       Already Expired products      -->
                  <template v-if="getAlreadyExpiredProducts && getAlreadyExpiredProducts.length">
                    <div class="dropdown-divider"></div>
                    <router-link :to="{name: 'report-products-expired'}" class="dropdown-item text-danger">
                      <i class="pi pi-envelope"></i>
                      <b>&nbsp; {{ getAlreadyExpiredProducts.length }} </b>
                      product(s) already expired
                    </router-link>
                  </template>

                </div>

              </div>
            </li>
          </ul>


              <!--   Inject views here   -->
            <router-view/>

        </div>
      </div>
      </div>
    </main>

  </div>



  <dialog ref="backupDialog" style="border: 1px solid #ccc;">
    <h5>Backing Up Database, Please Wait... <span class="spinner-grow"></span></h5>
  </dialog>

  <dialog ref="rebuildDialog" style="border: 1px solid #ccc;">
    <h5>Rebuilding Database... <span class="spinner-border"></span></h5>
    <h6 class="text-danger">Please do not close this application or shut down the computer.</h6>
  </dialog>

</template>

<script setup>

// import runMigrations from "@/models";
import db from "./dbConfig/db";
// runMigrations() //Run all migrations
db.raw('PRAGMA foreign_keys = ON').then(()=>{}); //set foreign key checks on

// const boom = [];
// for (let i = 0; i < 1000; i++) {

  // boom.push({
  //   name: 'Akwasi Mensah', company: 'Boom company limited', phone: '09897652334', address: 'gsdgmj sjkdgkkjs dkfkjhkjhs dsdfgjksd'
  // })

  // boom.push({
  //   orderDate: '2022-09-12 07:54:00', type: 'sale', momo:0, total:3000.00, tendered:6200.00, discount:0, tax:0, userId:1
  // })
  // boom.push({
  //   productName: 'Nokia X2', quantity: 30, buyingPrice: 200, sellingPrice:900, category: 1, tax: 'tax', description: 'hello'
  // })
  // boom.push({
  //   productId: 3, productName: 'Wardrobe', quantity: 3, buyingPrice: 900, originalPrice: 900, sellingPrice: 900,
  //   total: 3000, tax: 0, discount: 0, date: '2022-07-16 07:54:00', categoryId: 1, orderId: 3675003
  // })
//
//
// }

// db.batchInsert('customers', boom, 30).then(()=> console.log('data in bulk'));
// db('customers').del().then(() => console.log('deleted'));
// db.batchInsert('orders', boom, 30).then(()=> console.log('orders created'));
// db.batchInsert('products', boom, 30).then(()=> console.log('products created'));
// db.batchInsert('orderDetails', boom, 30).then(()=> console.log('order details created'));




import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";


const settings = async () => { // insert data into company settings table
  try {
    let data = await db('settings').first();
    store.dispatch('cartModule/setTax', data.tax ? parseFloat(data.tax) : 0);
    store.dispatch('setSettings', {...data, tax: undefined})
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }

}
 settings();



const time = ref(null);
const store = useStore();
const router = useRouter();
const backupDialog = ref(null);
const rebuildDialog = ref(null);
const user = computed(() => store.getters.user);
const lowQuantityProducts = computed(() => store.getters["productsModule/getLowQty"]); //Low qty Products
const getExpiringProducts =  computed(() => store.getters["productsModule/getExpiringProducts"]); //Expired Products
const getAlreadyExpiredProducts = computed(()=> store.getters["productsModule/getAlreadyExpiredProducts"]) //Already expired products




      onMounted(async () => {

        try {
          const products = await db.raw("SELECT id, quantity, expiration FROM products");
          store.dispatch("productsModule/setProducts", products)
        }catch (e) {
          console.log(e.message);
          ipcRenderer.send('errorMessage', 'Sorry, error occurred. Please try restarting this application');
        }


        setInterval(()=>{ //Display Time
          if(time.value) time.value.innerHTML = new Date().toLocaleTimeString();
        },500)


      }) // ./onMounted hook


//Logout
const logout = () => {
  store.dispatch('logout', '');
  ipcRenderer.send('logout');
  router.push({name: 'login'})
}

// listen to route events and redirect to page
ipcRenderer.on('routing', (event, args) => {
  router.push({name: args});
})

//backup database
ipcRenderer.on('backing-up', (event, args) => {
  backupDialog.value.showModal();
  backupDialog.value.addEventListener('cancel', e => e.preventDefault());
})
ipcRenderer.on('backup-complete', (event, args) => {
  backupDialog.value.close();
})

//Rebuild Database
ipcRenderer.on('rebuild-db', async (event, args) => {
  rebuildDialog.value.showModal();
  rebuildDialog.value.addEventListener('cancel', e => e.preventDefault());
  try {
    await db.raw("VACUUM");
    ipcRenderer.send('successMessage', 'Congrats!!!, Database Rebuild was successful')
  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
  finally { rebuildDialog.value.close() }
})

                    //....................Handle sidebar toggle.............................
const root = ref(null);
const sidebarMenu = ref(null);
const sidebarToggle = ref(null);
const main = ref(null);

const collapseSidebar = () => {
  sidebarMenu.value.classList.add('hideMe');
  sidebarToggle.value.classList.remove('hideMe');
  main.value.classList.remove('main')
}

//restore sidebar
const restoreSidebar = () => {
  sidebarMenu.value.classList.remove('hideMe')
  sidebarToggle.value.classList.add('hideMe');
  main.value.classList.add('main')
  console.clear();
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


nav a.router-link-exact-active {
  color: white;
  font-weight: bold;
  background: #041e34;
}
.dropdown-menu{
  background: #ccc;
}
</style>
