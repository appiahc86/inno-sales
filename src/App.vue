<template>

  <div class="container-fluid">
    <div class="row">
      <nav id="sidebarMenu" class="col-md-2 d-md-block sidebar">
        <div class="position-sticky ">

            <h4 class="mt-2">&#128337; <span class="" ref="time" style="color: goldenrod"></span></h4>


          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" aria-current="page">
                <span data-feather="home" class="pi pi-home"></span>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'sales'}" class="nav-link">
                <span class="pi pi-shopping-cart"></span>
               Sales
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'products'}" class="nav-link">
                <span class="pi pi-cog"></span>
                Inventory
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'categories'}" class="nav-link">
                <span data-feather="users">&#127513;</span>
                Categories
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'customers'}" class="nav-link">
                <span class="pi pi-user"></span>
                Customers
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'vendors'}" class="nav-link">
                <span class="pi pi-user"></span>
                Vendors
              </router-link>
            </li>
            <li class="nav-item">
              <div class="dropdown">
                <a class="dropdown-toggle nav-link" id="purchasing" data-bs-toggle="dropdown" aria-expanded="false">
                  <span data-feather="users">&#127513;</span>
                  Purchasing
                </a>
                <ul class="dropdown-menu" aria-labelledby="purchasing" style="background: #ccc;">
                  <li><a class="dropdown-item" href="#">Receive Items</a></li>
                  <li><a class="dropdown-item" href="#">Return Voucher</a></li>
                  <li class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#">Receiving History</a></li>
                  <li><a class="dropdown-item" href="#">Held Vouchers</a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'home' }" class="nav-link">
                <span data-feather="bar-chart-2">&#127513;</span>
                Home
              </router-link>
            </li>
          </ul>

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Saved reports</span>
          </h6>
          <ul class="nav flex-column mb-2">
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text"></span>
                Current month
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text"></span>
                Last quarter
              </a>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'settings'}" class="nav-link">
                <span class="pi pi-cog"></span>
                App Settings
              </router-link>
            </li>
          </ul>
        </div>
      </nav>


      <main class="col-md-10 ms-sm-auto main">
        <hr class="mt-0 fw-bold">
        <h2 v-if="backup">Backing up database please wait...</h2>

        <router-view/>

      </main>
    </div>
  </div>

</template>

<script setup>

import runMigrations from "@/models";
import db from "./dbConfig/db";
runMigrations() //Run all migrations
db.raw("VACUUM").then(()=>{})
db.raw('PRAGMA foreign_keys = ON').then(()=>{});
const settings = async () => { // insert data into company settings table
  try {
    let data = await db('settings').first();

    if (!data){
      data = { companyName: '', storeName: '', address: '', contact: '', tax: 0 }
      await db('settings').insert()
    }
    store.dispatch('cartModule/setTax', data.tax ? parseFloat(data.tax) : 0);
    store.dispatch('setSettings', {...data, tax: undefined})
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }

}
settings();

import {onMounted, ref} from "vue";
import {useStore} from "vuex";

const time = ref(null);
const backup = ref(false)
const store = useStore();


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


      onMounted(()=>{
        insertUser()
        setInterval(()=>{
          time.value.innerHTML = new Date().toLocaleTimeString();
        },10)
      })

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
</style>
