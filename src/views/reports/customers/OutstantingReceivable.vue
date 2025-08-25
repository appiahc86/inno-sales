<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12">

        <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow spinner-grow-sm"></span></h5>
        <h5 class="text-center mb-3" v-else><b>Customer Outstanding Receivables</b></h5>

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
              :rowsPerPageOptions="[10,25,50]" :globalFilterFields="['name','company', 'phone', 'address']" responsiveLayout="scroll"
          >

            <template #empty>
              No record found.
            </template>

            <Column field="name" header="Name" sortable  class="data-table-font-size"></Column>
            <Column field="company" header="Company" sortable  class="data-table-font-size"></Column>
            <Column field="phone" header="Contact" sortable  class="data-table-font-size"></Column>
            <Column field="outstanding" header="Outstanding" sortable class="data-table-font-size">
              <template #body="{data}">
                <td class="fw-bold">{{ formatNumber(data.outstanding) }}</td>
              </template>
            </Column>

          </DataTable>

          <br>
          <h4 v-if="recordTotal">Total: GH¢ {{ formatNumber(recordTotal) }}</h4>

        </div>



        <!--  Print table -->
        <template>
          <div class="" v-if="records.length">

            <div id="printOut">
              <h4 style="text-align: center;" v-if="settings.companyName">{{ settings.companyName }}</h4>
              <p style="font-size: 0.85em;">
                <span>{{ new Date().toDateString() }}</span><br>
                <b>Customer Outstanding Receivables</b>
              </p>
              <table id="print-table">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Outstanding</th>
                </tr>
                </thead>


                <template v-for="(record, index) in records" :key="record.id">
                  <tbody>
                  <tr>
                    <th>{{ index + 1 }}</th>
                    <td>&nbsp; {{ record.name }}</td>
                    <td>&nbsp; {{ record.company }}</td>
                    <td>&nbsp; {{ record.phone }}</td>
                    <td>&nbsp; {{ formatNumber(record.outstanding) }}</td>
                  </tr>
                  </tbody>

                </template>

              </table>

              <h3>Total: GH¢ {{ formatNumber(recordTotal) }}</h3>
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

const loading = ref(false);
const message = ref(null);
const records = ref([]);
const store = useStore();


const settings = computed(() => store.getters.setting)


//.............Get Records .........................
const getRecords = async () => {
  try {

    loading.value = true;

    const query = await db('customers')
        .leftJoin('orders', 'customers.id', 'orders.customerId')
        .select('customers.id', 'customers.phone', 'customers.company',
            'customers.name','orders.total', 'orders.tendered')
        .where('orders.isPaid', false)

      const filtered = [];

    if (query.length) { //If query.length

      for (const rec of query) {
        //check if object is already in filtered array
        const foundObject = filtered.find(item => item.id === rec.id);
        if (!!foundObject) continue;
        else filtered.push({
          id: rec.id,
          name: rec.name,
          company: rec.company,
          phone: rec.phone,
          outstanding: 0
        })

      }

    } // ./If query.length


    //If filtered is not empty
    if (filtered.length) {

      for (const q of query) { //Calculate outstanding
        for (const f of filtered) {
          if (q.id === f.id){
            f.outstanding += q.total - q.tendered
          }
        }
      }

    }

   records.value = filtered;


  }catch (e) {
    ipcRenderer.send("errorMessage", e.message)
  }finally { loading.value = false }
} // ./get Records

getRecords();





//Get records total
const recordTotal = computed(() => {
  let total = 0;
  if (records.value.length){
    for (const record of records.value) {
      total += parseFloat(record.outstanding)
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