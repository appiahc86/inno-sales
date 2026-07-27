
<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12">

        <h5 class="text-center" v-if="loading">Loading Data Please Wait...
          <span class="spinner-grow spinner-grow-sm"></span></h5>
        <h5 class="text-center mb-3" v-else><b>Products List</b></h5>

        <button class="p-1 fw-bold bg-secondary text-white" v-if="totalRecords" @click="printReport">
          <span class="pi pi-print"></span> Print</button>
        <button class="p-1 fw-bold bg-secondary text-white ms-2" v-if="totalRecords"
                @click="exportToPDF" :disabled="exportingPDF">
          <span class="pi pi-file-pdf"></span> {{ exportingPDF ? 'Exporting...' : 'Export to PDF' }}</button>
        <h6>{{ new Date().toDateString() }}</h6>
        <div class="table-responsive">
          <!--   Table     -->
          <DataTable
              :value="records" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              :lazy="true" :totalRecords="totalRecords" :rows="lazyParams.rows" :loading="loading"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              responsiveLayout="scroll" @page="onPage" @sort="onSort"
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
            <Column field="expiration" header="Exp" sortable class="data-table-font-size">
              <template #body="{data}">
                <td >{{ data.expiration ? new Date(data.expiration).toLocaleDateString() : '' }}</td>
              </template>
            </Column>
            <Column field="dateAdded" header="Date Added" sortable class="data-table-font-size">
              <template #body="{data}">
                <td class="text-capitalize">{{ new Date(data.dateAdded).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="tax" header="Tax" sortable class="data-table-font-size"></Column>
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
            <Column field="quantity" header="Qty" sortable bodyStyle="width:90px !important;" class="data-table-font-size"></Column>
            <Column field="description" header="Desc" sortable class="data-table-font-size">
              <template #body="{data}">
                <td :title="data.description">
                  {{ data.description && data.description.length > 20 ? data.description.substring(0, 20) + '...' : data.description }}
                </td>
              </template>
            </Column>
          </DataTable>
        </div>


        <!--  Print table -->
        <template>
          <div class="" v-if="printRecords.length">

            <div id="printOut">
              <h4 style="text-align: center;" v-if="settings.companyName">{{ settings.companyName }}</h4>
              <p style="font-size: 0.85em;">
                <span>{{ new Date().toDateString() }}</span><br>
                <span>Products List</span>
              </p>
              <table id="print-table" style="font-size: 0.85em; width: 100%; border-collapse: collapse;">
                <thead>
                <tr>
                  <th style="border: 1px solid black;">#</th>
                  <th style="border: 1px solid black;">Product</th>
                  <th style="border: 1px solid black;">Category</th>
                  <th style="border: 1px solid black;">Exp</th>
<!--                  <th>Date Added</th>-->
<!--                  <th>Tax</th>-->
                  <th style="border: 1px solid black;">Qty</th>
                  <th style="border: 1px solid black;">Cost Price</th>
                  <th style="border: 1px solid black;">Wholesale</th>
                  <th style="border: 1px solid black;">Retail</th>
<!--                  <th>Description</th>-->
                </tr>
                </thead>


                <template v-for="(record, index) in printRecords" :key="record.id">
                  <tbody>
                  <tr>
                    <th style="border: 1px solid black;">{{ index + 1 }}</th>
                    <td style="border: 1px solid black;">&nbsp; {{ record.productName }}</td>
                    <td style="text-transform: capitalize; border: 1px solid black;">&nbsp; {{ record.category }}</td>
                    <td style="border: 1px solid black;">&nbsp;{{ record.expiration ? new Date(record.expiration).toLocaleDateString() : '' }}</td>
<!--                    <td>&nbsp; {{ new Date(record.dateAdded).toLocaleDateString() }}</td>-->
<!--                    <td style="text-transform: capitalize;">&nbsp; {{ record.tax }}</td>-->
                    <td style="border: 1px solid black;">&nbsp; {{ record.quantity }}</td>
                    <td style="border: 1px solid black;">&nbsp; {{ formatNumber(parseFloat(record.buyingPrice)) }}</td>
                    <td style="border: 1px solid black;">&nbsp; {{ formatNumber(parseFloat(record.wholesalePrice)) }}</td>
                    <td style="border: 1px solid black;">&nbsp; {{ formatNumber(parseFloat(record.sellingPrice)) }}</td>
<!--                    <td>&nbsp; {{ record.description }}</td>-->
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
import db from "@/dbConfig/db";
import {computed, nextTick, reactive, ref, shallowRef} from "vue";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";

const loading = ref(false)
const store = useStore();
const records = ref([]);
// shallowRef: printRecords can be thousands of rows for a full report print; a plain
// ref() would deep-proxy every field of every row for no benefit since this data is
// only ever read, never mutated in place, and that proxying was the actual print slowdown.
const printRecords = shallowRef([]);
const totalRecords = ref(0);
const lazyParams = reactive({ first: 0, rows: 10, sortField: null, sortOrder: null });

const settings = computed(() => store.getters.setting)

const SORT_FIELD_MAP = {
  productName: 'products.productName',
  category: 'categories.name',
  expiration: 'products.expiration',
  dateAdded: 'products.dateAdded',
  tax: 'products.tax',
  buyingPrice: 'products.buyingPrice',
  wholesalePrice: 'products.wholesalePrice',
  sellingPrice: 'products.sellingPrice',
  quantity: 'products.quantity',
  description: 'products.description'
};

const productColumns = [
  'products.id',
  'products.productName',
  'products.buyingPrice',
  'products.wholesalePrice',
  'products.sellingPrice',
  'products.quantity',
  'products.dateAdded',
  'products.tax',
  'products.description',
  'products.expiration',
  'categories.name as category'
];

const baseQuery = () => db('products').leftJoin('categories', 'products.category', '=', 'categories.id');

//get products for the current page (server-side pagination)
const getAllProducts = async () => {

  try {

    loading.value = true;

    const countResult = await baseQuery().count('products.id as count').first();
    totalRecords.value = parseInt(countResult?.count, 10) || 0;

    const sortColumn = SORT_FIELD_MAP[lazyParams.sortField] || 'products.productName';

    records.value = await baseQuery()
        .select(...productColumns)
        .orderBy(sortColumn, lazyParams.sortOrder === -1 ? 'desc' : 'asc')
        .limit(lazyParams.rows)
        .offset(lazyParams.first);


  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }

}
getAllProducts();

//Handle paginator page/rows change
const onPage = (event) => {
  lazyParams.first = event.first;
  lazyParams.rows = event.rows;
  getAllProducts();
}

//Handle column sort change
const onSort = (event) => {
  lazyParams.sortField = event.sortField;
  lazyParams.sortOrder = event.sortOrder;
  getAllProducts();
}

//Fetch the full, unpaginated list into #printOut - shared by Print and Export to PDF
const loadPrintOut = async () => {
  printRecords.value = await baseQuery()
      .select(...productColumns)
      .orderBy('products.productName', 'asc');
  await nextTick();
}

//Print Report
const printReport = async () => {
  try {
    await loadPrintOut();
    const printOut = document.querySelector('#printOut');
    printTiny(printOut, {scanStyles: false, scanHTML: true});
    console.clear();
  } catch (e) { ipcRenderer.send('errorMessage', e.message) }
}

//Export Report to PDF - renders #printOut in a hidden window in the main process and saves it
const exportingPDF = ref(false);
const exportToPDF = async () => {
  try {
    exportingPDF.value = true;
    await loadPrintOut();
    const printOut = document.querySelector('#printOut');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Products List</title></head><body>${printOut.outerHTML}</body></html>`;

    const result = await ipcRenderer.invoke('exportToPDF', {
      html,
      defaultFileName: `Products List ${new Date().toISOString().slice(0, 10)}.pdf`
    });

    if (result?.success) ipcRenderer.send('successMessage', `Saved to ${result.filePath}`);
  } catch (e) { ipcRenderer.send('errorMessage', e.message) }
  finally { exportingPDF.value = false; }
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