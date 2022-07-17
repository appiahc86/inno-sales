<template>

  <div class="container-fluid">
    <h4 class="text-center">Sales histtory from ....</h4>
    <div class="row">
      <div class="col">
        <DataTable
            :value="sales" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
            filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedVendors"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['id', 'phone', 'address', 'contactPerson']" responsiveLayout="scroll"
        >
          <template #header>
            <div class="d-flex justify-content-center align-items-center" style="height: 15px">
              <h5 class="px-3">Sales History</h5>
              <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" style="height: 30px"/>
                    </span>
            </div>
          </template>
          <template #empty>
            No record found.
          </template>
          <template #loading>
            <h4 class="text-white"> Loading data. Please wait...</h4>
          </template>

          <Column selection-mode="multiple" style="font-size: 0.85em;"></Column>

          <Column field="company" header="Date" sortable style="font-size: 0.85em;"></Column>
          <Column field="address" header="Receipt#" sortable  style="font-size: 0.85em;"></Column>
          <Column field="contactPerson" header="Cashier" sortable style="font-size: 0.85em;"></Column>
          <Column field="phone" header="No. Of Items" sortable style="font-size: 0.85em;"></Column>
          <Column field="accountNumber" header="Cash#" sortable style="font-size: 0.85em;"></Column>
          <Column field="notes" header="Momo" sortable style="font-size: 0.85em;"></Column>
          <Column field="notes" header="Total" sortable style="font-size: 0.85em;"></Column>

          <Column header="View Details" headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible" style="font-size: 0.85em;">
            <template #body="{data}">
              <span type="button" title="View Details" @click="" class="pi pi-eye-slash"></span> &nbsp;
            </template>
          </Column>
        </DataTable>

      </div>
    </div>
  </div>

</template>

<script setup>

import {ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import db from "@/dbConfig/db";

const loading = ref(false);
const sales = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


const getSales = async () => {

  try {
    loading.value = true;
  }catch (e) { ipcRenderer.send('errorMessage', e.message); }
  finally {
    loading.value = false;
  }
} // ./get all sales

</script>

<style scoped>

</style>