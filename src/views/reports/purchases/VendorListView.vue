
<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12">

        <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow spinner-grow-sm"></span></h5>
        <h5 class="text-center mb-3" v-else><b>Vendor List</b></h5>

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <h6>{{ new Date().toDateString() }}</h6>
        <div class="table-responsive">
          <!--   Table     -->
          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10" :rowsPerPageOptions="[10,25,50]"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['company', 'phone', 'address', 'contactPerson']" responsiveLayout="scroll"
          >
            <template #empty>
              No record found.
            </template>

            <Column field="company" header="Company" sortable class="data-table-font-size"></Column>
            <Column field="address" header="Address" sortable  class="data-table-font-size"></Column>
            <Column field="contactPerson" header="Contact Person" sortable class="data-table-font-size"></Column>
            <Column field="phone" header="Phone" sortable class="data-table-font-size"></Column>
            <Column field="accountNumber" header="Account#" sortable class="data-table-font-size"></Column>

          </DataTable>
        </div>



        <!--  Print table -->
        <template>
          <div class="" v-if="records.length">

            <div id="printOut">
              <h4 style="text-align: center;" v-if="settings.companyName">{{ settings.companyName }}</h4>
              <p style="font-size: 0.85em;">
                <span>{{ new Date().toDateString() }}</span><br>
                <b>Vendor List</b>
              </p>
              <table id="print-table">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th>Address</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Account Number</th>
                </tr>
                </thead>


                <template v-for="(record, index) in records" :key="record.id">
                  <tbody>
                  <tr>
                    <th>{{ index + 1 }}</th>
                    <td>&nbsp; {{ record.company }}</td>
                    <td>&nbsp; {{ record.address }}</td>
                    <td>&nbsp; {{ record.contactPerson }}</td>
                    <td>&nbsp; {{ record.phone }}</td>
                    <td>&nbsp; {{ record.accountNumber }}</td>
                  </tr>
                  </tbody>

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


const getVendors = async () => {

  try {

    loading.value = true;

    records.value = await db('vendors').orderBy('company', 'asc');

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }


}
getVendors();



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