
<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12">

        <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow spinner-grow-sm"></span></h5>
        <h5 class="text-center mb-3" v-else><b>Outstanding Bills</b></h5>

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <h6>{{ new Date().toDateString() }}</h6>
        <div class="table-responsive">
          <!--   Table     -->
          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]" :globalFilterFields="['company', 'invoice']" responsiveLayout="scroll">
            <template #empty>
              No record found.
            </template>

            <Column field="company" header="Vendor" sortable class="data-table-font-size"></Column>
            <Column field="invoice" header="Invoice#" sortable class="data-table-font-size"></Column>
            <Column field="billDate" header="Bill Date" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.billDate).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="invoiceDue" header="Due Date" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.invoiceDue).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="total" header="Total" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(data.total) }}</td>
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
                <span>Outstanding Bills</span>
              </p>
              <table id="print-table">
                <tr>
                  <th>Vendor</th>
                  <th>Invoice#</th>
                  <th>Bill Date</th>
                  <th>Due Date</th>
                  <th>Total</th>
                  <th>Amount Due</th>
                </tr>

                <template v-for="record in records" :key="record.id">
                  <tr>
                    <td>&nbsp; {{ record.company }}</td>
                    <td>&nbsp; {{ record.invoice }}</td>
                    <td>&nbsp; {{ new Date(record.billDate).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ new Date(record.invoiceDue).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.total)) }}</td>
                    <td>&nbsp; {{ formatNumber(record.total - (record.totalPaid || 0)) }}</td>
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
import {computed, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const loading = ref(false)
const records = ref([]);
const store = useStore();

const settings = computed(() => store.getters.setting)


const getBills = async () => {

  try {

    loading.value = true;

    records.value = await db('purchases')
        .innerJoin('vendors', 'purchases.vendorId', '=', 'vendors.id')
        .leftJoin('billPayments', 'purchases.id', 'billPayments.purchaseId')
        .select('purchases.id','purchases.billDate', 'purchases.invoiceDue',
            'purchases.invoice', 'purchases.total', 'vendors.company')
        .sum('billPayments.amount as totalPaid')
        .where('purchases.status', 'received')
        .havingRaw('?? > ?', ['purchases.total',  db.raw('coalesce(sum(billPayments.amount), 0)'  )] )
        .groupBy('purchases.id')
        .orderBy('purchases.id', 'DESC');

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }
}
getBills();


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