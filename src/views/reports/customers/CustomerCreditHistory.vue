
<template>
  <div class="container-fluid">
    <div class="row justify-content-center mb-4">
      <div class="col-12">

              <form @submit.prevent="search">
                <h5 class="text-center"><b>Customer Credit History</b></h5>
                <div class="input-group">

                    <v-select :options="customers" label="display" v-model="formData.selectedCustomer" placeholder="Select Customer"
                              class="v-select form-control form-control-dark" style="width: 30%;">
                    </v-select>


                  <div class="input-group-text bg-dark text-white"><b>From</b></div>
                  <input type="date" class="form-control form-control-dark" v-model="formData.from" onkeydown="return false">
                  <div class="input-group-text bg-dark text-white"><b>To</b></div>
                  <input type="date" class=" form-control form-control-dark" v-model="formData.to" onkeydown="return false" >
                  <button class="bg-primary text-white px-3" title="Search" name="submitBtn" style="border: none;">
                    <span class="spinner-border spinner-border-sm" v-if="loading"></span>
                    <span class="pi pi-search" v-else></span>
                  </button>
                </div>
              </form>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <template v-if="records.length">

          <!--   Table     -->

          <button class="p-1 fw-bold bg-secondary text-white" @click="printReport">
            <span class="pi pi-print"></span> Print</button>
          <h5 v-if="customerName">
            Customer: <b> {{ customerName }}</b><br>
            Contact: <b>{{ customerContact }}</b>
          </h5>
          <h6>{{ message }}</h6>
          <div class="table-responsive">

            <template v-for="record in records" :key="record.id">
              <div style="border: 1.5px solid darkslategrey; padding: 10px;">

                <div class="">
                  <p>
                    Invoice#: <b>{{ record.invoiceNumber }}</b><br>
                    Invoice Date: {{ new Date(record.orderDate).toLocaleDateString() }}<br>
                    Due Date: {{ new Date(record.payments.dueDate).toLocaleDateString() }}<br>
                    Total: <b>{{ formatNumber(parseFloat(record.total)) }}</b><br>
                    Amount Due: {{ formatNumber( parseFloat(record.total) - parseFloat(record.tendered) )  }}

                  </p>
                </div>

              <table class="table table-striped table-hover">
                <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="data in record.details" :key="record.details.id">
                  <tr>
                    <td>{{ data.productName }}</td>
                    <td>{{ formatNumber(data.price) }}</td>
                    <td>{{ data.quantity }}</td>
                    <td>{{ formatNumber(data.discount) }}</td>
                    <td>{{ formatNumber(data.tax) }}</td>
                    <td>{{ formatNumber(data.total) }}</td>
                  </tr>
                </template>
                </tbody>
              </table>

                <h5>Payments</h5>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>Receipt#</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                  </thead>
                  <tbody>

                  <template v-for="p in record.payments?.payments" :key="p.id">
                    <tr>
                      <td>{{ p.receiptNumber }}</td>
                      <td>{{ new Date(p.date).toLocaleDateString() }}</td>
                      <td>{{ formatNumber(p.amount) }}</td>
                    </tr>
                  </template>

                  </tbody>
                </table>

              </div>
              <br>
<!--              <hr style="border: 1px solid black;" />-->
            </template>


          </div>
        </template>



<!--Print Out-->
        <template>
          <!--   Table     -->

          <div id="printOut">
            <div style="text-align: center;">
              <b>
                {{ settings.companyName }}<br>
                Address: {{ settings.address }}<br>
                Contact: {{ settings.contact }}
              </b>
            </div>

          <h5 v-if="customerName">
            Customer: <b> {{ customerName }}</b><br>
            Contact: <b>{{ customerContact }}</b>
          </h5>
          <h6>{{ message }}</h6>
          <div class="table-responsive">

            <template v-for="record in records" :key="record.id">
              <div style="border: 1.5px solid darkslategrey; padding: 10px;">

                <div class="">
                  <p>
                    Invoice#: <b>{{ record.invoiceNumber }}</b><br>
                    Invoice Date: {{ new Date(record.orderDate).toLocaleDateString() }}<br>
                    Due Date: {{ new Date(record.payments.dueDate).toLocaleDateString() }}<br>
                    Total: <b>{{ formatNumber(parseFloat(record.total)) }}</b><br>
                    Amount Due: {{ formatNumber( parseFloat(record.total) - parseFloat(record.tendered) )  }}

                  </p>
                </div>

                <table class="myTable">
                  <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Total</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="data in record.details" :key="record.details.id">
                    <tr>
                      <td>{{ data.productName }}</td>
                      <td>{{ formatNumber(data.price) }}</td>
                      <td>{{ data.quantity }}</td>
                      <td>{{ formatNumber(data.discount) }}</td>
                      <td>{{ formatNumber(data.tax) }}</td>
                      <td>{{ formatNumber(data.total) }}</td>
                    </tr>
                  </template>
                  </tbody>
                </table>

                <h5>Payments</h5>
                <table class="myTable">
                  <thead>
                  <tr>
                    <th>Receipt#</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                  </thead>
                  <tbody>

                  <template v-for="p in record.payments?.payments" :key="p.id">
                    <tr>
                      <td>{{ p.receiptNumber }}</td>
                      <td>{{ new Date(p.date).toLocaleDateString() }}</td>
                      <td>{{ formatNumber(p.amount) }}</td>
                    </tr>
                  </template>

                  </tbody>
                </table>

              </div>
              <br>

            </template>


          </div>

          </div>
        </template> <!--  ./ Print Out      -->




      </div>
    </div>


  </div>


