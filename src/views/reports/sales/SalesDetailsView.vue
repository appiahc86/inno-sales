
<template>
  <div class="container-fluid">
    <div class="row justify-content-center mb-4">
      <div class="col-12">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-7" style="max-width: 600px">
              <form @submit.prevent="search">
                <h5 class="text-center"><b>Sales Details</b></h5>
                <div class="input-group">
                  <div class="input-group-text bg-dark text-white"><b>From</b></div>
                  <input type="date" class="form-control" v-model="from" onkeydown="return false">
                  <div class="input-group-text bg-dark text-white"><b>To</b></div>
                  <input type="date" class="form-control" v-model="to" onkeydown="return false">
                  <button class="btn btn-primary text-white px-3" title="Search" name="submitBtn">
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

            <Column field="date" header="Date" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td>{{ new Date(data.date).toLocaleDateString() }}</td>
              </template>
            </Column>

            <Column field="productName" header="Item" sortable style="font-size: 0.85em;"></Column>

            <Column field="buyingPrice" header="Cost" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.buyingPrice)) }}</td>
              </template>
            </Column>

            <Column field="sellingPrice" header="SellingPrice" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.sellingPrice)) }}</td>
              </template>
            </Column>

            <Column field="quantity" header="Qty" sortable style="font-size: 0.85em;"></Column>

            <Column field="tax" header="Tax" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.tax)) }}</td>
              </template>
            </Column>

            <Column field="discount" header="Discount" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.discount)) }}</td>
              </template>
            </Column>

            <Column field="total" header="Total" sortable style="font-size: 0.85em;">
              <template #body="{data}">
  <td>
    {{ formatNumber( ( (parseInt(data.quantity) * parseFloat(data.sellingPrice)) + parseFloat(data.tax) ) - parseFloat(data.discount) ) }}
  </td>
              </template>
            </Column>
          </DataTable>
        </div>
        <h5 class="mt-2" v-if="records.length">Total: GHS {{ formatNumber(parseFloat(recordTotal)) }}</h5>




        <!--  Print table -->
        <template>
          <div class="" v-if="records.length">

            <div id="printOut">
              <h6>{{ message }}</h6>
              <table id="print-table">
                <tr>
                  <th>Date</th>
                  <th>Item</th>
                  <th>Cost</th>
                  <th>Selling Price</th>
                  <th>Qty</th>
                  <th>Tax</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>

                <template v-for="record in records" :key="record.id">
                  <tr>
                    <td>&nbsp; {{ new Date(record.date).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ record.productName }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.buyingPrice)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.sellingPrice)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseInt(record.quantity)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.tax)) }}</td>
                    <td> {{ formatNumber(parseFloat(record.discount)) }}</td>
                    <td>
                      &nbsp; {{formatNumber( ( (parseInt(record.quantity)*parseFloat(record.sellingPrice)) + parseFloat(record.tax) ) - parseFloat(record.discount) ) }}
                    </td>

                  </tr>
                </template>

              </table>
              <div style="margin-top: 0;"><h5>Total: GHS {{ formatNumber(parseFloat(recordTotal)) }}</h5></div>
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

const loading = ref(false)
const from = ref(null);
const to = ref(null);
const message = ref(null);
const records = ref([]);


//....................Search.......................

const search = async (e) => {

  if (!from.value || !to.value) return ipcRenderer.send('errorMessage', 'Please Select Date');
  const dateFrom = new Date(from.value).setHours(0,0,0,0);
  const dateTo = new Date(to.value).setHours(0,0,0,0);
  message.value = null;

  try {
    e.target.submitBtn.disabled = true;
    loading.value = true;
    records.value = await db('orderDetails')
        .select('orderDetails.productName', 'orderDetails.buyingPrice', 'orderDetails.sellingPrice',
            'orderDetails.tax','orderDetails.discount', 'orderDetails.quantity', 'orderDetails.date'
        )
        .whereRaw('?? >= ?', ['date', dateFrom])
        .andWhereRaw('?? <= ?', ['date', dateTo])

    if (dateFrom === dateTo) message.value = `Sales Report On ${new Date(dateFrom).toDateString()}`;
    else message.value = `Sales Report From ${new Date(dateFrom).toLocaleDateString()} To ${new Date(dateTo).toLocaleDateString()}`;

    from.value = null;
    to.value = null;

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
      total += ( (parseInt(record.quantity)*parseFloat(record.sellingPrice)) + parseFloat(record.tax) ) - parseFloat(record.discount);
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
  width: 100%;
  border-collapse: collapse;
}
#print-table th, #print-table td{
  border: 1px solid black;
}
</style>