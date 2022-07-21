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
                    <span title="Price & Qty" style="cursor: pointer" @click="openDialog(cartItem)">&#128221;</span>
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

          <div class="container" v-if="cart.length">
            <div class="row">
              <div class="col">
                <button class="btn-warning float-end" @click="clearCart"><b>Clear Cart</b></button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!--      Payments -->
      <div class="col-4">
        <div class="card shadow-lg ">
          <div class="card-body">

            <h5 class="text-center fw-bold blink" v-if="total && paymentData.vendor === null">
              Please Select Vendor</h5>
            <h5 class="text-center fw-bold" v-else>Enter billing info</h5>

            <form @submit.prevent="savePurchase">
              <v-select :options="vendors" label="company" v-model="paymentData.vendor"
                        placeholder="select Vendor" class="v-select mb-3">
              </v-select>

              <label>
                <input type="checkbox" class="p-checkbox" v-model="paymentData.alreadyPaid">
                <b> Mark this voucher as already paid</b>
              </label>
              <p class="text-center text-danger"><b>OR</b></p>
              <hr>
              <p><b>Enter the billing info from the vendor invoice</b></p>

              <div class="d-flex">
                <h6 class="w-50">Invoice#</h6>
                <h6 class="w-50">Bill Date<span class="text-danger">*</span></h6>
              </div>
              <div class="d-flex">
                <input type="text" class="form-control-dark w-50" v-model.trim="paymentData.invoice"> &nbsp;
                <input type="date" class="form-control-dark w-50" v-model="paymentData.billDate">
              </div>

              <div class="d-flex mt-1">
                <h6 class="w-50">Invoice Due</h6>
              </div>
              <div class="d-flex">
                <input type="date" class="form-control-dark w-50" v-model="paymentData.invoiceDue">
              </div>


                <label class="mt-2">
                  <input type="checkbox" class="p-checkbox" v-model="paymentData.printInvoice">
                  <b> Print Invoice</b>
                </label>


             <button class="float-end mt-2" name="submitBtn" style="width: 80px;" type="submit" :disabled="total === 0 || paymentData.vendor === null">
                <span class="pi pi-print"></span> Save</button>
            </form>
          </div>
        </div>

        <div class="card mt-5 p-2" v-if="paymentData.vendor" style="max-width: 400px; margin-left: auto;">
          <h6 class="text-center">{{ paymentData.vendor.company }}</h6>
          <div class="d-flex mt-0">
          <div>Invoice#: <b>{{ paymentData.invoice }}</b></div>
            <div style="margin-left: auto;"><b>Bill:</b> {{ paymentData.billDate }}</div>
          </div>
          <div class="d-flex">
            <div  style="margin-left: auto;"><b>Due: </b>{{ paymentData.invoiceDue }}</div>
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
          <div class="col">
            <b>Selling Price</b>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <input type="number" class="form-control-dark" min="1" v-model="editData.qty">
          </div>
          <div class="col">
            <input type="number" class="form-control-dark" min="0" step="any" v-model="editData.buyingPrice">
          </div>
          <div class="col">
            <input type="number" class="form-control-dark" min="0" step="any" v-model="editData.sellingPrice">
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
import * as Validator from "validatorjs";
import purchase from "@/models/Purchase";

const loading = ref(false);
const products = ref([]);
const vendors = ref([]);
const dialog = ref(null);
const selectedProduct = ref(null)
const store = useStore();

const editData = reactive({
  id: '',
  qty: 0,
  buyingPrice: 0,
  sellingPrice: 0,
})

const paymentData = reactive({ //payment form Data
  vendor: null,
  invoice: null,
  billDate: null,
  alreadyPaid: true,
  invoiceDue: null,
  printInvoice: true
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
            'products.buyingPrice',
            'products.sellingPrice',
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
  editData.sellingPrice = item.sellingPrice;
  dialog.value.showModal();
}

const resetFormData = () => {
  paymentData.alreadyPaid = true; paymentData.invoiceDue = null; paymentData.printInvoice = true;
  paymentData.vendor = null; paymentData.invoice = null; paymentData.billDate = null;
}


                //..............................Save Purchase.........................
const savePurchase = async (e) => {
  try {
    // validation
    let validation = new Validator(paymentData,{
      vendor: 'required',
      invoice: 'required',
      billDate: 'required',
      invoiceDue: 'required'
    })

    if (validation.passes()){ // If validation passes
      e.target.submitBtn.disabled = true;

      await db.transaction( async trx => {
      const purchase = await trx('purchases').insert({ //Save to purchase table
        billDate: new Date(paymentData.billDate).setHours(0,0,0,0),
        invoiceDue: new Date(paymentData.invoiceDue).setHours(0,0,0,0),
        vendorId: paymentData.vendor.id,
        numberOfItems: cart.value.length,
        invoice: paymentData.invoice,
        total: total.value,
      })


      const purchaseDetailsArray = [];     //prepare for batch insert into purchase details
      for (const item of cart.value) {
        purchaseDetailsArray.push({
          purchaseId: purchase,
          productName: item.productName,
          productId: item.id,
          quantity: item.qty,
          cost: item.buyingPrice,
          total: parseFloat(item.buyingPrice) * parseInt(item.qty)
        })
      }
      //Batch Insert into purchase details table
      await trx.batchInsert('purchaseDetails', purchaseDetailsArray, 30);


      //add payment if already paid
        if (paymentData.alreadyPaid){
          await trx('billPayments').insert({
            purchaseId: purchase,
            date: new Date(paymentData.billDate).setHours(0,0,0,0),
            amount: total.value,
            note: ''
          })
        }

      //Add quantity to products table
      for (const item of cart.value) {
        await trx('products').where('id', '=', item.id )
            .first()
            .update({
              buyingPrice: parseFloat(item.buyingPrice),
              sellingPrice: item.sellingPrice
            }).increment({quantity: parseInt(item.qty)})
      }

    })

      if (paymentData.printInvoice){
        window.print(); //TODO print
      }

      clearCart();
      resetFormData();

    }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

  }catch (e) {ipcRenderer.send('errorMessage', e.message)}
  finally {
    e.target.submitBtn.disabled = false
  }
}

</script>

<style scoped>

</style>