<template>
<div class="container-fluid">
  <h4 class="text-center">Item List</h4>
  <div class="row">
    <div class="col">
      <!--  Products Table  -->
      <div class="tab-pane mt-2" id="all-products" role="tabpanel" aria-labelledby="nav-all-products-tab">
        <div class="table-responsive">
          <DataTable
              :value="products" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
              filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['productName','category', 'description']" responsiveLayout="scroll"
          >
            <template #header>
              <div class="d-flex justify-content-center align-items-center" style="height: 15px">
                <h6 class="px-3">Products</h6>
                <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value"
                                   placeholder="Keyword Search" style="height: 30px;"/>
                    </span>
              </div>
            </template>
            <template #empty>
              No Record Found.
            </template>
            <template #loading>
              <h4 class="text-white"> Loading data. Please wait.</h4>
            </template>

            <Column field="productName" header="Product" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td :style="{color: data.quantity < 5 ? 'red' : '' }">{{ data.productName }}</td>
              </template>
            </Column>
            <Column field="category" header="Category" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td class="text-capitalize">{{ data.category }}</td>
              </template>
            </Column>
            <Column field="sellingPrice" header="Price" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td><b>{{ formatNumber(parseFloat(data.sellingPrice))}}</b></td>
              </template>
            </Column>
            <Column field="quantity" header="Qty" sortable bodyStyle="width:90px !important;" style="font-size: 0.85em;"></Column>
            <Column field="tax" header="Tax" sortable style="font-size: 0.85em;"></Column>
            <Column field="description" header="Desc" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td :title="data.description">
                  {{ data.description.length > 20 ? data.description.substring(0, 20) + '...' : data.description }}
                </td>
              </template>
            </Column>

          </DataTable>
        </div>
        <br>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import db from "@/dbConfig/db";
import {ref} from "vue";
import {formatNumber} from "@/functions";
import {FilterMatchMode} from "primevue/api";

const products = ref([]);
const loading = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

//get all products
const getAllProducts = async () => {

  try {

    loading.value = true;

    products.value = await db('products')
        .leftJoin('categories', 'products.category', '=','categories.id')
        .select(
            'products.productName',
            'products.sellingPrice',
            'products.quantity',
            'products.tax',
            'products.description',
            'categories.name as category',
              )

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }

}
getAllProducts();

</script>

<style scoped>

</style>