<template>
  <div class="container-fluid mt-4">
    <div class="row">

      <h4 class="text-center mt-3 text-secondary mb-3 text-uppercase" style="letter-spacing: 14px; word-spacing: 10px">
        <b>Wholesale</b>
      </h4>

      <!--   CART -->
      <div class="col-8">
        <div class="card shadow p-2" style="height: 500px; background: #cfdddb">
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
            <table class="table table-sm mt-2 table-hover table-borderless table-striped">
              <thead style="border-bottom: 1px solid #ccc;  background: linear-gradient(45deg, #c498e5, white, #ee8e8e ) !important;">
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
            <h5><span class="text-danger fw-bold">Amount Due: </span>GH¢ {{ formatNumber(total) }}</h5>
          </div>

          <div class="container" v-if="cart.length">
            <div class="row">
              <div class="col">
                <button class="btn-info text-white" @click="putOnHold"><b>Put On Hold</b></button>
              </div>
              <div class="col">
                <button class="btn-warning float-end" @click="clearCart"><b>Clear Cart</b></button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!--  checkout  -->
      <div class="col-4">
        <div class="card shadow-lg p-1" style="background: #dce6e5;">

          <!--       Type of sales ie Cash / Credit-->
          <h6 class="text-center fw-bold my-2">Type Of Sale</h6>
          <div class="d-inline-flex fw-bold align-content-center">
            <label>
              <input type="radio" id="cash" value="cash" v-model="typeOfSale" class="p-radiobutton">
              Cash
            </label>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <label>
              <input type="radio" id="credit" value="credit" v-model="typeOfSale" class="p-radiobutton">
              Credit
            </label>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <label>
              <input type="radio" id="credit" value="proforma" v-model="typeOfSale" class="p-radiobutton">
              Proforma
            </label>
          </div>
          <hr>


          <div class="card-body">

            <!--     If cash Sale  -->
            <div class="" v-if="typeOfSale === 'cash'">
              <h5 class="text-center fw-bold blink text-danger mt-1" v-if="tendered < total">Awaiting Payment</h5>
              <!--         <h5 class="mt-1 invisible" v-else>.</h5>-->

              <form @submit.prevent="checkout">
                <div class="d-flex">
                  <h6 class="w-50">Cash</h6>
                  <h6 class="w-50">MoMo</h6>
                </div>
                <div class="d-flex">
                  <input type="number" class="form-control-dark w-50" oninput="validity.valid||(value = 0);"
                         step="any" v-model="cash" min="0" ref="cashRef"> &nbsp;
                  <input type="number" class="form-control-dark w-50" oninput="validity.valid||(value = 0);"
                         step="any" v-model="momo" min="0" ref="momoRef">
                </div>

                <div class="mt-3" v-if="momo">
                  <h6 class="text-center">Momo Type</h6>
                  <label><input type="radio" id="mtn" value="mtn" v-model="momoType" class="p-radiobutton"> MTN</label>
                  &nbsp; &nbsp;
                  <label><input type="radio" id="vodafone" value="vodafone" v-model="momoType" class="p-radiobutton"> Vodafone</label>
                  &nbsp; &nbsp;
                  <label><input type="radio" id="airtelTigo" value="airtelTigo" v-model="momoType" class="p-radiobutton"> AirtelTigo</label>
                </div>

                <h6 class="mt-4 fw-bold">Tendered: {{ formatNumber(tendered) }}</h6>
                <h5 class="mt-2 fw-bold text-primary">Change: {{ formatNumber(change) }}</h5><br>
                <label>
                  <input type="checkbox" class="p-checkbox" v-model="printReceipt">
                  &nbsp; <b>Print Receipt</b>
                </label>
                <button class="float-end" name="submitBtn" style="width: 80px;" type="submit" :disabled="tendered < total || total === 0">
                  <span class="pi pi-print"></span> Save</button>
              </form>

            </div>
            <!--     ./ If cash Sale  -->


            <!--         If Credit Sale-->
            <div class="" v-else-if="typeOfSale === 'credit'">
              <form @submit.prevent="checkout">

                <v-select :options="customers" label="display" v-model="selectedCustomer"
                          placeholder="Select Customer" class="v-select mb-3" v-if="typeOfSale === 'credit'">
                </v-select>
                <div class="d-flex">
                  <h6 class="w-50">Invoice Date<span class="text-danger">*</span></h6>
                  <h6 class="w-50">Due Date<span class="text-danger">*</span></h6>
                </div>
                <div class="d-flex mb-4">
                  <input type="date" class="form-control-dark w-50" v-model="invoiceDate" required> &nbsp;
                  <input type="date" class="form-control-dark w-50" v-model="dueDate" required>
                </div>
                <div class="">
                  <label class="fw-bold">Invoice Number</label> <br>
                  <input type="text" v-model.trim="invoiceNumber" class="form-control-dark w-50" required>
                </div>
                <br>

                <label>
                  <input type="checkbox" class="p-checkbox" v-model="printReceipt">
                  &nbsp; <b>Print Invoice</b>
                </label>
                <button class="float-end" name="submitBtn" style="width: 80px;" type="submit"
                        :disabled="!selectedCustomer || !total">
                  <span class="pi pi-print"></span> Save</button>
              </form>
            </div>
            <!--        ./ If Credit Sale-->


            <!--         If proforma-->
            <div class="" v-else>
              <form @submit.prevent="checkout">

                <v-select :options="customers" label="display" v-model="selectedCustomer"
                          placeholder="Select Customer" class="v-select mb-3" v-if="typeOfSale === 'credit'">
                </v-select>
                <div class="d-flex">
                  <h6 class="w-50">Invoice Date<span class="text-danger">*</span></h6>
                  <h6 class="w-50">Due Date<span class="text-danger">*</span></h6>
                </div>
                <div class="d-flex mb-4">
                  <input type="date" class="form-control-dark w-50" v-model="proformaData.invoiceDate" required> &nbsp;
                  <input type="date" class="form-control-dark w-50" v-model="proformaData.dueDate" required>
                </div>

                <h6 class="text-center fw-bold">BILL TO</h6>

                <div class="">
                  <label class="fw-bold">Name</label> <br>
                  <input type="text" v-model.trim="proformaData.name" class="form-control-dark w-100" required>
                  <br><br>

                  <label class="fw-bold">Address</label> <br>
                  <input type="text" v-model.trim="proformaData.address" class="form-control-dark w-100">
                  <br><br>

                  <label class="fw-bold">Phone</label> <br>
                  <input type="text" v-model.trim="proformaData.phone" class="form-control-dark w-50">

                </div>
                <br>

                <button class="float-end" name="submitBtn" style="width: 80px;" type="submit"
                        :disabled="!total">
                  <span class="pi pi-print"></span> Print</button>
              </form>
            </div>
            <!-- ./ If proforma-->

          </div>

        </div>

        <div class="card mt-5" v-if="selectedCustomer">
          <h5><b>Bill To: </b> <span class="text-black-50">{{ selectedCustomer.name }}</span></h5>
          <h6><b>Phone: </b> <span class="text-black-50">{{ selectedCustomer.phone }}</span></h6>
          <h6><b>Invoice Date: </b>
            <span class="text-black-50">{{ invoiceDate ? moment(invoiceDate).format('YYYY-MM-DD') : '' }}</span>
          </h6>
          <h6><b>Due Date: </b>
            <span class="text-black-50">{{ dueDate ? moment(dueDate).format('YYYY-MM-DD') : '' }}</span>
          </h6>

        </div>

      </div>


      <template>
        <PrintReceiptRoll :tendered="tendered" :change="change" :barcode="barcode"  :wholesale="true" />
        <PrintReceiptA4  :tendered="tendered" :change="change" :barcode="barcode" :wholesale="true" />

        <ProformaRoll :phone="proformaData.phone" :wholesale="true"
                      :address="proformaData.address" :name="proformaData.name"
                      :due-date="proformaData.dueDate" :invoice-date="proformaData.invoiceDate" />
        <ProformaA4  :phone="proformaData.phone" :wholesale="true"
                     :address="proformaData.address" :name="proformaData.name"
                     :due-date="proformaData.dueDate" :invoice-date="proformaData.invoiceDate" />

        <PrintInvoiceA4 :name="selectedCustomer?.name || ''" :address="selectedCustomer?.address || ''"
                        :phone="selectedCustomer?.phone || ''" :invoice-date="invoiceDate || ''"
                        :dueDate="dueDate || ''" :invoice-number="invoiceNumber || ''" :wholesale="true" />


        <PrintInvoiceRoll :name="selectedCustomer?.name || ''" :address="selectedCustomer?.address || ''"
                          :phone="selectedCustomer?.phone || ''" :invoice-date="invoiceDate || ''"
                          :dueDate="dueDate || ''" :invoice-number="invoiceNumber || ''" :wholesale="true" />

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
            <input type="number" class="form-control-dark" min="0" step="0.01"
                   v-model="editData.sellingPrice" :disabled="user && !user.changePrice">
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
            <input type="number" ref="discountInput" class="form-control-dark" min="0" step="any"
                   v-model.number="editData.discount" :disabled="user && !user.giveDiscount">
          </div>
          <div class="col">
            <input type="number" ref="discountInPercentageInput" class="form-control-dark" min="0" max="100"
                   step="any" v-model.number="editData.discountInPercentage" :disabled="user && !user.giveDiscount">
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
import {ref, watch, computed, reactive, onMounted} from "vue";
import db from "@/dbConfig/db";
import 'vue-select/dist/vue-select.css'
import { useStore } from "vuex";
import { formatNumber } from "@/functions";
import moment from "moment";
import PrintReceiptRoll from "@/components/paperRoll/PrintReceiptRoll.vue";
import PrintReceiptA4 from "@/components/a4/PrintReceiptA4.vue";
import ProformaRoll from "@/components/paperRoll/ProformaRoll.vue";
import ProformaA4 from "@/components/a4/ProformaA4.vue";
import PrintInvoiceA4 from "@/components/a4/PrintInvoiceA4.vue";
import PrintInvoiceRoll from "@/components/paperRoll/PrintInvoiceRoll.vue";

