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
                 <td>{{ cartItem.productName }}</td>
                 <td>{{ formatNumber(cartItem.sellingPrice) }}</td>
                 <td>
                   <button @click="decrement(cartItem.id)" style="border-radius: 7px; font-size: 9px">&#10134;</button>
                   <span class="mx-3">{{ cartItem.qty }} </span>
                   <button @click="increment(cartItem.id)" style="border-radius: 7px; font-size: 9px"> &#10133;</button>
                 </td>
                 <td>{{ formatNumber(cartItem.sellingPrice * cartItem.qty) }}</td>
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
             <div class="col"><b><span>SubTotal: </span>{{ formatNumber(subTotal) }}</b> </div>
             <div class="col"><b><span>Tax: </span>{{ formatNumber(totalTax) }}</b></div>
             <div class="col"><b><span>Discount: </span>{{ formatNumber(totalDiscount) }}</b></div>
             <div class="col justify-content-end"> <h6><span class="text-warning">Total: </span>{{ formatNumber(total) }}</h6></div>
           </div>
         </div>
         <h5><span class="text-danger fw-bold">Amount Due: </span>GHS {{ formatNumber(total) }}</h5>
       </div>

       <div class="container" v-if="cart.length">
         <div class="row">
           <div class="col">
             <button class="btn-info text-white" @click="putOnHold"><b>Put On Hold</b></button>
           </div>
           <div class="col">
             <button class="btn-warning" @click="clearCart"><b>Clear Cart</b></button>
           </div>
         </div>
       </div>

     </div>
   </div>

<!--  checkout  -->
   <div class="col-4">
     <div class="card shadow-lg p-1">
       <v-select :options="customers" label="display" v-model="selectedCustomer"
                 placeholder="--select customer--" class="v-select">
       </v-select>
         <h5 class="text-center fw-bold blink text-danger mt-1" v-if="tendered < total">Awaiting Payment</h5>
         <h5 class="mt-1 invisible" v-else>.</h5>

       <div class="card-body">
         <form @submit.prevent="checkout">
           <div class="d-flex">
             <h6 class="w-50">Cash</h6>
             <h6 class="w-50">MoMo</h6>
           </div>
           <div class="d-flex">
             <input type="number" class="form-control-dark w-50" step="0.01" v-model="cash" min="0" ref="cashRef"> &nbsp;
             <input type="number" class="form-control-dark w-50" step="0.01" v-model="momo" min="0" ref="momoRef">
           </div>

           <h6 class="mt-2 fw-bold">Tendered: {{ formatNumber(tendered) }}</h6>
           <h5 class="mt-2 fw-bold text-primary">Change: {{ formatNumber(change) }}</h5>
           <button class="float-end" name="submitBtn" style="width: 80px;" type="submit" :disabled="tendered < total || total === 0">
             <span class="pi pi-print"></span> Save</button>
         </form>
       </div>
     </div>

     <div class="card mt-5" v-if="selectedCustomer">
       <h5><b>Bill To: </b> <span class="text-black-50">{{ selectedCustomer.name }}</span></h5>
     </div>

   </div>


      <!-- Print table  -->
   <template class="">
     <div id="printTable">
       <div style="fonst-size: 0px;">
<div class="mt-0" style="font-size: 11px;">
  <span>{{ new Date().toLocaleString() }}</span>
  <b style="float: right;">Receipt #{{ barcode }}</b>
