
<template>
  <div class="container-fluid">
    <div class="row justify-content-center mb-4">
      <div class="col-12">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-7" style="max-width: 600px">
              <form @submit.prevent="search">
                <h5 class="text-center"><b>Sales Returns</b></h5>
                <div class="input-group">
                  <div class="input-group-text bg-dark text-white"><b>From</b></div>
                  <input type="date" class="form-control form-control-dark" v-model="from" onkeydown="return false">
                  <div class="input-group-text bg-dark text-white"><b>To</b></div>
                  <input type="date" class="form-control form-control-dark" v-model="to" onkeydown="return false">
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
        <!--   Table     -->

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <h6>{{ message }}</h6>
        <div class="table-responsive">

          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10, 15, 25]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" responsiveLayout="scroll"
          >
            <template #empty>
              No record found.
            </template>
            <Column header="#" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ records.indexOf(data) + 1 }}</td>
              </template>
            </Column>

            <Column field="orderDate" header="Date" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.orderDate).toLocaleDateString() }}</td>
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
                <span>{{ new Date().toDateString() }}</span><br>
                <span class="">{{ message }}</span>
              </p>
              <table id="print-table">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Total</th>
                </tr>

                <template v-for="(record, index) in records" :key="record.id">
                  <tr>
                    <td>&nbsp; {{ index + 1 }}</td>
                    <td>&nbsp; {{ new Date(record.orderDate).toLocaleDateString() }}</td>
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
import {computed, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const loading = ref(false)
const from = ref(null);
const to = ref(null);
const message = ref(null);
const records = ref([]);

const store = useStore();

const settings = computed(() => store.getters.setting)

//....................Search.......................

const search = async (e) => {

  if (!from.value || !to.value) return ipcRenderer.send('errorMessage', 'Please Select Date');
  const dateFrom = new Date(from.value).setHours(0,0,0,0);
  const dateTo = new Date(to.value).setHours(0,0,0,0);
  if (dateFrom > dateTo) return ipcRenderer.send('errorMessage', 'Sorry, (Date from) cannot be greater than (Date to)');

  message.value = null;

  try {
    e.target.submitBtn.disabled = true;
    loading.value = true;
    records.value = await db('orders')
        .select('orders.id', 'orders.orderDate')
        .sum('orders.total as total')
        .whereRaw('?? >= ?', ['orderDate', dateFrom])
        .andWhereRaw('?? <= ?', ['orderDate', dateTo])
        .andWhereRaw('?? = ?', ['type', 'return'])
        .groupBy('orders.orderDate')

    if (dateFrom === dateTo) message.value = `Sales Returns Report On ${new Date(dateFrom).toDateString()}`;
    else message.value = `Sales Returns Report From ${new Date(dateFrom).toLocaleDateString()} To ${new Date(dateTo).toLocaleDateString()}`;

    from.value = null;
    to.value = null;

  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
  finally {
    loading.value = false;
    e.target.submitBtn.disabled = false;
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