<template>
<div class="container-fluid mt-4">
  <div class="row">
    <div class="col-12">

      <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow spinner-grow-sm"></span></h5>
      <h4 class="text-center" v-else>List Of Invoices Received From Vendors</h4>

      <h6 class="text-success mt-3">
        <span class="pi pi-info-circle fw-bold"></span>
        Right-click on a row to show the context menu.
      </h6>
      <div class="table-responsive">
        <DataTable
            :value="purchases" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
            filterDisplay="menu" :rows="10" v-model:filters="filters" v-model:selection="selectedRecord"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['company', 'invoice', 'total']" responsiveLayout="scroll" @row-click="rowClicked"
            contextMenu v-model:contextMenuSelection="selectedRow" @row-contextmenu="onRowContextMenu"
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

       <Column selection-mode="single" class="data-table-font-size" style="width: 20px;"></Column>

          <Column field="company" header="Vendor" sortable style="font-size: 0.75em;"></Column>
          <Column field="invoice" header="Invoice#" sortable style="font-size: 0.75em;"></Column>
          <Column field="user" header="User" sortable style="font-size: 0.75em;">
            <template #body="{data}">
              <td class="text-capitalize">{{ data.user }}</td>
            </template>
          </Column>
          <Column field="billDate" header="Bill Date" sortable  style="font-size: 0.75em;">
            <template #body="{data}">
              <td>{{ new Date(data.billDate).toLocaleDateString() }}</td>
            </template>
          </Column>
          <Column field="invoiceDue" header="Due Date" sortable  style="font-size: 0.75em;">
            <template #body="{data}">
              <td>{{ new Date(data.invoiceDue).toLocaleDateString() }}</td>
            </template>
          </Column>
          <Column field="numberOfItems" header="Total Items" sortable  style="font-size: 0.75em;"></Column>
          <Column field="total" header="Total" sortable  style="font-size: 0.75em;">
            <template #body="{data}">
              {{ formatNumber(data.total) }}
            </template>
          </Column>

        </DataTable>
        <ContextMenu :model="menuModel" ref="cm" class="context-menu" style="font-size: 0.9em;" />
      </div>
    </div>
  </div>
</div>

  <!--  Details Dialog -->
  <dialog ref="detailsDialog" style="min-width: 500px; border: 2px solid #ccc;">
    <button class="text-white bg-danger" style="float: right;" @click="detailsDialog.close()">X</button><br>

    <div class="container-fluid">
      <div class="p-5" v-if="detailsLoading">
        <h5 class="text-center">Loading... <span class="spinner-border spinner-border-sm"></span></h5>
      </div>
      <div class="row" v-else>
        <div class="col" v-if="details.length">

            <template v-if="details[0].invoice">
              <h4 class="text-center"><b>Invoice#: </b>{{ details[0].invoice }}</h4>
            </template>

            <div class="table-responsive" style="height: 300px;">
            <table class="table table-sm table-borderless table-striped">
              <thead>
              <tr>
                <th>Item</th>
                <th>Cost</th>
                <th>Qty</th>
                <th>Ext Cost</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="detail in details" :key="detail.id">
                <tr>
                  <td>{{ detail.productName }}</td>
                  <td>{{ formatNumber(detail.cost) }}</td>
                  <td>{{ detail.quantity }}</td>
                  <td>{{ formatNumber(detail.extCost) }}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
          <h5 v-if="details.length">Total : <span class="text-danger">{{ formatNumber(details[0].total) }}</span></h5>
        </div>
      </div>
    </div>
  </dialog>

<!--  Return to vendor dialog-->
  <dialog ref="returnDialog" style="max-width: 500px; border: 2px solid #ccc;">
    <div class="container">
      <div class="row">
        <div class="col">
          <form @submit.prevent="returnToVendor">
            <h5>Return To <span class="text-primary">{{ returnData.vendor }}</span></h5>
            <p>
              This action will reverse the document's effect on inventory.<br>
              Proceed if you are sure you want to reverse this document. Also will clear any
              payment made if available
            </p>
<!--            <div class="d-flex mb-3">-->
<!--              <label><b>Return Date</b> <input type="date" class="form-control-dark p-1" v-model="returnData.date"></label>-->
<!--            </div>-->
            <button name="submitBtn" type="submit" class="px-2 bg-dark text-white" style="outline: none !important;">Proceed</button>
            <button type="button" class="float-end px-2 btn-secondary" @click="closeReturnDialog">Cancel</button>

          </form>
        </div>
      </div>
    </div>

  </dialog>

