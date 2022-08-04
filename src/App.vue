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
        <b class="text-white-50">Inno Sales 1.0.0</b>
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
        <!--          Inject views here-->
            <router-view/>

        </div>
      </div>
      </div>
    </main>

  </div>



  <dialog ref="backupDialog" style="border: 1px solid #ccc;">
    <h5>Backing Up Database, Please Wait... <span class="spinner-grow"></span></h5>
  </dialog>

</template>

<script setup>

import runMigrations from "@/models";
import db from "./dbConfig/db";
runMigrations() //Run all migrations
db.raw("VACUUM").then(()=>{})
db.raw('PRAGMA foreign_keys = ON').then(()=>{});

import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";


const settings = async () => { // insert data into company settings table
  try {
    let data = await db('settings').first();

    if (!data){
      data = { companyName: 'Demo Company Name', storeName: '', address: '', contact: '', tax: 0 }
      await db('settings').insert(data)
    }
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
const user = computed(() => store.getters.user);


              //............If no user in users table, Create admin user ...................
const insertUser = async () => {

  const user = await db('users').first(); //Find one user

  if (!user) { //if No user found in table
    const data = {
      firstName: "Admin", lastName: "Admin",username: "admin",
      password: "$2a$10$N9sVJn6Nwxtm.PUmbRXLzOFNZfRAjTjNK3EfFu2qRjpnNHQrCbd6i", //@LogMeIn
      role: 1, dateAdded: new Date().setHours(0,0,0,0)
    };
  await db('users').insert(data);
  }

}

      onMounted(async () => {

        insertUser();

        setInterval(()=>{
          if(time.value) time.value.innerHTML = new Date().toLocaleTimeString();
        },500)

      })


//Logout
const logout = () => {
  store.dispatch('logout', '');
  ipcRenderer.send('logout');
  router.push({name: 'login'})
}

// listen to route events and redirect to page
ipcRenderer.on('routing', (event, args) => {
  router.push({name: args})
})

//backup database
ipcRenderer.on('backing-up', (event, args) => {
  backupDialog.value.showModal();
  backupDialog.value.addEventListener('cancel', e => e.preventDefault());
})
ipcRenderer.on('backup-complete', (event, args) => {
  backupDialog.value.close();
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
