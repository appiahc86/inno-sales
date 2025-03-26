
<template>
<div class="">
  <h4 class="text-center my-3">Transfers</h4>

  <div class="d-inline-fle fw-bold justify-content-center text-center my-4">
    <label>
      <input type="radio" id="warehouseToStore" value="warehouseToStore" v-model="transferType" class="p-radiobutton">
      Warehouse To Store
    </label>
    &nbsp; &nbsp; &nbsp; &nbsp;
    <label>
      <input type="radio" id="storeToWarehouse" value="storeToWarehouse" v-model="transferType" class="p-radiobutton">
      Store To Warehouse
    </label>
  </div>

  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">

        <template v-if="loading">
          <v-select placeholder="Loading data. please wait......"
                    class="v-select" disabled="disabled" title="Data is loading. please be patient...">
          </v-select>
        </template>
        <template v-else>
          <v-select :options="products" label="productName" v-model="selectedProduct"
                    placeholder="select product" class="v-select">
          </v-select>
        </template>


      </div>
      <div class="col-2">
        <div class="input-group">
          <div class="input-group-text fw-bold">Qty</div>
          <input type="number" step="1" min="1" class="form-control-dark form-control"
                 v-model.number="quantity" oninput="validity.valid || (value = 1)">
        </div>

      </div>
    </div>

    <div class="text-center mt-4">
      <button class="p-1 px-2 fw-bold" @click="transfer"
              :disabled="!selectedProduct || loading">
        Transfer &nbsp;
        <span class="spinner-border spinner-border-sm" v-if="loading"> </span>
      </button>
    </div>

  </div>


</div>


</template>

<script setup>

import {ref} from "vue";
import db from "@/dbConfig/db";
import 'vue-select/dist/vue-select.css'
import { useStore } from "vuex";

const loading = ref(false);
const store = useStore();
const selectedProduct = ref(null);
const products = ref([]);
const quantity = ref(1)
const transferType = ref('warehouseToStore');




//get all products
const getAllProducts = async () => {
  try {
    loading.value = true;
    products.value = await db('products')
        .select('id', 'quantity', 'warehouseQty', 'productName');


  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }
}
getAllProducts();


//Transfer Product
const transfer = async (e) => {
  try {
    e.target.disabled = true;
    loading.value = true;

    if (!quantity.value || quantity.value < 1)
      return  ipcRenderer.send("errorMessage", "Please Enter quantity.");

    if (!selectedProduct.value)
      return  ipcRenderer.send("errorMessage", "Please Select An Item.");


    const item = {
      id: selectedProduct.value.id,
      quantity: selectedProduct.value.quantity,
      warehouseQty: selectedProduct.value.warehouseQty,
    }

    if (transferType.value === "warehouseToStore") { //If from warehouse to store
      item.warehouseQty -= quantity.value;
      item.quantity += quantity.value;
    }else {    //If from store to warehouse
      item.quantity -= quantity.value;
      item.warehouseQty += quantity.value;
    }

    //update in db
    await db('products')
        .where('id', item.id)
        .update({
          quantity: item.quantity,
          warehouseQty: item.warehouseQty
        })

    //Update in frontend
    products.value.map(p => {
      if (p.id === item.id) {
        p.quantity = item.quantity;
        p.warehouseQty = item.warehouseQty;
      }
    })

    //Update qty in vuex store
    store.dispatch("productsModule/modifyQty", {id: item.id, qty: item.quantity, type: 'set'});

    //Reset data
    selectedProduct.value = null;
    quantity.value = 1;


  }catch (e) { ipcRenderer.send("errorMessage", e.message) }
  finally {
    e.target.disabled = false;
    loading.value = false
  }
}


</script>


<style scoped>

</style>