</div>
       <div  style="font-size: 12px;">Store: {{ companySettings.storeName }}</div>

       <div style="text-align: center;">
         <div style="font-size: 13px"><b>{{ companySettings.companyName }}</b></div>
         <div style="font-size: 11px">{{ companySettings.contact }}</div>
       </div>


         <template v-if="selectedCustomer">
           <div style="font-size: 12px"><br>
             <span><b>Bill To: </b></span> <span>{{ selectedCustomer.name }}</span>
           </div>
         </template>
         <br>
       <table style="width: 100%; font-size: 11px;">
       <thead>
       <tr style="border-bottom: 1px solid black; text-align: left; border-bottom: 1px solid black;">
         <th style="width: 40%;">Item</th>
         <th style="width: 10%;">Qty</th>
         <th style="width: 20%;">Price</th>
         <th style="width: 30%;">Ext Price</th>
       </tr>
       </thead>

         <tbody>
         <template v-for="item in cart">
           <tr style="text-align: left;">
             <td>{{ item.productName }}</td>
             <td>{{ item.qty }}</td>
             <td>{{ formatNumber(item.sellingPrice) }}</td>
             <td>{{ formatNumber(item.total) }}</td>
           </tr>
         </template>
         </tbody>
       </table>
       <hr>

       <div style="font-size: 12px !important">
         <div style="float: right;">Subtotal: GHS {{ formatNumber(subTotal) }}</div> <br>
         <template v-if="totalTax">
           <div style="float: right;">Tax: GHS {{ formatNumber(totalTax) }}</div> <br>
         </template>
         <template v-if="totalDiscount">
           <div style="float: right;">Discount: GHS {{ formatNumber(totalDiscount) }}</div> <br>
         </template>
         <div style="float: right;"><b>RECEIPT TOTAL: GHS {{ formatNumber(total) }}</b></div>
       </div><br>


        <div style="font-size: 12px; flaot: left;">Amount Tendered: GHS {{ formatNumber(tendered) }}</div>
        <div style="font-size: 12px; flaot: left;">Change Given: GHS {{ formatNumber(change) }}</div>

       <p style="font-size: 11px; text-align: center;">Thanks for shopping with us!</p>

       <div  style="text-align: center">
         <svg id="barcode"></svg>
       </div>

       <div style="font-size: 11px; text-align: center;">
         Software by <span class="fw-bold mt-2">Appiah</span> 0242740320</div>

     </div>
     </div>
   </template>

 </div>


</div>

      <!-- Edit cart item -->
  <dialog ref="dialog" class="border border-5 border-light">
    <div class="container-fluid">
      <h6 class="text-primary">Price & Discount</h6>
      <form @submit.prevent="edit">

      <div class="row">
        <div class="col">
            <b>Quantity</b>
        </div>
          <div class="col">
            <b>Price</b>
          </div>
      </div>

        <div class="row">
          <div class="col">
            <input type="number" class="form-control-dark" min="1" v-model="editData.qty">
          </div>
          <div class="col">
            <input type="number" class="form-control-dark" min="0" step="0.01" v-model="editData.sellingPrice">
          </div>
        </div>

        <div class="row">
          <div class="col">
            <b>Discount</b>
          </div>
          <div class="col">
            <b>Discount %</b>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <input type="number" ref="discountInput" class="form-control-dark" min="0" step="any" v-model.number="editData.discount">
          </div>
          <div class="col">
            <input type="number" ref="discountInPercentageInput" class="form-control-dark" min="0" max="100" step="any" v-model.number="editData.discountInPercentage">
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
//TODO Put on hold
import {ref, watch, computed, reactive, onMounted} from "vue";
import db from "@/dbConfig/db";
import 'vue-select/dist/vue-select.css'
import { useStore } from "vuex";
import { formatNumber } from "@/functions";

const store = useStore();
const selectedProduct = ref(null);
const selectedCustomer = ref(null);
const products = ref([]);
const customers = ref([]);
const dialog = ref(null);
const barcode = ref(1); //For barcode
const loading = ref(false);
const companySettings = computed(() => store.getters.setting); //get company settings


const discountInput = ref(null) // will watch and check if its focused
const discountInPercentageInput = ref(null) // will watch and check if its focused
const editData = reactive({
  id: '',
  qty: 0,
  sellingPrice: 0,
  originalPrice: 0,
  discount: 0,
  discountInPercentage: 0
})