</template>

<script setup>
import {reactive, ref} from "vue";
import db from "@/dbConfig/db";
import {FilterMatchMode} from "primevue/api";
import {formatNumber} from "@/functions";
import * as Validator from "validatorjs";
import {useStore} from "vuex";

const selectedRecord = ref();
const store = useStore();
const purchases = ref([]);
const loading = ref(false);
const detailsLoading = ref(false);
const details = ref([]);
const  detailsDialog = ref(null);
const  returnDialog = ref(null);

const returnData = reactive({
  id: null,
  date: null,
  vendor: null
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


//For row context menu
const cm = ref();
const menuModel = ref([
  {label: 'View Details', icon: 'pi pi-eye', command: () => showDetails(selectedRow.value.id), class: 'fw-bold'},
  {separator: true},
  {label: 'Return To Vendor', icon: 'pi pi-undo', command: () => openReturnDialog(selectedRow.value.id, selectedRow.value.company), class: 'fw-bold'}
]);
const selectedRow = ref();
const onRowContextMenu = (event) => {
  selectedRecord.value = null;
  selectedRecord.value = event.data;
  cm.value.show(event.originalEvent);
}

//Row click event
const rowClicked = (e) => {
  selectedRecord.value = e.data;
}


//Get purchases
const getPurchases = async () => {
  try {

    loading.value = true;

   purchases.value = await db('purchases')
       .join('vendors', 'purchases.vendorId', '=', 'vendors.id')
       .leftJoin('billPayments', 'purchases.id', 'billPayments.purchaseId')
       .leftJoin('users', 'users.id', '=', 'purchases.userId')
       .select('purchases.id', 'purchases.billDate', 'purchases.invoiceDue',
           'purchases.numberOfItems','purchases.invoice', 'purchases.total',
           'vendors.company', 'users.firstName as user')
       .groupBy('purchases.id')
       .orderBy('purchases.id', 'DESC').limit(200);

  }catch (e) { ipcRenderer.send("errorMessage", e.message) }
  finally { loading.value = false; }
} // ./Get purchases
getPurchases();



//Show details
const showDetails = async (id) => {
  try {
    detailsDialog.value.showModal();
    detailsLoading.value = true;
    details.value = await db('purchases')
        .innerJoin('purchaseDetails', 'purchases.id', '=', 'purchaseDetails.purchaseId')
        .select('purchases.invoice', 'purchases.total', 'purchaseDetails.productName',
            'purchaseDetails.cost', 'purchaseDetails.quantity', 'purchaseDetails.total as extCost'
        ).where('purchases.id', id)
        .limit(100);

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }finally {
    detailsLoading.value = false;
  }
}


// Close ReturnDialog
const closeReturnDialog = () => {
  returnData.date = null;
  returnData.id = null;
  returnData.vendor = null;
  returnDialog.value.close();
}


              //.................Return to Vendor........................

const openReturnDialog = (id, vendor) => { // open dialog
  returnData.id = id;
  returnData.vendor = vendor;
  returnDialog.value.showModal();
}

const returnToVendor = async (e) => {
  try {

      e.target.submitBtn.disabled = true;

      await db.transaction( async trx => {
        const records = await trx('purchases')
            .join('purchaseDetails', 'purchases.id', '=', 'purchaseDetails.purchaseId')
            .select('purchaseDetails.productId', 'purchaseDetails.quantity')
            .where('purchases.id', returnData.id)
            .limit(200)


        //Batch update  products quantity
        for (const purchase of records) {
          await trx('products').where('id', purchase.productId).first().decrement('quantity', purchase.quantity)
        }

        //Update qty in vuex store
        for (const purchase of records) {
          store.dispatch("productsModule/modifyQty", {id: purchase.productId, qty: purchase.quantity, type: 'decrement'})
        }


        //Delete purchase
        await trx('purchases').where('id', returnData.id).del();

        // Update on front-end
        purchases.value = purchases.value.filter(purchase => purchase.id !== returnData.id)

        returnData.date = null;
        returnData.id = null;
        returnData.vendor = null;
        returnDialog.value.close();
      })

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }finally { e.target.submitBtn.disabled = false }

}

</script>

<style scoped>

</style>