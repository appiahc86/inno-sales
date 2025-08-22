<template>
<div class="container-fluid pt-3">
  <div class="row justify-content-center">

    <div class="col-12">
      <h5 class="text-primary">Take Return/Exchange</h5>
      <p>Look up the receipt for the items being returned</p>
      <form class="py-2" @submit.prevent="searchReceipt">
        <div class="input-group">
          <input type="search" v-model.trim.number="search" ref="searchInput" class="form-control-dark px-3" placeholder="Enter Receipt#">
          <div class="input-group-append">
            <button type="submit" class="py-2 px-3 text-white bg-primary" name="submitBtn" style="border: none;">
              <span class="pi pi-search"></span>
            </button>
          </div>
        </div>
      </form>

      <h5 class="text-center" v-if="loading">Loading...<span class="spinner-border spinner-border-sm"></span></h5>
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

        <div class="text-center">
          <h5>Pay With</h5>
          <label><input type="radio" id="cash" value="cash" v-model="paymentMethod" class="p-radiobutton"> Cash</label>
          &nbsp; &nbsp;
          <label><input type="radio" id="momo" value="momo" v-model="paymentMethod" class="p-radiobutton"> Momo</label>

          <div class="mt-3" v-if="paymentMethod === 'momo'">
            <h6 class="text-center">Momo Type</h6>
            <label><input type="radio" id="mtn" value="mtn" v-model="momoType" class="p-radiobutton"> MTN</label>
            &nbsp; &nbsp;
            <label><input type="radio" id="vodafone" value="vodafone" v-model="momoType" class="p-radiobutton"> Vodafone</label>
            &nbsp; &nbsp;
            <label><input type="radio" id="airtelTigo" value="airtelTigo" v-model="momoType" class="p-radiobutton"> AirtelTigo</label>
          </div>

          <br>
          <button class="p-1 mt-2" :disabled="!anItemIsChecked" ref="returnBtn"
                  @click="returnItems" title="Return Item(s)" style="width: 100px">
            <b><span class="pi pi-save"></span> Save</b>
          </button>

        </div>
      </div>

      <div class="text-center" v-if="success">
        <h5 v-if="discount">Discount: <b>{{ formatNumber(discount) }}</b></h5>
        <h5 v-if="tax">Tax: <b>{{ formatNumber(tax) }}</b></h5>
      <h3 class="text-danger" v-if="change">
        Change: <b>GH¢ {{ formatNumber(change) }}
      </b></h3>
    </div>

    </div>
  </div>
</div>

</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";
import moment from "moment/moment";

const loading = ref(false);
const searchInput = ref();
const search = ref(null);
const items = ref([]);
const returningItems = ref([]);
const change = ref(null);
const discount = ref(null);
const tax = ref(null);
const returnBtn = ref(null);
const momoType = ref('mtn');
const paymentMethod = ref('cash');
const store = useStore();
const success = ref(false);

const user = computed(() => store.getters.user);

onMounted(() => searchInput.value.focus() )

//Search for receipt number
const searchReceipt = async (e) => {
  items.value = [];
  change.value = null;
  tax.value = null;
  discount.value = null;
  paymentMethod.value = 'cash';
  success.value = false;

  if (!search.value) return ipcRenderer.send('errorMessage', 'Please Enter Receipt number');
  try {
    loading.value = true;
    e.target.submitBtn.disabled = true;
    const records = await db.select('orderDetails.id', 'orderDetails.productId', 'orderDetails.productName',
        'orderDetails.quantity', 'orderDetails.buyingPrice', 'orderDetails.originalPrice',
        'orderDetails.sellingPrice', 'orderDetails.total', 'orderDetails.tax', 'orderDetails.discount',
        'orderDetails.date', 'orderDetails.orderId', 'orderDetails.categoryId'
    )
        .from('orderDetails')
        .join('orders', 'orderDetails.orderId', '=', 'orders.id')
        .where({ orderId: search.value })
        .andWhere('orders.type', 'sale')
        .andWhere('orders.saleType', 'cash')
        // .groupBy('orderDetails.id')


    if (records.length){
      items.value = records;
      items.value.map(item => {
        item.returnQty = item.quantity;
        item.toBeReturned = false;
      });
    }else return  ipcRenderer.send('errorMessage', 'Sorry No Match Found');
    search.value = null;
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }finally {
    loading.value = false;
    e.target.submitBtn.disabled = false;
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

            //Calculate Change
const calculateChange = async () => {

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

  change.value = calc;
  discount.value = disc ? -disc : 0;
  tax.value = tx ? -tx : 0;
}

//Calculate profits of items to be returned
const profitToReturn = computed(() => {
  let profit = 0;
  for (const i of items.value) {
    if (i?.toBeReturned){ //If it is marked to be returned
      profit += ( (parseFloat(i.sellingPrice) - parseFloat(i.buyingPrice)) * parseInt(i.returnQty) ) - parseFloat(i.discount);
    }
  }
  return profit - (profit * 2)
})


          //...................... Return Items ........................
const returnItems = async () => {
  returningItems.value = items.value.filter(item => item.toBeReturned);
  returnBtn.value.disabled = true;
  try {

    await calculateChange();

    await db.transaction( async trx => {

            // Save to Orders table
      const data = {
        numberOfItems: -returningItems.value.length,
        type: 'return',
        orderDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        momo: paymentMethod.value === 'momo' ? -change.value : 0,
        total:  -change.value, //Get a negative value
        tendered: 0,
        discount: discount.value,
        momoType: paymentMethod.value === 'momo' ? momoType.value : '',
        tax: tax.value,
        customerId: 1,
        invoiceNumber:  moment().format('YYYYMMDDHHssSSS'),
        userId: user.value.id
      }


      const saveToOrders = await trx('orders').insert(data);

      const orderDetailsData = []; //for order Details table
      for (const ret of returningItems.value) {
        let calculatedDiscount = parseFloat(ret.discount) / parseInt(ret.quantity);
        let calculatedTax = parseFloat(ret.tax) / parseInt(ret.quantity);

        orderDetailsData.push({
          productId: ret.productId,
          productName: ret.productName,
          quantity: -ret.returnQty,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
          buyingPrice: ret.buyingPrice,
          originalPrice: ret.originalPrice,
          sellingPrice: ret.sellingPrice,
          total: parseFloat(ret.sellingPrice) * parseInt(ret.returnQty),
          tax: -(calculatedTax * parseInt(ret.returnQty)), //get negative value
          discount: -(calculatedDiscount * parseInt(ret.returnQty)), //get negative value
          categoryId: ret.categoryId,
          orderId: saveToOrders
        })
      }

      await trx.batchInsert('orderDetails', orderDetailsData, 30) // batch insert into order details

      //add quantity to products table
      for (const ret of returningItems.value) {
        await trx('products').where('id', ret.productId).increment('quantity', ret.returnQty);
      }


      //insert Profit to profits table
      await trx('profits').insert({
        orderId: items.value[0].orderId,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        profit: profitToReturn.value
      })


      //Update quantity in vuex store
      for (const ret of returningItems.value) {
        store.dispatch("productsModule/modifyQty", {id: ret.productId, qty: ret.returnQty, type: 'increment'})
      }

      //dispatch qty to vuex store products
      for (const ret of returningItems.value) {
        store.dispatch("productsModule/modifyQty", {id: ret.productId, qty: ret.returnQty, type: 'increment'});
      }
      returningItems.value = [];
      items.value = [];
      success.value = true;

    })




    }catch (e) { ipcRenderer.send('errorMessage', e.message) }
   // finally { returnBtn.value.disabled = true; }


  }

</script>

<style scoped>

</style>