
<template>
  <div class="container-fluid">

    <div class="row justify-content-center mb-4">
      <div class="col-12">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-7" style="max-width: 600px">
              <form @submit.prevent="search">
                <h5 class="text-center"><b>Price Adjustment History</b></h5>
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
              responsiveLayout="scroll"
          >

            <template #empty>
              No record found.
            </template>

            <Column field="productName" header="Product" sortable class="data-table-font-size"></Column>
            <Column field="date" header="Date" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.date).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="user" header="User" sortable class="data-table-font-size"></Column>
            <Column field="oldPrice" header="Old Price" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(data.oldPrice) }}</td>
              </template>
            </Column>
            <Column field="newPrice" header="New Price" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(data.newPrice) }}</td>
              </template>
            </Column>
            <Column field="reason" header="Reason" sortable class="data-table-font-size">
              <template #body="{data}">
                <td :title="data.reason">
                  {{ data.reason && data.reason.length > 20 ? data.reason.substring(0, 20) + '...' : data.reason }}
                </td>
              </template>
            </Column>
          </DataTable>
        </div>




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
                  <th>Product</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Old Price</th>
                  <th>New Price</th>
                  <th>Reason</th>
                </tr>

                <template v-for="record in records" :key="record.id">
                  <tr>
                    <td>&nbsp; {{ record.productName }}</td>
                    <td>&nbsp; {{ new Date(record.date).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ record.user }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.oldPrice)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.newPrice)) }}</td>
                    <td>&nbsp; {{ record.reason }}</td>
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
import {formatNumber} from "@/functions";

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

    await db('priceAdjustments')
        .join('users', 'users.id', '=', 'priceAdjustments.userId')
        .select('priceAdjustments.id','priceAdjustments.productName', 'priceAdjustments.date',
            'priceAdjustments.oldPrice','priceAdjustments.newPrice','priceAdjustments.reason',
            'users.firstName as user')
        .whereRaw('priceAdjustments.date >= ?', [from.value + ' 00:00:01'])
        .andWhereRaw('priceAdjustments.date <= ?', [to.value + ' 23:59:59'])
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


    if (from.value === to.value) message.value = `Price Adjustments On ${new Date(from.value).toDateString()}`;
    else message.value = `Price Adjustments From ${new Date(from.value).toLocaleDateString()} To ${new Date(to.value).toLocaleDateString()}`;


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