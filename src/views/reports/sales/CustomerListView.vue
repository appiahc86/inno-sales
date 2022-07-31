
<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12">

        <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow"></span></h5>
        <h5 class="text-center mb-3" v-else><b>Customer List</b></h5>

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <h6>{{ new Date().toDateString() }}</h6>
        <div class="table-responsive">
          <!--   Table     -->
          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
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
            <Column field="address" header="Address" sortable class="data-table-font-size"></Column>

          </DataTable>
        </div>



        <!--  Print table -->
        <template>
          <div class="" v-if="records.length">

            <div id="printOut">
              <h4 style="text-align: center;" v-if="settings.companyName">{{ settings.companyName }}</h4>
              <p style="font-size: 0.85em;">
                <span>{{ new Date().toDateString() }}</span><br>
                <b>Customer List</b>
              </p>
              <table id="print-table">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>

                <template v-for="(record, index) in records" :key="record.id">
                  <tr>
                    <th>{{ index + 1 }}</th>
                    <td>&nbsp; {{ record.name }}</td>
                    <td>&nbsp; {{ record.company }}</td>
                    <td>&nbsp; {{ record.phone }}</td>
                    <td>&nbsp; {{ record.address }}</td>
                  </tr>
                </template>

              </table>
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
import {useStore} from "vuex";

const loading = ref(false)
const records = ref([]);
const store = useStore();

const settings = computed(() => store.getters.setting)


const getCustomers = async () => {

  try {
    loading.value = true;
    records.value = await db('customers').orderBy('customers.name', 'asc');
  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }

}
getCustomers();



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