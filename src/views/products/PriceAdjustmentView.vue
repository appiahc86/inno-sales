<template>
<div class="container">
  <div class="row">
    <div class="col-10 mt-4 mx-auto" style="max-width: 700px;">
      <h4 class="text-center text-primary mb-3">PRICE ADJUSTMENT</h4>

      <template v-if="loading">
        <v-select placeholder="Loading data. please wait......"
                  class="v-select" disabled="disabled" title="Data is loading. please be patient...">
        </v-select>
      </template>
      <template v-else>
        <v-select :options="products" label="productName" v-model="selectedProduct"
                  placeholder="select product" class="v-select form-control-dark">
        </v-select>
      </template>

      <!--     Form   -->
        <div class="container" v-if="selectedProduct">
          <div class="row justify-content-center">
            <div class="col-8 mt-3">

              <!--     Form   -->
              <form @submit.prevent="updatePrice">
                <div class="text-center mb-0">
                    <h6 class="text-white bg-secondary fw-bold p-2">Current Price</h6>
                </div>
                <div class="d-flex">
                  <h6>Buying Price</h6>
                  <h6 class="mx-auto">Selling Price</h6>
                </div>

                <div class="d-flex">
                  <input type="text"  v-model="data.oldBuyingPrice" class="form-control" disabled>&nbsp;
                  <input type="text"  v-model="data.oldSellingPrice" class="form-control" disabled>
                </div>

                <div class="text-center mt-3">
                    <h6 class="bg-secondary text-white p-2 fw-bold">New Price</h6>
                </div>
                <div class="d-flex">
                  <h6>Buying Price</h6>
                  <h6 class="mx-auto">Selling Price</h6>
                </div>
                <div class="d-flex">
                  <input type="number" step="any" min="0" class="form-control"
                         v-model.number="data.newBuyingPrice" oninput="validity.valid || (value = 0)">&nbsp;
                  <input type="number" step="any" class="form-control" min="0"
                         v-model.number="data.newSellingPrice" oninput="validity.valid || (value = 0)">
                </div>

                <textarea cols="30" rows="4" class="form-control mt-2" placeholder="Reason"
                          v-model.trim="data.reason" maxlength="254"></textarea>

                <div class="text-center mt-2" v-if="data.newBuyingPrice && data.newSellingPrice && data.reason">
                  <button class="p-button p-button-rounded p-button-vertical" name="submitBtn">
                    <span class="pi pi-save"></span>
                    Save
                  </button>
                </div>

              </form>


            </div>
          </div>
        </div>



    </div>
  </div>
</div>



</template>

<script setup>

import {reactive, ref, watch, computed} from "vue";
import { formatNumber } from "@/functions";
import db from "@/dbConfig/db";
import {useStore} from "vuex";

const loading = ref(false);
const products = ref([]);
const selectedProduct = ref(null);
const store = useStore()

const user = computed(() => store.getters.user);

const data = reactive({
  id: null,
  oldBuyingPrice: null,
  oldSellingPrice: null,
  newBuyingPrice: null,
  newSellingPrice: null,
  productName: null,
  reason: null
})


//get all products
const getAllProducts = async () => {
  try {
    loading.value = true;
    products.value = await db('products')
        .select('products.id',
            'products.productName',
            'products.sellingPrice',
            'products.buyingPrice',
        );

    loading.value = false;

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
}
getAllProducts();



watch(selectedProduct, (value, oldValue) => {
  if (value) {
    resetData();
    data.id = value.id;
    data.oldBuyingPrice = formatNumber(parseFloat(value.buyingPrice));
    data.oldSellingPrice = formatNumber(parseFloat(value.sellingPrice));
    data.newBuyingPrice = parseFloat(value.buyingPrice);
    data.productName = value.productName;
  }
})


//Reset form data
const resetData = () => {
      data.id = null;
      data.oldBuyingPrice = null;
      data.oldSellingPrice = null;
      data.newBuyingPrice = null;
      data.newSellingPrice = null;
      data.productName = null;
      data.reason = null;
}



//Update Price
const updatePrice = async (e) => {
  try {

    e.target.submitBtn.disabled = true;

    await db.transaction( async trx => {

        //Insert into priceAdjustments table
      await trx('priceAdjustments').insert({
        userId: user.value.id,
        productId: data.id,
        oldCost: data.oldBuyingPrice,
        newCost: data.newBuyingPrice,
        oldPrice: data.oldSellingPrice,
        newPrice: data.newSellingPrice,
        productName: data.productName,
        reason: data.reason
      })

      //Modify Price in products table
      await trx('products').where('id', data.id).update({
        buyingPrice: data.newBuyingPrice,
        sellingPrice: data.newSellingPrice
      })

    })

    selectedProduct.value = null;
    ipcRenderer.send("successMessage", "Update was successful");

      //Update in frontend
    for (const product of products.value) {
      if (product.id.toString() === data.id.toString()){
        product.buyingPrice = data.newBuyingPrice;
        product.sellingPrice = data.newSellingPrice;
        break;
      }
    }

    resetData();
  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
    finally {  e.target.submitBtn.disabled = false }

}


</script>

<style scoped>
.form-control:focus{
  border-color: transparent;
  background-color: #dde0e3;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}
</style>