//get all products

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
      p.discount = 0;
      p.display = p.productName + " " + " ---->"  + " price = " + formatNumber(p.sellingPrice);
      p.originalPrice = p.sellingPrice;
      p.salesTax = 0;
      p.total = 0;

    })

    loading.value = false;

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
}
getAllProducts();


//.............Get all Customers .........................
const getCustomers = async () => {
  try {
    customers.value = await db.select().from('customers');
    customers.value.map(cust => {cust.display = cust.name + " | " + cust.phone;})
  }catch (e) {
    ipcRenderer.send("errorMessage", e.message)
  }
} // ./get all customers
getCustomers();


//Add to cart
  watch(selectedProduct, (value, oldValue) => {
    resetPayment();
    if (value) {
       store.dispatch("cartModule/addToCart", value)
        selectedProduct.value = null;
    }
  })


//Increment cart item
const increment = (id) => {
  store.dispatch("cartModule/increment", id);
  resetPayment();
}

  //Decrement cart item
const decrement = (id) => {
  store.dispatch("cartModule/decrement", id);
  resetPayment();
}

//Remove from cart
const removeFromCart = (id) => {
  store.dispatch("cartModule/removeFromCart", id);
  resetPayment();
}


const cart = computed(() => store.getters["cartModule/cart"]); //Cart array
const subTotal = computed(() => store.getters["cartModule/subTotal"]); //get cart subTotal
const totalTax = computed(() => store.getters["cartModule/totalTax"]); //get total Tax
const total = computed(() => store.getters["cartModule/total"]); //get cart total
const totalDiscount = computed(() => store.getters["cartModule/totalDiscount"]); //get total discount

const clearCart = () => store.dispatch('cartModule/clearCart'); //Clear cart

//Put on hold
const putOnHold = () => store.dispatch("cartModule/putOnHold", '');


         //............................EDITING DISCOUNT AND PRICE....................................
//Edit cart Item
const edit = () => {
  store.dispatch("cartModule/edit", editData)
  dialog.value.close();
}

//Open edit dialog
const openDialog = (item) => {
  editData.id = item.id;
  editData.qty = item.qty;
  editData.sellingPrice = item.sellingPrice;
  editData.originalPrice = item.originalPrice;
  editData.discount = item.discount;
  editData.discountInPercentage = (100 * parseFloat(item.discount)) / parseFloat(item.sellingPrice); // calculate percentage
  dialog.value.showModal();
  resetPayment();
}

// calculate discount
const calculateDiscount = () => {
  editData.sellingPrice = parseFloat(editData.sellingPrice) || 0;
  editData.discountInPercentage = parseFloat(editData.discountInPercentage) || 0;
  if (editData.discount) editData.discountInPercentage = (100 * parseFloat(editData.discount)) / editData.sellingPrice;
  else editData.discountInPercentage = 0;
}

//calculate discount in Percentage
const calculateDiscountInPercentage = () => {
  editData.sellingPrice = parseFloat(editData.sellingPrice) || 0;
  editData.discount = parseFloat(editData.discount) || 0;
  if (editData.discountInPercentage) editData.discount = (parseFloat(editData.discountInPercentage) / 100) * editData.sellingPrice;
  else editData.discount = 0;

}


//If discount changes, update discountInPercentage
watch(
() => editData.discount, (value) => {
  //if this field has the focus element
      if(discountInput.value === document.activeElement)  calculateDiscount();
    }
)
//If discountInPercentage changes, update discount
watch(
() => editData.discountInPercentage, (value) => {
      if(discountInPercentageInput.value === document.activeElement) calculateDiscountInPercentage();
    }
)




                      // ........................PAYMENT SECTION...............................

const cash = ref(0);
const momo = ref(0);
const cashRef = ref(null);
const momoRef = ref(null);
let tendered = computed(() => store.getters["cartModule/cashTendered"]);
const change = ref(0);


