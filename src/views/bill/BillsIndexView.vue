<template>
<div class="container-fluid mt-3">
  <div class="row">
    <div class="col-12">

      <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow spinner-grow-sm"></span></h5>
      <h4 class="text-center" v-else>Outstanding Bills</h4>

      <h6 class="text-success mt-3">
        <span class="pi pi-info-circle fw-bold"></span>
        Right-click on a row to show the context menu.
      </h6>
      <div class="table-responsive">
        <DataTable
            :value="purchases" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
            filterDisplay="menu" :rows="10" v-model:filters="filters" @row-click="rowClicked"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedRecord"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['company', 'invoice']" responsiveLayout="scroll"
            contextMenu v-model:contextMenuSelection="selectedRow" @row-contextmenu="onRowContextMenu"
        >

          <template #header>
            <div class="d-flex justify-content-center align-items-center" style="height: 15px">
              <h6 class="px-3">Outstanding Bills</h6>
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

          <Column field="company" header="Vendor" sortable class="data-table-font-size"></Column>
          <Column field="invoice" header="Invoice#" sortable class="data-table-font-size"></Column>
          <Column field="billDate" header="Bill Date" sortable  class="data-table-font-size">
            <template #body="{data}">
              <td>{{ new Date(data.billDate).toLocaleDateString() }}</td>
            </template>
          </Column>
          <Column field="invoiceDue" header="Due Date" sortable  class="data-table-font-size">
            <template #body="{data}">
              <td>{{ new Date(data.invoiceDue).toLocaleDateString() }}</td>
            </template>
          </Column>
          <Column field="total" header="Total" sortable  class="data-table-font-size">
            <template #body="{data}">
              <td>{{ formatNumber(data.total) }}</td>
            </template>
          </Column>
          <Column header="Amount Due" sortable  class="data-table-font-size">
            <template #body="{data}">
              <b>{{ formatNumber(data.total - (data.totalPaid || 0)) }}</b>
            </template>
          </Column>
        </DataTable>
        <ContextMenu :model="menuModel" ref="cm" class="context-menu" style="font-size: 0.9em;" />
      </div>
    </div>
  </div>
</div>



  <!--  Payment Dialog Dialog -->
  <dialog ref="paymentHistoryDialog" style="min-width: 500px; border: 2px solid #ccc;">
    <button class="text-white bg-danger" style="float: right;" @click="closePaymentHistoryDialog">X</button><br>

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="table-responsive" v-if="paymentHistory.length" style="height: 300px;">
            <table class="table table-sm table-borderless table-striped table-hover">
              <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Note</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="rec in paymentHistory" :key="rec.id">
                <tr>
                  <td>{{ new Date(rec.date).toLocaleDateString() }}</td>
                  <td>{{ formatNumber(parseFloat(rec.amount)) }}</td>
                  <td>{{ rec.note }}</td>
                  <td>
                    <span class="pi pi-undo" @click="confirmUndo(rec.id, rec.purchaseId, rec.amount)"
                           title="Undo This Transaction" style="cursor: pointer;">
                      </span>
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
            <h5>Total Paid: <span class="text-danger">{{ formatNumber(paymentHistoryTotal) }}</span></h5>
          </div>
          <div class="text-center" v-else><h5>No Payment Has Been Recorded</h5></div>
        </div>
      </div>
    </div>
  </dialog>

</template>

<script setup>
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {computed, ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import {useRouter} from "vue-router";

const selectedRecord = ref();
const purchases = ref([]);
const loading = ref(false);
const router = useRouter();
const paymentHistory = ref([]);
const paymentHistoryDialog = ref(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


//For row context menu
const cm = ref();
const menuModel = ref([
  {label: 'View Payment History', icon: 'pi pi-eye', command: () => showHistory(selectedRow.value.id), class: 'fw-bold'},
  {separator: true},
  {label: 'Make Payment', icon: 'pi pi-money-bill', command: () => goToPaymentPage(selectedRow.value), class: 'fw-bold'}
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
        .innerJoin('vendors', 'purchases.vendorId', '=', 'vendors.id')
        .leftJoin('billPayments', 'purchases.id', 'billPayments.purchaseId')
        .select('purchases.id', 'purchases.billDate', 'purchases.invoiceDue',
            'purchases.invoice', 'purchases.total', 'vendors.company')
        .sum('billPayments.amount as totalPaid')
        .where('purchases.status', 'received')
        .groupBy('purchases.id')
        .havingRaw('?? > ?', ['purchases.total',  db.raw('coalesce(sum(billPayments.amount), 0)'  )] )
        .orderBy('purchases.id', 'DESC')
        .limit(150)


  }catch (e) { ipcRenderer.send("errorMessage", e.message) }
  finally { loading.value = false; }
}
getPurchases(); // ./Get purchases


//Go to payment page
const goToPaymentPage = ({id, company, invoice,  total, totalPaid, invoiceDue}) => {
  const amountDue = parseFloat(total) - (totalPaid ? parseFloat(totalPaid) : 0);
  router.push({name: 'pay-bill', params: {purchaseId: id, company, invoice, amountDue, invoiceDue}})
}

// show payment history
const showHistory = async (purchaseId) => {
  try {
    paymentHistory.value = [];
    paymentHistory.value = await db('billPayments').where('purchaseId', purchaseId)
        .orderBy('id', 'DESC')
        .limit(100);
    paymentHistoryDialog.value.showModal();
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }

}

//payment history total
const paymentHistoryTotal = computed(() => {
  let total = 0;
  if (paymentHistory.value.length){
    for (const record of paymentHistory.value) {
      total += parseFloat(record.amount)
    }
  }
  return total;
})


//close payment history dialog
const closePaymentHistoryDialog = () => {
  paymentHistoryDialog.value.close();
}

          //..................Undo payment transaction....................
const confirmUndo = (id, purchaseId, amount) => {
  ipcRenderer.send(
      'confirm',
      {
        id: {id, purchaseId, amount },
        type: 'undoBillPayment',
        message: 'This action will reverse this transaction. \n Are you sure you want to proceed?'
        }
      )
}

ipcRenderer.on('undoBillPayment', async (event, args) => {

  try {
    //Remove record from billPayments Table
    await db('billPayments').where('id', args.id).first().del();


    //Update in front-end
    paymentHistory.value = paymentHistory.value.filter(history => history.id !== args.id)

    for (const purchase  of purchases.value) {
      if (purchase.id === args.purchaseId) {
        purchase.totalPaid = parseFloat(paymentHistoryTotal.value);
        break;
      }
    }



  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
})



</script>

<style scoped>

</style>