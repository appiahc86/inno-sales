<template>

  <div class="container-fluid">
    <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow"></span></h5>
    <h4 class="text-center" v-else>Recent Sales Receipts</h4>
    <div class="row">
      <div class="col">
        <DataTable
            :value="orders" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
            filterDisplay="menu" :rows="10" v-model:filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['id', 'phone', 'address', 'contactPerson']" responsiveLayout="scroll"
        >
          <template #header>
            <div class="d-flex justify-content-center align-items-center" style="height: 15px">
              <h5 class="px-3">Sales History</h5>
              <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" style="height: 30px"/>
                    </span>
            </div>
          </template>
          <template #empty>
            No record found.
          </template>

          <Column field="orderDate" header="Date" sortable class="data-table-font-size">
           <template #body="{data}">
             <td>{{ new Date(data.orderDate).toLocaleDateString() }}</td>
           </template>
          </Column>
          <Column field="id" header="Receipt#" sortable  class="data-table-font-size"></Column>
          <Column field="firstName" header="Cashier" sortable class="data-table-font-size"></Column>
          <Column field="numberOfItems" header="No. Of Items" sortable class="data-table-font-size"></Column>
          <Column field="total" header="Total" sortable class="data-table-font-size">
            <template #body="{data}">
              <td>{{ formatNumber(data.total) }}</td>
            </template>
          </Column>

          <Column header="View Details" headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible" class="data-table-font-size">
            <template #body="{data}">
              <span type="button" title="View Details" @click="showDetails(data.id)" class="pi pi-eye-slash"></span>
            </template>
          </Column>
        </DataTable>

      </div>
    </div>
  </div>

      <!-- Details dialog -->
  <dialog ref="dialog" style="min-width: 500px; border: 2px solid #ccc;">
    <button class="text-white bg-danger" style="float: right;" @click="closeDialog">X</button><br>

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="table-responsive" v-if="details.length" style="height: 200px;">
            <table class="table table-sm table-borderless table-striped">
              <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Ext Price</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="item in details" :key="item.id">
                <tr>
                  <td>{{ item.productName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatNumber(item.sellingPrice) }}</td>
                  <td>{{ formatNumber(item.extPrice) }}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
      <div class="mt-2" v-if="details.length">
        <div class="float-end">Subtotal: <b>{{ formatNumber(parseFloat(subtotal)) }}</b></div> <br>
        <template v-if="details[0].tax"><div class="float-end" >Tax: <b>{{ formatNumber(parseFloat(details[0].tax)) }}</b>
        </div> <br></template>
        <template v-if="details[0].discount"><div class="float-end">
          Discount: <b>{{ formatNumber(parseFloat(details[0].discount)) }}</b> </div> <br></template>
        <div class="float-end">Amount Tendered: <b>{{ formatNumber(parseFloat(details[0].tendered)) }}</b></div><br>
        <div class="float-end">Change Given: <b>{{ formatNumber(parseFloat(details[0].tendered -details[0].total)) }}</b>
        </div> <br>
      </div>
          <br>
          <h5>Total : <span class="text-danger">{{ details.length ? formatNumber(details[0].total) : 0 }}</span></h5>
          <div class="text-center py-1">
            <button class="fw-bold btn-secondary" @click="reprint(details.length ? details[0].id : '')">
              <span class="pi pi-print"></span>
              Reprint</button>
          </div>

        </div>
      </div>
    </div>
  </dialog>



  <!-- Print table  -->
  <template>
    <div id="printTable" v-if="details.length">
      <div>
        <div class="mt-0" style="font-size: 11px;">
          <span>{{ new Date(details[0].orderDate).toLocaleDateString() }}</span>
          <b style="float: right;">Receipt #{{ details[0].id }}</b>
        </div>
        <div  style="font-size: 12px;">Store: {{ companySettings.storeName }}</div>

        <div style="text-align: center;">
          <div style="font-size: 13px"><b>{{ companySettings.companyName }}</b></div>
          <div style="font-size: 11px">{{ companySettings.contact }}</div>
        </div>


        <template v-if="details[0].customerName">
          <div style="font-size: 12px"><br>
            <span><b>Bill To: </b></span> <span>{{ details[0].customerName }}</span>
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
          <template v-for="item in details">
            <tr style="text-align: left;">
              <td>{{ item.productName }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatNumber(item.sellingPrice) }}</td>
              <td>{{ formatNumber(item.extPrice) }}</td>
            </tr>
          </template>
          </tbody>
        </table>
        <hr>

        <div style="font-size: 12px !important">
          <div style="float: right;">Subtotal: GHS {{ formatNumber(subtotal) }}</div> <br>
          <template v-if="details[0].tax">
            <div style="float: right;">Tax: GHS {{ formatNumber(details[0].tax) }}</div> <br>
          </template>
          <template v-if="details[0].discount">
            <div style="float: right;">Discount: GHS {{ formatNumber(details[0].discount) }}</div> <br>
          </template>
          <div style="float: right;"><b>RECEIPT TOTAL: GHS {{ formatNumber(details[0].total) }}</b></div>
        </div><br>


        <div style="font-size: 12px;">Amount Tendered: GHS {{ formatNumber(details[0].tendered) }}</div>
        <div style="font-size: 12px;">Change Given: GHS {{ formatNumber(details[0].tendered - details[0].total) }}</div>

        <p style="font-size: 11px; text-align: center;">Thanks for shopping with us!</p>

        <div  style="text-align: center">
          <svg id="barcode"></svg>
        </div>

        <div style="font-size: 11px; text-align: center;">
          Software by <span class="fw-bold mt-2">Appiah</span> 0242740320</div>

      </div>
    </div>
  </template>


