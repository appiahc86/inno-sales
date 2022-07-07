<template>
  <div class="container-fluid mt-2">
    <div class="row mt-4">

      <!--   CART -->
      <div class="col-8">
        <div class="card shadow p-2" style="height: 500px;">
          <template v-if="loading">
            <v-select placeholder="Loading data. please wait......"
                      class="v-select" disabled="disabled" title="Data is loading. please be patient...">
            </v-select>
          </template>
          <template v-else>
            <v-select :options="products" label="display" v-model="selectedProduct"
                      placeholder="select product" class="v-select">
            </v-select>
          </template>
          <div class="table-responsive" style="height: 400px;">
            <table class="table table-sm mt-4 table-hover table-borderless table-striped">
              <thead style="border-bottom: 1px solid #ccc;">
              <tr>
                <th style="width: 45%;">Item</th>
                <th>Price</th>
                <th style="width: 20%; text-align: center;">Qty</th>
                <th>Ext Price</th>
                <th style="min-width: 50px;"></th>
              </tr>
              </thead>
              <tbody>

              <template v-for="cartItem in cart" :key="cartItem.id">
                <tr class="fw-bold">
                  <td>{{ 'iphone' }}</td>
                  <td>{{ formatNumber(9090) }}</td>
                  <td>
                    <button @click="" style="border-radius: 7px; font-size: 9px">&#10134;</button>
                    <span class="mx-3">{{ 7 }} </span>
                    <button @click="" style="border-radius: 7px; font-size: 9px"> &#10133;</button>
                  </td>
                  <td>{{ formatNumber(900 * 2) }}</td>
                  <td>
                 <span @click="" class="text-danger fw-bold" style="cursor: pointer" title="Remove item">
                   X
                 </span>&nbsp;
                    <span title="Price & Discount" style="cursor: pointer" @click="">&#128221;</span>
                  </td>
                </tr>
              </template>

              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!--      Payments -->
      <div class="col-4">
        <div class="card shadow-lg ">
          <div class="card-body">
            <h5 class="text-center fw-bold">Enter billing info</h5>
            <form @submit.prevent="">
              <v-select :options="vendors" label="company" v-model="selectedVendor"
                        placeholder="--select Vendor--" class="v-select mb-3">
              </v-select>

              <label><input type="checkbox" class="p-checkbox"><b> Mark this voucher as already paid</b></label>
              <p class="text-center text-danger"><b>OR</b></p>
              <hr>
              <p><b>Enter the billing info from the vendor invoice</b></p>

              <div class="d-flex">
                <h6 class="w-50">Invoice#</h6>
                <h6 class="w-50">Bill Date</h6>
              </div>
              <div class="d-flex">
                <input type="text" class="form-control-dark w-50"> &nbsp;
                <input type="date" class="form-control-dark w-50">
              </div>

              <div class="d-flex mt-1">
                <h6 class="w-50">Invoice Due</h6>
              </div>
              <div class="d-flex">
                <input type="date" class="form-control-dark w-50">
              </div>

              <button class="float-end mt-2" name="submitBtn" style="width: 80px;" type="submit">
                <span class="pi pi-print"></span> Save</button>
            </form>
          </div>
        </div>

        <div class="card mt-5 p-2" v-if="selectedVendor" style="max-width: 300px; margin-left: auto;">
          <h6 class="text-center">{{ selectedVendor.company }}</h6>
          <div class="d-flex mt-0">
          <div>Invoice#: <b>00443</b></div> <div style="margin-left: auto;"><b>Bill:</b> 07/05/2022</div>
          </div>
          <div class="d-flex">
            <div  style="margin-left: auto;"><b>Due: </b>08/08/2022</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";

const loading = ref(false);
const products = ref([]);
const vendors = ref([]);
const selectedVendor = ref(null);
const cart = ref([]);
const selectedProduct = ref(null)

// Get all products from db
const getAllProducts = async () => {
  try {
    loading.value = true;
    products.value = await db('products')
        .leftJoin('categories', 'products.category', '=','categories.id')
        .select('products.id',
            'products.productName',
            'products.sellingPrice',
            'products.buyingPrice',
            'products.quantity',
            'products.tax',
            'categories.id as categoryId'
        );
    products.value.map(p => {
      p.qty = 1;
      p.total = 0;
      p.display = `${p.productName} |  cost => ${formatNumber(parseFloat(p.buyingPrice))}`;

    })

    loading.value = false;

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
}
getAllProducts();


//Load vendors
const getVendors = async () => {
  try {
    vendors.value = await db('vendors');
  }catch (e) { ipcRenderer.send('errorMessage', e.message) }

}
getVendors();



</script>

<style scoped>

</style>