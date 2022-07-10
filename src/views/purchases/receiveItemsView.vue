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
                <th>Cost</th>
                <th style="width: 20%; text-align: center;">Qty</th>
                <th>Ext Price</th>
                <th style="min-width: 50px;"></th>
              </tr>
              </thead>
              <tbody>

              <template v-for="cartItem in cart" :key="cartItem.id">
                <tr class="fw-bold">
                  <td>{{ cartItem.productName }}</td>
                  <td>{{ formatNumber(cartItem.buyingPrice) }}</td>
                  <td>
                    <button @click="decrement(cartItem.id)" style="border-radius: 7px; font-size: 9px">&#10134;</button>
                    <span class="mx-3">{{ cartItem.qty }} </span>
                    <button @click="increment(cartItem.id)" style="border-radius: 7px; font-size: 9px"> &#10133;</button>
                  </td>
                  <td>{{ formatNumber(cartItem.buyingPrice * cartItem.qty) }}</td>
                  <td>
                 <span @click="removeFromCart(cartItem.id)" class="text-danger fw-bold" style="cursor: pointer" title="Remove item">
                   X
                 </span>&nbsp;
                    <span title="Price & Discount" style="cursor: pointer" @click="openDialog(cartItem)">&#128221;</span>
                  </td>
                </tr>
              </template>

              </tbody>
            </table>
          </div>

          <div class="pt-4">
            <div class="container-fluid p-1" style="background: black; color: white;">
              <div class="row">
                <div class="col justify-content-end"> <h6><span class="text-warning">Total: </span>{{ formatNumber(total) }}</h6></div>
              </div>
            </div>
            <h5><span class="text-danger fw-bold">Amount Due: </span>GHS {{ formatNumber(total) }}</h5>
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


  <!-- Edit cart item -->
  <dialog ref="dialog" class="border border-5 border-light">
    <div class="container-fluid">
      <h6 class="text-primary">Price & Qty</h6>
      <form @submit.prevent="edit">

        <div class="row">
          <div class="col">
            <b>Quantity</b>
          </div>
          <div class="col">
            <b>Cost Price</b>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <input type="number" class="form-control-dark" min="1" v-model="editData.qty">
          </div>
          <div class="col">
            <input type="number" class="form-control-dark" min="0" step="0.01" v-model="editData.buyingPrice">
          </div>
        </div>

        <div class="row mt-3">
          <div>
            <button class="float-end mx-3 w-25" type="button" @click="dialog.close()">cancel</button>
            <button class="float-end w-25 btn-secondary" type="submit">Save</button>
          </div>
        </div>

      </form>
    </div>
  </dialog>


</template>

<script setup>

import {ref} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";
import {watch} from "vue";
import {useStore} from "vuex";
import {computed} from "vue";
import {reactive} from "vue";

const loading = ref(false);
const products = ref([]);
const vendors = ref([]);
const dialog = ref(null);
const selectedVendor = ref(null);
const selectedProduct = ref(null)
const store = useStore();
const editData = reactive({
  id: '',
  qty: 0,
  buyingPrice: 0,
})



const cart = computed(() => store.getters["purchaseCartModule/cart"]); //Cart array
const total = computed(() => store.getters["purchaseCartModule/total"]); //get cart total

const clearCart = () => store.dispatch('purchaseCartModule/clearCart'); //Clear cart

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

//Add to cart
watch(selectedProduct, (value, oldValue) => {
  if (value) {
    store.dispatch("purchaseCartModule/addToCart", value)
    selectedProduct.value = null;
  }
})

//Increment cart item
const increment = (id) => {
  store.dispatch("purchaseCartModule/increment", id);
}

//Decrement cart item
const decrement = (id) => {
  store.dispatch("purchaseCartModule/decrement", id);
}

//Remove from cart
const removeFromCart = (id) => {
  store.dispatch("purchaseCartModule/removeFromCart", id);
}


        //...................Edit cart...................

//Edit cart Item
const edit = () => {
  store.dispatch("purchaseCartModule/edit", editData)
  dialog.value.close();
}

//Open edit dialog
const openDialog = (item) => {
  editData.id = item.id;
  editData.qty = item.qty;
  editData.buyingPrice = item.buyingPrice;
  dialog.value.showModal();
}




</script>

<style scoped>

</style>