const store = useStore();
const selectedProduct = ref(null);
const selectedCustomer = ref(null);
const products = ref([]);
const customers = ref([]);
const dialog = ref(null);
const barcode = ref(1); //For barcode
const loading = ref(false);
const typeOfSale = ref("cash");
const invoiceDate = ref(null);
const invoiceNumber = ref(null);
const dueDate = ref(null);
const printReceipt = ref(true);
const companySettings = computed(() => store.getters.setting); //get company settings
const user = computed(() => store.getters.user); //Get loggedIn user
const proformaData = reactive({
  name: "",
  address: "",
  phone: "",
  invoiceDate: "",
  dueDate: ""
})

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
            'products.sellingPrice as fallBackPrice',
            'products.wholesalePrice as sellingPrice',
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

      if (p.sellingPrice <= 0){
        p.originalPrice = p.fallBackPrice;
        p.sellingPrice = p.fallBackPrice;
        p.display = p.productName + " " + " ---->"  + " price = " + formatNumber(p.fallBackPrice);
      }

    })

    loading.value = false;

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
}
getAllProducts();


//.............Get all Customers .........................
const getCustomers = async () => {
  try {
    customers.value = await db('customers')
        .where('id', '!=', '1')
        .select('id', 'name', 'phone', 'address');
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
    store.dispatch("wholesaleCartModule/addToCart", value)
    selectedProduct.value = null;
  }
})


