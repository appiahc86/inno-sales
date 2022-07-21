<template>
<div class="container-fluid pt-3">
  <div class="row justify-content-center">

    <div class="col-10">
      <h5 class="text-primary">Take Return/Exchange</h5>
      <p>Look up the receipt for the items being returned</p>
      <form class="py-2" @submit.prevent="searchReceipt">
        <div class="input-group">
          <input type="search" v-model.trim.number="search" class="form-control-dark px-3" placeholder="Enter Receipt#">
          <div class="input-group-append">
            <button type="submit" class="py-2 px-3 text-white bg-primary" name="submitBtn" style="border: none;">
              <span class="pi pi-search"></span>
            </button>
          </div>
        </div>
      </form>

      <div class="table-responsive" style="max-height: 450px;" >
        <table class="table table-borderless table-hover table-striped dnone">
          <thead>
          <tr>
            <th>Item</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Ext Price</th>
            <th>Return Qty</th>
            <th>Return</th>
          </tr>
          </thead>

          <tbody>
          <tr>
            <td>Nokia</td>
            <td>50.00</td>
            <td>3</td>
            <td>150.00</td>
            <td><input type="number" value="1" style="max-width: 60px;"></td>
            <td><input type="checkbox"></td>
          </tr>
          <tr>
            <td>Nokia</td>
            <td>50.00</td>
            <td>3</td>
            <td>150.00</td>
            <td><input type="number" value="1" style="max-width: 60px;"></td>
            <td><input type="checkbox"></td>
          </tr>
          <tr>
            <td>Nokia</td>
            <td>50.00</td>
            <td>3</td>
            <td>150.00</td>
            <td><input type="number" value="1" style="max-width: 60px;"></td>
            <td><input type="checkbox"></td>
          </tr>
          </tbody>

        </table>
      </div>
      <button class="btn btn-primary my-2 float-end">Return</button>
    </div>
  </div>
</div>
</template>

<script setup>
import {ref} from "vue";
import db from "@/dbConfig/db";

const search = ref(null);
const items = ref([])


//Search for receipt number
const searchReceipt = async () => {
  if (!search.value) return ipcRenderer.send('errorMessage', 'Please Enter Receipt number');
  try {
    items.value = await db('orderDetails').where({ orderId: search.value });
    if (!items.value.length) return  ipcRenderer.send('errorMessage', 'Sorry No Match Found');
    console.log(items.value)
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}
</script>

<style scoped>

</style>