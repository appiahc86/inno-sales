
<template>
  <div class="container-fluid">

    <div class="row justify-content-center mb-4">
      <div class="col-4">

        <form @submit.prevent="search">
          <h5 class="text-center"><b>Low Stock</b></h5>
          <div class="input-group">
            <div class="input-group-text bg-dark text-white"><b>Qty Less Than</b></div>

            <input type="number" min="1" step="1" class="form-control form-control-dark" v-model="quantity"
                   oninput="validity.valid || (value = 5)"
            >
            <button class="bg-primary text-white px-3" title="Search" name="submitBtn" style="border: none;">
              <span class="spinner-border" v-if="loading"></span>
              <span class="pi pi-search" v-else></span>
            </button>
          </div>
        </form>
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
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
              filterDisplay="menu" :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['productName','category', 'description']" responsiveLayout="scroll"
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
            <Column field="tax" header="Tax" sortable class="data-table-font-size"></Column>
            <Column field="buyingPrice" header="Cost" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.buyingPrice)) }}</td>
              </template>
            </Column>
            <Column field="sellingPrice" header="Sel. Price" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.sellingPrice)) }}</td>
              </template>
            </Column>
            <Column field="quantity" header="Qty" sortable bodyStyle="width:90px !important;" class="data-table-font-size"></Column>
            <Column field="description" header="Desc" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td :title="data.description">
                  {{ data.description.length > 20 ? data.description.substring(0, 20) + '...' : data.description }}
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
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Date Added</th>
                  <th>Tax</th>
                  <th>Qty</th>
                  <th>Cost</th>
                  <th>Selling Price</th>
                  <th>Description</th>
                </tr>

                <template v-for="(record, index) in records" :key="record.id">
                  <tr>
                    <th>{{ index + 1 }}</th>
                    <td>&nbsp; {{ record.productName }}</td>
                    <td style="text-transform: capitalize;">&nbsp; {{ record.category }}</td>
                    <td>&nbsp; {{ new Date(record.dateAdded).toLocaleDateString() }}</td>
                    <td style="text-transform: capitalize;">&nbsp; {{ record.tax }}</td>
                    <td>&nbsp; {{ record.quantity }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.buyingPrice)) }}</td>
                    <td>&nbsp; {{ formatNumber(parseFloat(record.sellingPrice)) }}</td>
                    <td>&nbsp; {{ record.description }}</td>
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
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const loading = ref(false)
const records = ref([]);
const message = ref(null);
const quantity = ref(5);
const store = useStore();

const settings = computed(() => store.getters.setting)

//Search
const search = async (e) => {
  e.target.submitBtn.disabled = false;
   loading.value = true;
  try {

    records.value = await db('products')
        .leftJoin('categories', 'products.category', '=','categories.id')
        .select(
            'products.productName',
            'products.buyingPrice',
            'products.sellingPrice',
            'products.quantity',
            'products.dateAdded',
            'products.tax',
            'products.description',
            'categories.name as category'
        ).whereRaw('?? < ?', ['quantity', quantity.value])
        .orderBy('products.productName','asc')

    if (records.value.length) message.value = `Products with Qty less than ${quantity.value}`
    else message.value = `No Match Found`;

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