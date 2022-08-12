<template>
  <div class="container">
    <div class="row">
      <div class="col-10 mt-4 mx-auto" style="max-width: 700px;">
        <h4 class="text-center text-secondary mb-3">QUANTITY ADJUSTMENT</h4>

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
              <form @submit.prevent="updateQuantity">
                <div class="text-center mb-0">
                  <h6 class="text-white bg-secondary fw-bold p-2 text-capitalize">{{ type }}</h6>
                </div>


                <div class="d-flex">
                  <select v-model="type" class="form-control">
                    <option value="increment">Increment</option>
                    <option value="decrement">Decrement</option>
                  </select>
                </div>


                <div class="d-flex mt-3">
                  <h6>Stock</h6>
                  <h6 class="mx-aut" style="margin-left: 50%;">{{ type === 'increment' ? 'Add' : 'Deduct' }}</h6>
                </div>
                <div class="d-flex">
                  <input type="text" class="form-control"
                         v-model="data.oldQuantity" disabled>&nbsp;
                  <input type="number" step="1" class="form-control" min="1"
                         v-model.number="data.newQuantity" oninput="validity.valid || (value = '')">
                </div>

                <textarea cols="30" rows="4" class="form-control mt-2" placeholder="Reason"
                          v-model.trim="data.reason" maxlength="254"></textarea>

                <div class="text-center mt-2" v-if="data.newQuantity">
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
import db from "@/dbConfig/db";
import {useStore} from "vuex";

const loading = ref(false);
const products = ref([]);
const selectedProduct = ref(null);
const store = useStore();
const type = ref('increment');

const user = computed(() => store.getters.user);

const data = reactive({
  id: null,
  oldQuantity: null,
  newQuantity: null,
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
            'products.quantity',
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
    data.oldQuantity = value.quantity;
    data.productName = value.productName;
  }
})


//Reset form data
const resetData = () => {
  data.id = null;
  data.newQuantity = null;
  data.oldQuantity = null;
  data.productName = null;
  data.reason = null;
  type.value = 'increment'
}



//Update Quantity
const updateQuantity = async (e) => {
  try {

    e.target.submitBtn.disabled = true;

    await db.transaction( async trx => {

      //Insert into quantityAdjustments table
      await trx('quantityAdjustments').insert({
        userId: user.value.id,
        date: new Date().setHours(0,0,0,0),
        productId: data.id,
        oldQuantity: data.oldQuantity,
        quantity: data.newQuantity,
        productName: data.productName,
        type: type.value,
        reason: data.reason
      })

      //Modify Quantity in products table
      if (type.value === 'increment'){
        await trx('products').where('id', data.id).increment('quantity', data.newQuantity);
        store.dispatch("productsModule/modifyQty", {id: data.id, qty: data.newQuantity, type: 'increment'})
      }else {
        await trx('products').where('id', data.id).decrement('quantity', data.newQuantity);
        store.dispatch("productsModule/modifyQty", {id: data.id, qty: data.newQuantity, type: 'decrement'})
      }
    })

    selectedProduct.value = null;
    ipcRenderer.send("successMessage", "Update was successful");

    //Update on frontend
    for (const product of products.value) {
      if (product.id.toString() === data.id.toString()){
        product.quantity = type.value === 'increment' ? parseInt(product.quantity) + parseInt(data.newQuantity) : parseInt(product.quantity) - parseInt(data.newQuantity);
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