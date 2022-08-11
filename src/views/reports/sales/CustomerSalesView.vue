
<template>
  <div class="container-fluid">
    <div class="row justify-content-center mb-4">
      <div class="col-12">

              <form @submit.prevent="search">
                <h5 class="text-center"><b>Customer Sales Report</b></h5>
                <div class="input-group">

                    <v-select :options="customers" label="display" v-model="formData.selectedCustomer" placeholder="Select Customer"
                              class="v-select form-control form-control-dark" style="width: 30%;">
                    </v-select>


                  <div class="input-group-text bg-dark text-white"><b>From</b></div>
                  <input type="date" class="form-control form-control-dark" v-model="formData.from" onkeydown="return false">
                  <div class="input-group-text bg-dark text-white"><b>To</b></div>
                  <input type="date" class=" form-control form-control-dark" v-model="formData.to" onkeydown="return false" >
                  <button class="bg-primary text-white px-3" title="Search" name="submitBtn" style="border: none;">
                    <span class="spinner-border" v-if="loading"></span>
                    <span class="pi pi-search" v-else></span>
                  </button>
                </div>
              </form>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <!--   Table     -->

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <h5 v-if="customerName">Customer: <b> {{ customerName }}</b></h5>
        <h6>{{ message }}</h6>
        <div class="table-responsive">

          <DataTable
              :value="records" :paginator="true"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10, 15, 25]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" responsiveLayout="scroll"
          >
            <template #empty>
              No record found.
            </template>
            <Column field="id" header="Receipt#" sortable class="data-table-font-size"></Column>

            <Column field="orderDate" header="Date" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.orderDate).toLocaleDateString() }}</td>
              </template>
            </Column>


            <Column field="numberOfItems" header="Number Of Items" sortable class="data-table-font-size"></Column>

            <Column field="discount" header="Discount" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.discount)) }}</td>
              </template>
            </Column>

            <Column field="tax" header="Tax" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.tax)) }}</td>
              </template>
            </Column>

            <Column field="total" header="Total" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.total)) }}</td>
              </template>
            </Column>
          </DataTable>
        </div>
        <h5 class="mt-2" v-if="records.length">Total: GH¢ {{ formatNumber(parseFloat(recordTotal)) }}</h5>




        <!--  Print table -->
        <template>
          <div class="" v-if="records.length">

            <div id="printOut">
              <h4 style="text-align: center;" v-if="settings.companyName">{{ settings.companyName }}</h4>

              <p style="font-size: 0.85em;">
                <span>Customer: <b> {{ customerName }}</b></span><br>
                <span>{{ message }}</span>
              </p>

              <table id="print-table">
                <tr>
                  <th>Receipt#</th>
                  <th>Date</th>
                  <th>Number Of Items</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>

                <template v-for="record in records" :key="record.id">
                  <tr>
                    <td>&nbsp; {{ record.id }}</td>
                    <td>&nbsp; {{ new Date(record.orderDate).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ record.numberOfItems }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.discount)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.tax)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.total)) }}</td>
                  </tr>
                </template>

              </table>
              <div style="margin-top: 0;"><h5>Total: GH¢ {{ formatNumber(parseFloat(recordTotal)) }}</h5></div>
            </div>

          </div>
        </template>



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
    customers.value = await db.select().from('customers');
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

  const dateFrom = new Date(formData.from).setHours(0,0,0,0);
  const dateTo = new Date(formData.to).setHours(0,0,0,0);
  if (dateFrom > dateTo) return ipcRenderer.send('errorMessage', 'Sorry, (Date from) cannot be greater than (Date to)');
  message.value = null;
  customerName.value = null;

  try {
    e.target.submitBtn.disabled = true;

    records.value = await db('orders')
        .where('customerId', formData.selectedCustomer.id)
        .andWhereRaw("?? >= ?", ['orderDate', dateFrom])
        .andWhereRaw("?? <= ?", ['orderDate', dateTo])

    if (dateFrom === dateTo) message.value = `Sales Report On ${new Date(dateFrom).toDateString()}`;
    else message.value = `Sales Report From ${new Date(dateFrom).toLocaleDateString()} To ${new Date(dateTo).toLocaleDateString()}`;

    customerName.value = formData.selectedCustomer.name;
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
#print-table{
  font-size: 0.85em;
  width: 100%;
  border-collapse: collapse;
}
#print-table th, #print-table td{
  border: 1px solid black;
}
</style>