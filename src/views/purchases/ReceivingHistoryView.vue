<template>
<div class="container-fluid mt-5">
  <div class="row">
    <div class="col-12">
      <div class="table-responsive">
        <DataTable
            :value="purchases" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
            filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedRecord"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['name','company', 'phone', 'address']" responsiveLayout="scroll"
        >
          <template #header>
            <div class="d-flex justify-content-center align-items-center" style="height: 15px">
              <h6 class="px-3">Receiving History</h6>
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
            <h4 class="text-white"> Loading data. Please wait.</h4>
          </template>

          <Column selection-mode="multiple"  style="font-size: 0.85em;"></Column>

          <Column field="vendorId" header="Vendor" sortable style="font-size: 0.85em;"></Column>
          <Column field="invoice" header="Invoice Number" sortable style="font-size: 0.85em;"></Column>
          <Column field="billDate" header="Bill Date" sortable  style="font-size: 0.85em;"></Column>
          <Column field="invoiceDue" header="Due Date" sortable  style="font-size: 0.85em;"></Column>
          <Column field="numberOfItems" header="No. Of Items" sortable  style="font-size: 0.85em;"></Column>
          <Column field="total" header="Total" sortable  style="font-size: 0.85em;"></Column>
          <Column field="payment" header="Paid Amount" sortable  style="font-size: 0.85em;"></Column>

          <Column headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible"  style="font-size: 0.85em;">
            <template #body="{data}">
              <span type="button" title="Edit" @click="">&#128221;</span> &nbsp;
              <span type="button" title="Delete" @click="">&#10060;</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import {ref} from "vue";
import db from "@/dbConfig/db";
import {FilterMatchMode} from "primevue/api";

const purchases = ref([]);
const loading = ref(false);
const selectedRecord = ref(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


//Get purchases
const getPurchases = async () => {
  try {
    loading.value = true;
   purchases.value = await db('purchases').limit(2);
  }catch (e) { ipcRenderer.send("errorMessage", e.message) }
  finally { loading.value = false; }
} // ./Get purchases
getPurchases();




</script>

<style scoped>

</style>