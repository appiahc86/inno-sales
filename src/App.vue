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

          <li class="nav-item">
            <router-link :to="{name: 'customers'}" class="nav-link">
              <span class="pi pi-users"> </span>
              Customers
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'vendors'}" class="nav-link">
              <span class="pi pi-users"></span>
              Vendors
            </router-link>
          </li>
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
                <!--  <li class="dropdown-divider fw-bold"></li>  -->
                <li><router-link :to="{name: 'bills'}" class="dropdown-item fw-bold">Outstanding Bills</router-link></li>
              </ul>
            </div>
          </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-2 mt-4 mb-1 text-white-50">
          <span>Settings</span>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link :to="{name: 'settings'}" class="nav-link">
              <span class="pi pi-cog"></span>
              App Settings
            </router-link>
          </li>
          <li class="nav-item">
            <div class="dropdown">
              <a class="dropdown-toggle nav-link" id="purchasing" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="pi pi-user"></span>
                Appiah
              </a>
              <ul class="dropdown-menu" aria-labelledby="purchasing" style="font-size: 0.9em !important;">
                <li><a class="dropdown-item fw-bold"><span class="pi pi-lock"></span> Reset Password</a></li>
                <li><a class="dropdown-item fw-bold"><span class="pi pi-power-off text-danger"></span> Logout</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <div class="d-flex" style="position: absolute; bottom: 0">
        <b class="text-white-50">Inno Sales 0.0.1</b>
        <b><span class="pi pi-arrow-circle-left text-white" style="margin-left: 100px; font-size: 1.5em; cursor: pointer;"
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
            <h2 v-if="backup">Backing up database please wait...</h2>

            <router-view/>



        </div>
      </div>
      </div>
    </main>

  </div>

</template>

<script setup>

import runMigrations from "@/models";
import db from "./dbConfig/db";
runMigrations() //Run all migrations
db.raw("VACUUM").then(()=>{})
db.raw('PRAGMA foreign_keys = ON').then(()=>{});

import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";


const settings = async () => { // insert data into company settings table
  try {
    let data = await db('settings').first();

    if (!data){
      data = { companyName: '', storeName: '', address: '', contact: '', tax: 0 }
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
const backup = ref(false)
const store = useStore();
const router = useRouter();


      ipcRenderer.on('backing-up', (event, args) =>{
        backup.value = true;
      })
      ipcRenderer.on('backup-complete', (event, args) =>{
        backup.value = false;
      })

const insertUser = async () => {
  const data = { firstName: "Collins", lastName: "Appiah",username: "innocent",password: "pass123",role: 1,};
  const users = await db('users').where('id', 1).first();
  let user = null;

  if (!users) {
   const setUser =  await db('users').insert(data);
    user = {...data, id: setUser[0]}
  }else user = users

  store.dispatch('setUser', user)

}


      onMounted(async ()=>{

        insertUser();

        // setInterval(()=>{
        //   if(time.value) time.value.innerHTML = new Date().toLocaleTimeString();
        // },500)
      })

// listen to report events and redirect to page
ipcRenderer.on('report', (event, args) => {
  router.push({name: args})
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

  //Set margin left on tabs
  const topNavs = root.value.querySelectorAll('.topNav');
  for (const topNav of topNavs) {
    topNav.classList.add('setMargin')
  }
}

//restore sidebar
const restoreSidebar = () => {
  sidebarMenu.value.classList.remove('hideMe')
  sidebarToggle.value.classList.add('hideMe');
  main.value.classList.add('main')

  //Remove margin left on tabs
  const topNavs = root.value.querySelectorAll('.topNav');
  for (const topNav of topNavs) {
    topNav.classList.remove('setMargin')
  }
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
