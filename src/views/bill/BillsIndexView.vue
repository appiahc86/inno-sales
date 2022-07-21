<template>
<div class="container-fluid mt-3">
  <div class="row">
    <div class="col-12">

      <h4 class="text-center">List Of Outstanding Bills</h4>

      <div class="table-responsive">
        <DataTable
            :value="purchases" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
            filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['company', 'invoice']" responsiveLayout="scroll">

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
          <template #loading>
            <h4 class="text-white"> Loading data. Please wait.</h4>
          </template>

          <Column field="company" header="Vendor" sortable style="font-size: 0.85em;"></Column>
          <Column field="invoice" header="Invoice#" sortable style="font-size: 0.85em;"></Column>
          <Column field="billDate" header="Bill Date" sortable  style="font-size: 0.85em;">
            <template #body="{data}">
              <td>{{ new Date(data.billDate).toLocaleDateString() }}</td>
            </template>
          </Column>
          <Column field="invoiceDue" header="Due Date" sortable  style="font-size: 0.85em;">
            <template #body="{data}">
              <td>{{ new Date(data.invoiceDue).toLocaleDateString() }}</td>
            </template>
          </Column>
          <Column field="total" header="Total" sortable  style="font-size: 0.85em;">
            <template #body="{data}">
              <td>{{ formatNumber(data.total) }}</td>
            </template>
          </Column>
          <Column header="Amount Due" sortable  style="font-size: 0.85em;">
            <template #body="{data}">
              <b>{{ formatNumber(data.total - data.totalPaid) }}</b>
            </template>
          </Column>
          <Column headerStyle="text-align: center" header="View Payments" bodyStyle="text-align: center; overflow: visible"  style="font-size: 0.85em;">
            <template #body="{data}">
              <span title="View Payment History" @click="showHistory(data.id)" style="cursor: pointer;">
                <span class="pi pi-eye-slash"></span>
              </span> &nbsp;
            </template>
          </Column>
          <Column headerStyle="text-align: center" header="Pay Bill" bodyStyle="text-align: center; overflow: visible"  style="font-size: 0.85em;">
            <template #body="{data}">
              <span title="Make Payment" @click="goToPaymentPage(data)" style="cursor: pointer;">
               <span class="pi pi-money-bill"></span>
              </span> &nbsp;
            </template>
          </Column>
        </DataTable>
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


const purchases = ref([]);
const loading = ref(false);
const router = useRouter();
const paymentHistory = ref([]);
const paymentHistoryDialog = ref(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});



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
        .havingRaw('?? > ?', ['purchases.total',  db.raw('coalesce(sum(billPayments.amount), 0)'  )] )
        .groupBy('purchases.id')
        .orderBy('purchases.id', 'DESC')


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
        .orderBy('id', 'DESC');
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
// return console.log(parseFloat(args.amount))
  try {
    await db.transaction( async trx => {
    //Remove record from billPayments Table
    await trx('billPayments').where('id', args.id).del();
    })

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