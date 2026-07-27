<template>
<div class="container-fluid">
  <h4 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow"></span></h4>
  <h4 class="text-center" v-else>Products List</h4>
  <div class="row">
    <div class="col">
      <!--  Products Table  -->
      <div class="tab-pane mt-2" id="all-products" role="tabpanel" aria-labelledby="nav-all-products-tab">
        <div class="table-responsive">
          <DataTable
              :value="products" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
              :lazy="true" :totalRecords="totalRecords" :rows="lazyParams.rows"
              v-model:filters="filters" :loading="loading"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              responsiveLayout="scroll" @page="onPage" @sort="onSort"
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

            <Column field="productName" header="Product" sortable class="data-table-font-size">
              <template #body="{data}">
                <td :style="{color: data.quantity < 5 ? 'red' : '' }">{{ data.productName }}</td>
              </template>
            </Column>
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
            <Column field="wholesalePrice" header="Wholesale Price" sortable class="data-table-font-size">
              <template #body="{data}">
                <td><b>{{ formatNumber(parseFloat(data.wholesalePrice))}}</b></td>
              </template>
            </Column>
            <Column field="sellingPrice"
                    header="Retail Price"
                    sortable
                    class="data-table-font-size"
                    style="color: #9d02ef;"
            >
              <template #body="{data}">
                <td><b>{{ formatNumber(parseFloat(data.sellingPrice))}}</b></td>
              </template>
            </Column>
            <Column field="quantity" header="Qty" sortable bodyStyle="width:90px !important;" class="data-table-font-size"></Column>

            <Column field="description" header="Description" sortable class="data-table-font-size">
              <template #body="{data}">
                <td :title="data.description">
                  {{ data.description && data.description.length > 20 ? data.description.substring(0, 20) + '...' : data.description }}
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
import {reactive, ref, watch} from "vue";
import {formatNumber} from "@/functions";
import {FilterMatchMode} from "primevue/api";

const products = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = reactive({ first: 0, rows: 10, sortField: null, sortOrder: null });

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const SORT_FIELD_MAP = {
  productName: 'products.productName',
  category: 'categories.name',
  expiration: 'products.expiration',
  wholesalePrice: 'products.wholesalePrice',
  sellingPrice: 'products.sellingPrice',
  quantity: 'products.quantity',
  description: 'products.description'
};

//get products for the current page (server-side pagination)
const getAllProducts = async () => {

  try {

    loading.value = true;

    const search = filters.value.global.value?.trim();

    const baseQuery = () => {
      const query = db('products')
          .leftJoin('categories', 'products.category', '=', 'categories.id');
      if (search) {
        query.where(builder => {
          builder.where('products.productName', 'like', `%${search}%`)
              .orWhere('categories.name', 'like', `%${search}%`)
              .orWhere('products.description', 'like', `%${search}%`);
        });
      }
      return query;
    }

    const countResult = await baseQuery().count('products.id as count').first();
    totalRecords.value = parseInt(countResult?.count, 10) || 0;

    const sortColumn = SORT_FIELD_MAP[lazyParams.sortField] || 'products.productName';

    products.value = await baseQuery()
        .select(
            'products.id',
            'products.productName',
            'products.wholesalePrice',
            'products.sellingPrice',
            'products.quantity',
            'products.description',
            'categories.name as category',
            'products.expiration'
        )
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

//Debounced re-fetch on global search
let searchDebounce;
watch(() => filters.value.global.value, () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    lazyParams.first = 0;
    getAllProducts();
  }, 300);
});

</script>

<style scoped>

</style>