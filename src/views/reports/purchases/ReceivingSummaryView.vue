
<template>
  <div class="container-fluid">

    <div class="row justify-content-center mb-4">
      <div class="col-12">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-7" style="max-width: 600px">
              <form @submit.prevent="search">
                <h5 class="text-center"><b>Receiving Summary</b></h5>
                <div class="input-group">
                  <div class="input-group-text bg-dark text-white"><b>From</b></div>
                  <input type="date" class="form-control form-control-dark" v-model="from" onkeydown="return false">
                  <div class="input-group-text bg-dark text-white"><b>To</b></div>
                  <input type="date" class="form-control form-control-dark" v-model="to" onkeydown="return false">
                  <button class="bg-primary text-white px-3" title="Search" name="submitBtn" style="border: none;">
                    <span class="spinner-border spinner-border-sm" v-if="loading"></span>
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
        <h6>{{ message }}</h6>
        <div class="table-responsive">
          <!--   Table     -->
          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['company', 'invoice', 'total']" responsiveLayout="scroll"
          >

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
                <span class="">{{ message }}</span>
              </p>
              <table id="print-table">
                <tr>
                  <th>Vendor</th>
                  <th>Invoice#</th>
                  <th>Bill Date</th>
                  <th>Due Date</th>
                  <th>No. Of Items</th>
                  <th>Total</th>
                </tr>

                <template v-for="record in records" :key="record.id">
                  <tr>
                    <td>&nbsp; {{ record.company }}</td>
                    <td>&nbsp; {{ record.invoice }}</td>
                    <td>&nbsp; {{ new Date(record.billDate).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ new Date(record.invoiceDue).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ record.numberOfItems }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.total)) }}</td>
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
const from = ref(null);
const to = ref(null);
const message = ref(null);
const store = useStore();

const settings = computed(() => store.getters.setting)


const search = async (e) => {
  if (!from.value || !to.value) return ipcRenderer.send('errorMessage', 'Please Select Date');
  if (from.value > to.value) return ipcRenderer.send('errorMessage', 'Sorry, (Date from) cannot be greater than (Date to)');

  records.value = [];
  message.value = null;

  try {
    e.target.submitBtn.disabled = true;
    loading.value = true;

    await db('purchases')
        .join('vendors', 'purchases.vendorId', '=', 'vendors.id')
        .select( 'purchases.billDate', 'purchases.invoiceDue','purchases.numberOfItems',
            'purchases.invoice', 'purchases.total','vendors.company')
        .whereRaw('billDate >= ?', [from.value + ' 00:00:01'])
        .andWhereRaw('billDate <= ?', [to.value + ' 23:59:59'])
        .orderBy('vendors.company', 'asc')
        .limit(510)
        .stream((stream) => {

          stream.on('data', (row) => {
            records.value.push(row);
            if (records.value.length > 500) { //If records are more than 500
              stream.destroy();
              records.value = [] //clear all record
              return ipcRenderer.send(
                  'errorMessage',
                  `You tried to display more than 500 records on screen.\nFor performance sake, please load records in batches`
              )
            }
          })

        });


    if (from.value === to.value) message.value = `Items Received On ${new Date(from.value).toDateString()}`;
    else message.value = `Items Received From ${new Date(from.value).toLocaleDateString()} To ${new Date(to.value).toLocaleDateString()}`;


    //If records from streaming
    if (records.value.length){
      from.value = null;
      to.value = null;
    }


  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally {
    e.target.submitBtn.disabled = false;
    loading.value = false;
  }

}



//Records total
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