
<template>
  <div class="container-fluid">

    <div class="row justify-content-center mb-4">
      <div class="col-4">

        <form @submit.prevent="search" class="d-none">
          <h5 class="text-center"><b>Best Selling Products</b></h5>
          <div class="input-group">
            <div class="input-group-text bg-dark text-white"><b>Qty Less Than</b></div>

            <input type="number" min="1" step="1" class="form-control form-control-dark" v-model="quantity"
                   oninput="validity.valid || (value = 5)"
            >
            <button ref="submitButton" class="bg-primary text-white px-3" title="Search" name="submitBtn" style="border: none;">
              <span class="spinner-border spinner-border-sm" v-if="loading"></span>
              <span class="pi pi-search" v-else></span>
            </button>
          </div>
        </form>

        <h4 v-if="loading">
          Loading Data. Please wait... <span class="spinner-grow spinner-grow-sm "></span>
        </h4>

      </div>
    </div>

    <div class="row">
      <div class="col-12">

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <div class="d-flex">
          <h6 class="">{{ message }}</h6>
          <h6 style="margin-left: auto">{{ new Date().toDateString() }}</h6>

        </div>
        <div class="table-responsive">
          <!--   Table     -->
          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['productName','category']" responsiveLayout="scroll"
          >
            <template #empty>
              No Record Found.
            </template>

            <Column field="productName" header="Product" sortable class="data-table-font-size"></Column>
            <Column field="category" header="Category" sortable class="data-table-font-size">
              <template #body="{data}">
                <td class="text-capitalize">{{ data.category }}</td>
              </template>
            </Column>
            <Column field="dateAdded" header="Date Added" sortable class="data-table-font-size">
              <template #body="{data}">
                <td class="text-capitalize">{{ new Date(data.dateAdded).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="buyingPrice" header="Cost Price" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.buyingPrice)) }}</td>
              </template>
            </Column>
            <Column field="wholesalePrice" header="Wholesale" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.wholesalePrice)) }}</td>
              </template>
            </Column>
            <Column field="sellingPrice" header="Retail" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.sellingPrice)) }}</td>
              </template>
            </Column>
            <Column field="quantity" header="Qty Sold" sortable bodyStyle="width:90px !important;" class="data-table-font-size">
              <template #body="{data}">
                <td class="fw-bold">
                  {{ data.totalSold.toLocaleString() }}
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
                <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Date Added</th>
                  <th>Cost Price</th>
                  <th>Wholesale</th>
                  <th>Retail</th>
                  <th>Qty Sold</th>
                </tr>
                </thead>


                <template v-for="(record, index) in records" :key="record.id">
                  <tbody>
                  <tr>
                    <th>{{ index + 1 }}</th>
                    <td>&nbsp; {{ record.productName }}</td>
                    <td style="text-transform: capitalize;">&nbsp; {{ record.category }}</td>
                    <td>&nbsp; {{ new Date(record.dateAdded).toLocaleDateString() }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.buyingPrice)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.wholesalePrice)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.sellingPrice)) }}</td>
                    <td>&nbsp; {{ record.totalSold.toLocaleString() }}</td>
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
import {computed, onMounted, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";


const submitButton = ref();
const loading = ref(false);
const records = ref([]);
const message = ref(null);
const quantity = ref(5);
const store = useStore();

const settings = computed(() => store.getters.setting)

const startDate = () => { //This will set date to January 1 of the current year
  let yyyy = new Date().getFullYear();
  let mm = '01';
  let dd = '01';
  return `${yyyy}-${mm}-${dd} 00:00:01`;
}


const endDate = () => { //This will set date to December 31 of the current year
  let yyyy = new Date().getFullYear();
  let mm = '12';
  let dd = '31';
  return `${yyyy}-${mm}-${dd} 23:59:59`;
}


onMounted(() => {
  submitButton.value.click();
})


//Search
const search = async (e) => {
  e.target.submitBtn.disabled = false;
  loading.value = true;
  try {

    records.value = await db('products')
        .innerJoin('orderDetails', 'products.id', '=','orderDetails.productId')
        .innerJoin('categories', 'categories.id', 'orderDetails.categoryId')
        .sum('orderDetails.quantity as totalSold')
        .whereRaw('orderDetails.date >= ?', [startDate()])
        .andWhereRaw('orderDetails.date <= ?', [endDate()])
        .select('products.id','products.productName','products.buyingPrice',
            'products.wholesalePrice', 'products.sellingPrice',
            'products.dateAdded','categories.name as category'
        )
        .groupBy('products.id')
        .orderBy('totalSold', 'desc')
        // .limit(10)

    message.value = `Best Selling Products (${new Date().getFullYear()})`;


  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally {
    loading.value = false;
    e.target.submitBtn.disabled = false;
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