//Increment cart item
const increment = (id) => {
  store.dispatch("wholesaleCartModule/increment", id);
  resetPayment();
}

//Decrement cart item
const decrement = (id) => {
  store.dispatch("wholesaleCartModule/decrement", id);
  resetPayment();
}

//Remove from cart
const removeFromCart = (id) => {
  store.dispatch("wholesaleCartModule/removeFromCart", id);
  resetPayment();
}


const cart = computed(() => store.getters["wholesaleCartModule/cart"]); //Cart array
const subTotal = computed(() => store.getters["wholesaleCartModule/subTotal"]); //get cart subTotal
const totalTax = computed(() => store.getters["wholesaleCartModule/totalTax"]); //get total Tax
const total = computed(() => store.getters["wholesaleCartModule/total"]); //get cart total
const totalDiscount = computed(() => store.getters["wholesaleCartModule/totalDiscount"]); //get total discount
const cartProfit = computed(() => store.getters["wholesaleCartModule/getProfit"]); //get cart Profit

const clearCart = () => {
  store.dispatch('wholesaleCartModule/clearCart');
  resetPayment();
}; //Clear cart

//Put on hold
const putOnHold = () => store.dispatch("wholesaleCartModule/putOnHold", '');


//............................EDITING DISCOUNT AND PRICE....................................
//Edit cart Item
const edit = () => {
  store.dispatch("wholesaleCartModule/edit", editData)
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
const momoType = ref('mtn');
const cashRef = ref(null);
const momoRef = ref(null);
let tendered = computed(() => store.getters["wholesaleCartModule/cashTendered"]);
const change = ref(0);


//watch total and update cash input field
watch(() => total.value, (value, oldValue) => {
  cash.value = value;
  store.dispatch("wholesaleCartModule/setCashTendered", parseFloat(value));
})

//set cash input to total on mounted
onMounted(() => {
  cash.value = total.value;
  store.dispatch("wholesaleCartModule/setCashTendered", parseFloat(total.value));
})

//calculate change by cash
const calculateChangeByCash = () => {
  momo.value = parseFloat(momo.value) || 0;
  if (cash.value) store.dispatch("wholesaleCartModule/setCashTendered", parseFloat(cash.value) + parseFloat(momo.value))
  else store.dispatch("wholesaleCartModule/setCashTendered", parseFloat(momo.value))
  change.value =  parseFloat(tendered.value) - parseFloat(total.value);

}

//calculate change by momo
const calculateChangeByMomo = () => {
  cash.value = parseFloat(cash.value) || 0;
  if (momo.value) store.dispatch("wholesaleCartModule/setCashTendered", parseFloat(cash.value) + parseFloat(momo.value))
  else store.dispatch("wholesaleCartModule/setCashTendered", parseFloat(cash.value))
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
  change.value = 0;
  momo.value = 0;
}
resetPayment();




//.........................Checkout...........................

const checkout = async (e) => {
  e.target.submitBtn.disabled = true;
  //  Print paper types
  const receiptRoll = document.querySelector("#receipt-roll");
  const receiptA4 = document.querySelector("#receipt-a4");
  const invoiceRoll = document.querySelector("#invoice-roll");
  const invoiceA4 = document.querySelector("#invoice-a4");
  const proformaRoll = document.querySelector("#proforma-roll");
  const proformaA4 = document.querySelector("#proforma-a4");


  const customerId = selectedCustomer?.value ? selectedCustomer.value.id : null;
  const getTax = computed(() => store.getters["wholesaleCartModule/getTax"]);


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


    //If proforma
    if (typeOfSale.value === "proforma"){

      if (companySettings.value.paperType === 'roll'){
        printTiny(proformaRoll, {scanStyles: false, scanHTML: true});
      }else  printTiny(proformaA4, {scanStyles: false, scanHTML: true});

      clearCart();
      resetPayment();

      proformaData.address = "";
      proformaData.name = "";
      proformaData.invoiceDate = "";
      proformaData.dueDate = "";
      proformaData.invoiceNumber = "";
      proformaData.phone = "";

      printReceipt.value = true;
      selectedCustomer.value = null; //clear selected customer
      invoiceDate.value = null;
      dueDate.value = null;
      invoiceNumber.value = null;

      return console.clear();
    }



    await db.transaction( async trx => {

      let order;

      if (typeOfSale.value === 'cash'){ //If cash sale
        order = await trx('orders').insert({ //Save to Orders table
          numberOfItems: cart.value.length,
          momo: momo.value || 0,
          orderDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          momoType: momo.value ? momoType.value : '',
          total: total.value,
          tendered: tendered.value,
          invoiceNumber: moment().format('YYYYMMDDHHssSSS'),
          discount: totalDiscount.value,
          tax: totalTax.value,
          customerId: 1,
          userId: user.value.id
        })
        barcode.value = await order[0];
      }else if (typeOfSale.value === 'credit') {  // If credit sale

        //Check iF a customer is selected
        if (!customerId && typeOfSale.value === "credit"){
          e.target.submitBtn.disabled = false;
          return ipcRenderer.send('errorMessage', 'Please Select a Customer' )
        }

        order = await trx('orders').insert({ //Save to Orders table
          numberOfItems: cart.value.length,
          momo: 0,
          orderDate: moment(invoiceDate.value).format('YYYY-MM-DD hh:mm:ss'), //
          momoType: '',
          total: total.value,
          tendered: 0,
          saleType: "credit", //
          isPaid: false, //
          invoiceNumber: invoiceNumber?.value.toUpperCase(),
          payments: JSON.stringify({dueDate: moment(dueDate.value).format('YYYY-MM-DD hh:mm:ss'), payments: []}),
          discount: totalDiscount.value,
          tax: totalTax.value,
          customerId: customerId,
          userId: user.value.id
        })

        barcode.value = await order[0];

      }


      const orderDetailsArray = [];      //prepare for batch insert into order details
      for (const item of cart.value) {
        orderDetailsArray.push({
          productId: item.id,
          productName: item.productName,
          quantity: item.qty,
          buyingPrice: item.buyingPrice,
          originalPrice: item.originalPrice,
          sellingPrice: item.sellingPrice,
          total: item.sellingPrice * item.qty,
          tax: item.salesTax,
          date: typeOfSale.value === "credit" ? moment(invoiceDate.value).format("YYYY-MM-DD hh:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
          discount: item.discount,
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

      //dispatch quantities to vuex store products
      for (const item of cart.value) {
        store.dispatch("productsModule/modifyQty", {id: item.id, qty: item.qty, type: 'decrement'})
      }

      //insert Profit to profits table
      await trx('profits').insert({
        orderId: order,
        date: typeOfSale.value === "credit" ? moment(invoiceDate.value).format("YYYY-MM-DD hh:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
        profit: cartProfit.value
      })

      if (printReceipt.value){

        // Initialize barcode
        JsBarcode("#barcode", barcode.value, {
          height: 30,
          fontSize: 13,
          fontOptions: 'bold'
        })

        if (companySettings.value.paperType === 'roll'){ // If Paper roll printing
          if (typeOfSale.value === 'cash'){ //for cash sale
            printTiny(receiptRoll, {scanStyles: false, scanHTML: true});
          } else  printTiny(invoiceRoll, {scanStyles: false, scanHTML: true}); //for credit sale

        }

        if (companySettings.value.paperType === 'a4'){ // If A4 printing
          if (typeOfSale.value === 'cash'){  //for cash sale
            printTiny(receiptA4, {scanStyles: false, scanHTML: true});
          } else  printTiny(invoiceA4, {scanStyles: false, scanHTML: true}); //for credit sale
        }

        console.clear();

      }

      //Clear cart and reset payment form
      clearCart();
      resetPayment();

      printReceipt.value = true;
      selectedCustomer.value = null; //clear selected customer
      invoiceDate.value = null;
      dueDate.value = null;
      invoiceNumber.value = null;

    })// End of Transaction



  }catch (error) {
    if (error.code === "SQLITE_CONSTRAINT"){
      e.target.submitBtn.disabled = false;
      return ipcRenderer.send('errorMessage', 'Invoice Number Already Exists');
    }

    ipcRenderer.send('errorMessage', error.code);
  }

}

</script>

<style scoped>
.v-select{
  background: #e7e6e6;
}

</style>