//calculate change by cash
const calculateChangeByCash = () => {
  momo.value = parseFloat(momo.value) || 0;
  if (cash.value) store.dispatch("cartModule/setCashTendered", parseFloat(cash.value) + parseFloat(momo.value))
  else store.dispatch("cartModule/setCashTendered", parseFloat(momo.value))
  change.value =  parseFloat(tendered.value) - parseFloat(total.value);

}

//calculate change by momo
const calculateChangeByMomo = () => {
  cash.value = parseFloat(cash.value) || 0;
  if (momo.value) store.dispatch("cartModule/setCashTendered", parseFloat(cash.value) + parseFloat(momo.value))
  else store.dispatch("cartModule/setCashTendered", parseFloat(cash.value))
  change.value =  parseFloat(tendered.value) - parseFloat(total.value);
}

//Watch cash
watch(cash, (value) => {
      if(cashRef.value === document.activeElement) {
        if (cash.value > -1) calculateChangeByCash()
      }
    }
)

//Watch Momo
watch(momo, (value) => {
      if(momoRef.value === document.activeElement) {
        if (momo.value > -1) calculateChangeByMomo()
      }
    }
)

//Reset payment form
const resetPayment = () => {
  store.dispatch("cartModule/setCashTendered", 0);
  cash.value = 0;
  change.value = 0;
  momo.value = 0;
}
resetPayment();





                        //.........................Checkout...........................

const checkout = async (e) => {
  e.target.submitBtn.disabled = true;
  const receipt = document.querySelector("#printTable");
  const date = new Date();
  const user = computed(() => store.getters.user);
  const customerId = selectedCustomer.value ? selectedCustomer.value.id : '';
  const getTax = computed(() => store.getters["cartModule/getTax"]);

  //Map cart and calculate individual tax and total
  cart.value.map(p => {
    if (p.tax === 'tax'){
        let tax = parseFloat(getTax.value) / 100;
        let price = parseFloat(p.sellingPrice);
        let qty = parseInt(p.qty);
        p.salesTax = (price * qty) * tax;
    }
    p.total = (parseFloat(p.sellingPrice) * parseInt(p.qty)) - parseFloat(p.discount);
  })

  try {

       await db.transaction( async trx => {

         const order = await trx('orders').insert({ //Save to orders table
           orderDate: date,
           numberOfItems: cart.value.length,
           momo: momo.value || 0,
           total: total.value,
           tendered: tendered.value,
           discount: totalDiscount.value,
           tax: totalTax.value,
           customerId: customerId,
           userId: user.value.id
         })


         const orderDetailsArray = [];      //prepare for batch insert into order details
         for (const item of cart.value) {
           orderDetailsArray.push({
             productId: item.id,
             quantity: item.qty,
             buyingPrice: item.buyingPrice,
             originalPrice: item.originalPrice,
             sellingPrice: item.sellingPrice,
             total: item.total,
             tax: item.salesTax,
             discount: item.discount,
             date: date,
             categoryId: item.categoryId,
             orderId: order
           })
         }
                //Batch Insert into order details table
         await trx.batchInsert('orderDetails', orderDetailsArray, 30);

         //Deduct quantity from products table
         for (const item of cart.value) {
           await trx('products').where('id', '=', item.id ).first().decrement({quantity: parseInt(item.qty)})
         }

         barcode.value = order[0]; //Set barcode number for invoice printing
       })

    //Clear cart and reset payment form
    clearCart();
    resetPayment();

     // Initialize barcode
    JsBarcode("#barcode", barcode.value, {
      height: 30,
      fontSize: 13,
      fontOptions: 'bold'
    })
    printTiny(receipt, {scanStyles: false, scanHTML: true});

    selectedCustomer.value = null; //clear selected customer

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }

}

</script>

<style scoped>
.v-select{
  background: #e7e6e6;
}
.v1{
  background: #fff;
}

.blink{
  animation: blink 1s infinite;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}


</style>