</template>

<script setup>
import {computed, reactive, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const loading = ref(false);
const message = ref(null);
const customerName = ref(null);
const customerContact = ref(null);
const records = ref([]);
const customers = ref([]);
const store = useStore();

const formData = reactive({
  from: null,
  to: null,
  selectedCustomer: null
})

const settings = computed(() => store.getters.setting)


//.............Get all Customers .........................
const getCustomers = async () => {
  try {
    customers.value = await db.select().from('customers').where('id','<>', 1);
    customers.value.map(cust => {cust.display = cust.name + " | " + cust.phone;})
  }catch (e) {
    ipcRenderer.send("errorMessage", e.message)
  }
} // ./get all customers
getCustomers();


//Reset form data
const resetForm = () => { formData.from = null; formData.to = null; formData.selectedCustomer = null; }



//....................Search.......................
const search = async (e) => {

  // validation
  if (!formData.selectedCustomer) return ipcRenderer.send('errorMessage', 'Please Select Customer');
  if (!formData.from || !formData.to) return ipcRenderer.send('errorMessage', 'Please Select Date');

  if (formData.from > formData.to) return ipcRenderer.send('errorMessage', 'Sorry, (Date from) cannot be greater than (Date to)');
  records.value = [];
  message.value = null;
  customerName.value = null;
  customerContact.value = null;

  try {
    e.target.submitBtn.disabled = true;

    const data = await db('orders')
        .join('orderDetails', 'orders.id', '=', 'orderDetails.orderId')
        .where('orders.customerId', formData.selectedCustomer.id)
        .andWhereRaw('orders.orderDate >= ?', [formData.from + ' 00:00:01'])
        .andWhereRaw('orders.orderDate <= ?', [formData.to + ' 23:59:59'])
        .andWhere('orders.isPaid', false)
        .select('orders.id', 'orders.orderDate', 'orders.total', 'orders.tendered',
            'orders.invoiceNumber', 'orders.payments',' orders.tax', 'orders.discount',
        'orderDetails.productName', 'orderDetails.quantity', 'orderDetails.sellingPrice',
         'orderDetails.total as detailsTotal', 'orderDetails.discount as detailsDiscount',
            'orderDetails.tax as detailsTax', 'orderDetails.id as detailsId');


    let filtered = [];

    if (data.length){
      for (const d of data) {
        let isFound = filtered.find(v => v.id === d.id);
        if (isFound){
          continue;
        }
        filtered.push({
          id: d.id,
          discount: d.discount,
          invoiceNumber: d.invoiceNumber,
          orderDate: d.orderDate,
          payments: JSON.parse(d.payments),
          tendered: d.tendered,
          total: d.total,
          details: []
        })
      }
    }


    if (filtered.length){
      for (const d of data) {
        for (const f of filtered) {
          if (d.id === f.id) {
            f.details.push({
              id: d.detailsId,
              discount: d.detailsDiscount,
              total: d.detailsTotal,
              productName: d.productName,
              quantity: d.quantity,
              price: d.sellingPrice,
              tax: d.detailsTax
            })
          }
        }
      }
    }

    records.value = filtered;
    console.log(filtered)


    if (formData.from === formData.to) message.value = `Sales Report On ${new Date(formData.from).toDateString()}`;
    else message.value = `Credit Report From ${new Date(formData.from).toLocaleDateString()} To ${new Date(formData.to).toLocaleDateString()}`;

    customerName.value = formData.selectedCustomer.name;
    customerContact.value = formData.selectedCustomer?.phone;
    resetForm();

  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
  finally {
    e.target.submitBtn.disabled = false;
    loading.value = false;
  }

}

//Get records total
const recordTotal = computed(() => {
  let total = 0;
  if (records.value.length){
    for (const record of records.value) {
      total += parseFloat(record.total)
    }
  }
  return total;
})

//Print Report
const printReport = () => {
  const printOut = document.querySelector('#printOut');
  printTiny(printOut, {scanStyles: false, scanHTML: true});
  console.clear();
}

</script>

<style scoped>
.myTable{
  font-size: 0.85em;
  width: 100%;
  border-collapse: collapse;
}
.myTable th, .myTable td {
  padding: 5px;
  border: 0.8px solid #978c8c;
}
</style>