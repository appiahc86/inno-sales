<template>
<div class="container-fluid pt-3">
  <div class="row justify-content-center">

    <div class="col-12">
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

      <div v-if="items.length">
       <h5 class="text-center"><mark>Receipt#: {{ items[0].orderId }}</mark></h5>
      <div class="table-responsive" style="max-height: 450px;">
        <table class="table table-borderless table-hover table-striped">
          <thead>
          <tr>
            <th>Item</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Tax</th>
            <th>Discount</th>
            <th>Ext Price</th>
            <th>Return Qty</th>
            <th>Return</th>
          </tr>
          </thead>

          <tbody>
          <template v-for="item in items" :key="items.id">
            <tr>
              <td>{{ item.productName }}</td>
              <td>{{ formatNumber(parseFloat(item.sellingPrice)) }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatNumber( parseFloat(item.tax) ) }}</td>
              <td>{{ formatNumber( parseFloat(item.discount) ) }}</td>
              <td>{{ formatNumber( parseFloat(item.total) ) }}</td>
              <td>
              <input type="number" :value="item.returnQty" @change="editQuantity($event, item.id)"
                     style="max-width: 60px; outline: none; border: 1px solid white; background: #ccc;"
                     :min="1" :max="item.quantity" oninput="validity.valid||(value = max);">
              </td>
              <td><input type="checkbox" @click="markReturn($event, item.id)" class="p-checkbox"></td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>

        <button class="my-2 float-end p-1" :disabled="!anItemIsChecked" @click="confirmReturn" title="Return Item(s)">
          <b><span class="pi pi-undo"></span> Return</b>
        </button>
      </div>

      <div class="text-center">
        <h5 v-if="discount">Discount: <b>-{{ formatNumber(discount) }}</b></h5>
        <h5 v-if="tax">Tax: <b>{{ formatNumber(tax) }}</b></h5>
      <h3 class="text-danger" v-if="change">
        Change: <b>GHS {{ formatNumber(change) }}
      </b></h3>
    </div>

    </div>
  </div>
</div>
</template>

<script setup>
import {computed, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const search = ref(null);
const items = ref([]);
const returningItems = ref([]);
const change = ref(null);
const discount = ref(null);
const tax = ref(null);
const store = useStore();


//Search for receipt number
const searchReceipt = async () => {
  items.value = [];
  change.value = null;
  tax.value = null;
  discount.value = null;

  if (!search.value) return ipcRenderer.send('errorMessage', 'Please Enter Receipt number');
  try {
    const records = await db('orderDetails').where({ orderId: search.value });
    if (records.length){
      items.value = records;
      items.value.map(item => {
        item.returnQty = 1;
        item.toBeReturned = false;
      });
    }else return  ipcRenderer.send('errorMessage', 'Sorry No Match Found');
    search.value = null;
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}

//Edit item (Quantity)
const editQuantity = (e, id) => {
  e.target.value = parseInt(e.target.value) || 1

  for (const item of items.value) {
    if (item.id.toString() === id.toString()){
      item.returnQty = parseInt(e.target.value) || 1;
      break;
    }
  }

} // ./edit item quantity


//Mark checkbox to return
const markReturn = (e, id) => {
  for (const item of items.value) {
    if (item.id.toString() === id.toString()){
      item.toBeReturned = e.target.checked;
      break;
    }
  }
}

//Check if an item is checked to be returned
const anItemIsChecked = computed(() => {
  for (const item of items.value) {
    if (item.toBeReturned){
      return true;
    }
  }
  return false;
})


//Confirm Return
const confirmReturn = () => {
   returningItems.value = [];
   returningItems.value = items.value.filter(item => item.toBeReturned);
  let message = 'You are about to return these item(s) \n \n';
  for (const ret of returningItems.value) {
    message = message += `${ret.productName} ******* Qty: ${ret.returnQty}\n`;
  }
  message += '\n Are you sure you want to proceed? \n';
  ipcRenderer.send('confirm', {id: '', type: 'salesReturn', message } )}



          //......................Return Items ........................
ipcRenderer.on('salesReturn', async (event, args) => {

  try {
    //Prepare for batch insert into sales returns table
    const user = computed(() => store.getters.user);
    const data =[];
    for (const ret of returningItems.value) {
      let calculatedDiscount = parseFloat(ret.discount) / parseInt(ret.quantity);
      let calculatedTax = parseFloat(ret.tax) / parseInt(ret.quantity);

      data.push({
        userId: user.value.id,
        productId: ret.productId,
        productName: ret.productName,
        quantity: ret.returnQty,
        buyingPrice: ret.buyingPrice,
        originalPrice: ret.originalPrice,
        sellingPrice: ret.sellingPrice,
        total: parseFloat(ret.sellingPrice) * parseInt(ret.returnQty),
        tax: calculatedTax * parseInt(ret.returnQty),
        discount: calculatedDiscount * parseInt(ret.returnQty),
        date: new Date().setHours(0,0,0,0),
        categoryId: ret.categoryId,
        orderId: ret.orderId
      })
    }

    await db.transaction( async trx => {

      await trx.batchInsert('salesReturns', data, 30) // batch insert into salesReturns

      //add quantity to products table
      for (const ret of returningItems.value) {
        await trx('products').where('id', ret.productId).increment('quantity', ret.returnQty)
      }

    })

    //Calculate Change
    let calc = 0;
    let disc = 0;
    let tx = 0;
    for (const ret of returningItems.value) {
      let calculatedDiscount = parseFloat(ret.discount) / parseInt(ret.quantity);
      let calculatedTax = parseFloat(ret.tax) / parseInt(ret.quantity);
      disc += calculatedDiscount * parseInt(ret.returnQty);
      tx += calculatedTax * parseInt(ret.returnQty);
      calc += ( (parseFloat(ret.sellingPrice) * parseInt(ret.returnQty)) + (calculatedTax *  parseInt(ret.returnQty))  )
          - ( calculatedDiscount *  parseInt(ret.returnQty) );
    }


    returningItems.value = [];
    items.value = [];
    change.value = calc;
    discount.value = disc;
    tax.value = tx;

    }catch (e) { ipcRenderer.send('errorMessage', e.message) }

  })

</script>

<style scoped>

</style>