</template>

<script setup>

import {computed, ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const loading = ref(false);
const orders = ref([]);
const details = ref([]);
const dialog = ref(null);
const store = useStore();

const companySettings = computed(() => store.getters.setting);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


      //............. Get all orders.........
const getOrders = async () => {

  try {
    loading.value = true;

    orders.value = await db('orders')
        .leftJoin('users', 'orders.userId', '=', 'users.id')
        .select('orders.id', 'orders.orderDate', 'users.firstName',
            'orders.numberOfItems', 'orders.total')
        .where('type', 'sale')
        .orderBy('orders.id', 'DESC')
        .limit(150)
  }catch (e) { ipcRenderer.send('errorMessage', e.message); }
  finally {
    loading.value = false;
  }
} // ./get all Orders
getOrders();


        //...............Show details..................
const showDetails = async (orderId) => {
  try {
    details.value = [];
    details.value = await db('orders')
        .innerJoin('orderDetails', 'orders.id', '=','orderDetails.orderId')
        .leftJoin('customers', 'customers.id', '=', 'orders.customerId')
        .select('orders.id', 'orders.orderDate', 'orders.total', 'orders.tendered',
        'orders.discount', 'orders.tax', 'orderDetails.productName', 'orderDetails.quantity',
        'orderDetails.sellingPrice', 'orderDetails.total as extPrice', 'customers.name as customerName')
        .where('orders.id', orderId);

    dialog.value.showModal();
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }

}


//Subtotal for invoice printing
const subtotal = computed(() => {
  let subtotal = 0;
  if (details.value.length){
    for (const item of details.value) {
      subtotal = subtotal + (parseFloat(item.sellingPrice) * parseInt(item.quantity));
    }
  }
  return subtotal;
})

//Close dialog
const closeDialog = () => {
  dialog.value.close();
}


//Reprint receipt
const reprint = async (receiptNumber) => {
  const receipt = document.querySelector("#printTable");

  // Initialize barcode
  JsBarcode("#barcode", receiptNumber, {
    height: 30,
    fontSize: 13,
    fontOptions: 'bold'
  })

  await printTiny(receipt, {scanStyles: false, scanHTML: true});
  console.clear();
}

</script>

<style scoped>

</style>