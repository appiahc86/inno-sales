
<template>
  <div class="container-fluid">

    <div class="row justify-content-center mb-4">
      <div class="col-12">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-7" style="max-width: 600px">
              <form @submit.prevent="search">
                <h5 class="text-center"><b>Vendor Bills</b></h5>
                <div class="input-group">
                  <v-select :options="vendors" label="company" v-model="selectedVendor" placeholder="Select Vendor"
                            class="v-select form-control form-control-dark" style="width: 30%;">
                  </v-select>
                  <button class="bg-primary text-white px-3" title="Search" name="submitBtn" style="border: none;">
                    <span class="spinner-border" v-if="loading"></span>
                    <span class="pi pi-search" v-else></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="row">
      <div class="col-12">

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <div>
        <h6>{{ message }} <b> {{vendor}}</b></h6>
      </div>

        <div class="table-responsive">
          <!--   Table     -->
          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
              filterDisplay="menu" :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['company', 'invoice', 'total']" responsiveLayout="scroll"
          >

            <template #empty>
              No record found.
            </template>

            <Column field="invoice" header="Invoice#" sortable class="data-table-font-size"></Column>
            <Column field="billDate" header="Bill Date" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.billDate).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="invoiceDue" header="Due Date" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.invoiceDue).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="numberOfItems" header="No. Of Items" sortable  class="data-table-font-size"></Column>
            <Column field="total" header="Total" sortable  class="data-table-font-size">
              <template #body="{data}">
                {{ formatNumber(data.total) }}
              </template>
            </Column>
            <Column header="Amount Due" sortable  class="data-table-font-size">
              <template #body="{data}">
                <b>{{ formatNumber(data.total - (data.totalPaid || 0)) }}</b>
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
                <span>{{ new Date().toDateString() }}</span><br>
                <span class="">{{ message }} <b>{{ vendor }}</b></span>
              </p>
              <table id="print-table">
                <tr>
                  <th>Invoice#</th>
                  <th>Bill Date</th>
                  <th>Due Date</th>
                  <th>No. Of Items</th>
                  <th>Total</th>
                  <th>Amount Due</th>
                </tr>

                <template v-for="record in records" :key="record.id">
                  <tr>
                    <td>&nbsp; {{ record.invoice }}</td>
                    <td>&nbsp; {{ new Date(record.billDate).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ new Date(record.invoiceDue).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ record.numberOfItems }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.total)) }}</td>
                    <td>&nbsp; {{ formatNumber(record.total - (record.totalPaid || 0)) }}</td>
                  </tr>
                </template>

              </table>
              <h5 class="mt-2" v-if="records.length">Total: GH¢ {{ formatNumber(parseFloat(recordTotal)) }}</h5>
            </div>

          </div>
        </template>


      </div>
    </div>
  </div>


</template>

<script setup>
import {computed, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const loading = ref(false)
const records = ref([]);
const vendors = ref([]);
const vendor = ref(null);
const selectedVendor = ref(null);
const message = ref(null);
const store = useStore();

const settings = computed(() => store.getters.setting)


//........................Get all vendors ...........................
const getVendors = async () => {
  try {
    vendors.value = await db('vendors')
        .select('vendors.id', 'vendors.company')
        .orderBy('vendors.company', 'asc');
  }catch (e) { ipcRenderer.send('errorMessage', e.message); }

} // ./get all vendors
getVendors();


const search = async (e) => {
  if (!selectedVendor.value) return ipcRenderer.send('errorMessage', 'Please Select A vendor');
  try {
    e.target.submitBtn.disabled = true;
    loading.value = true;

    records.value = await db('purchases')
        .innerJoin('vendors', 'purchases.vendorId', '=', 'vendors.id')
        .leftJoin('billPayments', 'purchases.id', 'billPayments.purchaseId')
        .select('purchases.id','purchases.billDate', 'purchases.invoiceDue','purchases.numberOfItems',
            'purchases.invoice', 'purchases.total', 'vendors.company')
        .sum('billPayments.amount as totalPaid')
        .where('purchases.status', 'received')
        .andWhere('vendors.id', selectedVendor.value.id)
        .havingRaw('?? > ?', ['purchases.total',  db.raw('coalesce(sum(billPayments.amount), 0)'  )] )
        .groupBy('purchases.id')
        .orderBy('purchases.id', 'DESC');

    if (records.value.length) {
      message.value = `${records.value.length} Open Bills From `;
      vendor.value = selectedVendor.value.company;
    }else {

      message.value = 'No Record Found For ';
      console.log(message.value)
      vendor.value = selectedVendor.value.company;
    }

    selectedVendor.value = null;

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally {
    e.target.submitBtn.disabled = false;
    loading.value = false;
  }

}



//Get total bills
const recordTotal = computed(() => {
  let total = 0;
  if (records.value.length){
    for (const record of records.value) {
      total += parseFloat(record.total) - (parseFloat(record.totalPaid) || 0);
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