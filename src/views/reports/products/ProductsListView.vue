
<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12">

        <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow"></span></h5>
        <h5 class="text-center mb-3" v-else><b>Products List</b></h5>

        <button class="p-1 fw-bold bg-secondary text-white" v-if="records.length" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <h6>{{ new Date().toDateString() }}</h6>
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

            <Column field="productName" header="Product" sortable style="font-size: 0.85em;"></Column>
            <Column field="category" header="Category" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td class="text-capitalize">{{ data.category }}</td>
              </template>
            </Column>
            <Column field="dateAdded" header="Date Added" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td class="text-capitalize">{{ new Date(data.dateAdded).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="tax" header="Tax" sortable style="font-size: 0.85em;"></Column>
            <Column field="buyingPrice" header="Cost" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.buyingPrice)) }}</td>
              </template>
            </Column>
            <Column field="sellingPrice" header="Sel. Price" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td>{{ formatNumber(parseFloat(data.sellingPrice)) }}</td>
              </template>
            </Column>
            <Column field="quantity" header="Qty" sortable bodyStyle="width:90px !important;" style="font-size: 0.85em;"></Column>
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
                <span>Products List</span>
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
const store = useStore();

const settings = computed(() => store.getters.setting)

//get all products
const getAllProducts = async () => {

  try {

    loading.value = true;


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
        ).orderBy('products.productName','asc')

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }


}
getAllProducts();



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