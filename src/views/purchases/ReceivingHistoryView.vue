<template>
<div class="container-fluid mt-4">
  <div class="row">
    <div class="col-12">

      <h4 class="text-center">List Of Invoices Received From Vendors</h4>

      <div class="table-responsive">
        <DataTable
            :value="purchases" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
            filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['company', 'invoice', 'total']" responsiveLayout="scroll"
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

<!--          <Column selection-mode="multiple"  style="font-size: 0.85em;"></Column>-->

          <Column field="company" header="Vendor" sortable style="font-size: 0.85em;"></Column>
          <Column field="invoice" header="Invoice#" sortable style="font-size: 0.85em;"></Column>
          <Column field="status" header="Status" sortable style="font-size: 0.85em;">
            <template #body="{data}">
              <span class="text-capitalize" :style="{color: data.status === 'returned' ? 'red' : 'green'}">
                <b>{{ data.status }}</b>
              </span>
            </template>
          </Column>
          <Column field="billDate" header="Bill Date" sortable  style="font-size: 0.85em;"></Column>
          <Column field="invoiceDue" header="Due Date" sortable  style="font-size: 0.85em;"></Column>
          <Column field="numberOfItems" header="Total Items" sortable  style="font-size: 0.85em;"></Column>
          <Column field="total" header="Total" sortable  style="font-size: 0.85em;">
            <template #body="{data}">
              {{ formatNumber(data.total) }}
            </template>
          </Column>
          <Column headerStyle="text-align: center" header="Return To Vendor" bodyStyle="text-align: center; overflow: visible"  style="font-size: 0.85em;">
            <template #body="{data}">
              <span title="Return to Vendor" @click="openReturnDialog(data.id, data.company)" style="cursor: pointer;" v-if="data.status === 'received'">
                <span class="pi pi-reply"></span>
              </span> &nbsp;
            </template>
          </Column>
          <Column headerStyle="text-align: center" header="View" bodyStyle="text-align: center; overflow: visible"  style="font-size: 0.85em;">
            <template #body="{data}">
              <span title="View Details" @click="showDetails(data.id)" style="cursor: pointer;">&#128064;</span> &nbsp;
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</div>

  <!--  Details Dialog -->
  <dialog ref="detailsDialog" style="min-width: 500px; border: 2px solid #ccc;">
    <button class="text-white bg-danger" style="float: right;" @click="detailsDialog.close()">X</button><br>

    <div class="container-fluid">
      <div class="row">
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
              Proceed if you are sure you want to reverse this document.
            </p>
            <div class="d-flex mb-3">
              <label><b>Return Date</b> <input type="date" class="form-control-dark p-1" v-model="returnData.date"></label>
            </div>
            <button name="submitBtn" type="submit" class="px-2 btn-dark">Proceed</button>
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

const purchases = ref([]);
const loading = ref(false);
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


//Get purchases
const getPurchases = async () => {
  try {

    loading.value = true;

   purchases.value = await db('purchases')
       .join('vendors', 'purchases.vendorId', '=', 'vendors.id')
       .leftJoin('billPayments', 'purchases.id', 'billPayments.purchaseId')
       .select('purchases.id', 'purchases.billDate', 'purchases.invoiceDue',
           'purchases.numberOfItems','purchases.invoice', 'purchases.total',
           'purchases.status', 'vendors.company')
       .groupBy('purchases.id')
       .orderBy('purchases.id', 'DESC').limit(200);

  }catch (e) { ipcRenderer.send("errorMessage", e.message) }
  finally { loading.value = false; }
} // ./Get purchases
getPurchases();



//Show details
const showDetails = async (id) => {
  try {
    details.value = await db('purchases')
        .join('purchaseDetails', 'purchases.id', '=', 'purchaseDetails.purchaseId')
        .select('purchases.invoice', 'purchases.total', 'purchaseDetails.productName',
            'purchaseDetails.cost', 'purchaseDetails.quantity', 'purchaseDetails.total as extCost'
        ).where('purchases.id', id)
    detailsDialog.value.showModal();
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
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
    // validation
    let validation = new Validator(returnData,{
      date: 'required'
    })

    if (validation.passes()) { // If validation passes
      e.target.submitBtn.disabled = true;


      await db.transaction( async trx => {
        const records = await trx('purchases')
            .join('purchaseDetails', 'purchases.id', '=', 'purchaseDetails.purchaseId')
            .select('purchaseDetails.productId', 'purchaseDetails.quantity')
            .where('purchases.id', returnData.id)


        //Batch update  products quantity
        for (const purchase of records) {
          await trx('products').where('id', purchase.productId).decrement('quantity', purchase.quantity)
        }

        // Set purchase status to returned
        await trx('purchases').where('id', returnData.id)
            .update({status: 'returned', returnedDate: returnData.date});


        // Update on front-end
        purchases.value.map(purchase => {
          if (purchase.id === returnData.id) purchase.status = "returned"
        })

        returnData.date = null;
        returnData.id = null;
        returnData.vendor = null;
        returnDialog.value.close();
      })

    }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`) //if Validation fails

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }finally { e.target.submitBtn.disabled = false }

}

</script>

<style scoped>

</style>