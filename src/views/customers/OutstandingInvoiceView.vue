<template>
  <div class="container-fluid mt-3">
    <div class="row">
      <div class="col-12">

        <h5 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow spinner-grow-sm"></span></h5>
        <h4 class="text-center" v-else>Outstanding Invoices</h4>

        <h6 class="text-success mt-3">
          <span class="pi pi-info-circle fw-bold"></span>
          Right-click on a row to show the context menu.
        </h6>
        <div class="table-responsive">
          <DataTable
              :value="invoices" :paginator="true" dataKey="id"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10" v-model:filters="filters" @row-click="rowClicked"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedRecord"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['name', 'phone', 'invoiceNumber']" responsiveLayout="scroll"
              contextMenu v-model:contextMenuSelection="selectedRow" @row-contextmenu="onRowContextMenu"
          >

            <template #header>
              <div class="d-flex justify-content-center align-items-center" style="height: 15px">
                <h6 class="px-3">Outstanding Invoices</h6>
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

            <Column field="name" header="Customer" sortable class="data-table-font-size"></Column>
            <Column field="phone" header="Phone#" sortable class="data-table-font-size"></Column>
            <Column field="invoiceNumber" header="Invoice#" sortable class="data-table-font-size"></Column>

            <Column field="orderDate" header="Invoice Date" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.orderDate).toLocaleDateString() }}</td>
              </template>
            </Column>
            <Column field="dueDate" header="Due Date" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ new Date(data.dueDate).toLocaleDateString() }}</td>
              </template>
            </Column>

            <Column field="total" header="Total" sortable  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ formatNumber(data.total) }}</td>
              </template>
            </Column>

            <Column header="Amount Due" sortable  class="data-table-font-size">
              <template #body="{data}">
                <b>{{ formatNumber(data.amountDue) }}</b>
              </template>
            </Column>
          </DataTable>
          <ContextMenu :model="menuModel" ref="cm" class="context-menu" style="font-size: 0.9em;" />
        </div>
      </div>
    </div>
  </div>



  <!--  Payment history Dialog -->
  <dialog ref="paymentHistoryDialog" style="min-width: 500px; border: 2px solid #ccc;">
    <button class="text-white bg-danger" style="float: right;" @click="closePaymentHistoryDialog">X</button><br>

    <div class="container-fluid">
      <div class="p-5" v-if="detailsLoading">
        <h5 class="text-center">Loading... <span class="spinner-border spinner-border-sm"></span></h5>
      </div>
      <div class="row" v-else>
        <div class="col">
          <div class="table-responsive" v-if="paymentHistory.length" style="height: 300px;">
            <table class="table table-sm table-borderless table-striped table-hover">
              <thead>
              <tr>
                <th>Receipt#</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Note</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="rec in paymentHistory" :key="rec.id">
                <tr>
                  <td>{{ rec?.receiptNumber }}</td>
                  <td>{{ new Date(rec.date).toLocaleDateString() }}</td>
                  <td>{{ formatNumber(parseFloat(rec.amount)) }}</td>
                  <td>{{ rec.note }}</td>
                  <td>
                    <span class="pi pi-undo" @click="confirmUndo({id: rec.id, amount: rec.amount})"
                          title="Undo This Transaction" style="cursor: pointer;">
                      </span>
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
            <h5>Total Paid: <span class="">{{ formatNumber(paymentHistoryTotal.totalPaid) }}</span></h5>
            <h5>Amount Due: <span class="text-danger">{{ formatNumber(paymentHistoryTotal.amountDue) }}</span></h5>
          </div>
          <div class="text-center" v-else><h5>No Payment Has Been Recorded</h5></div>
        </div>
      </div>
    </div>
  </dialog>

<!--  Delete Dialog-->
  <dialog ref="deleteDialog" style="max-width: 500px; border: 2px solid #ccc;">
    <div class="container">
      <div class="row">
        <div class="col">
          <form @submit.prevent="deleteRecord">
            <h5>Delete sale</h5>
            <p>
              This action will remove this sale and all payments made if available.<br>
              Are you sure you want to Proceed?.
            </p>
            <!--            <div class="d-flex mb-3">-->
            <!--              <label><b>Return Date</b> <input type="date" class="form-control-dark p-1" v-model="returnData.date"></label>-->
            <!--            </div>-->
            <button name="submitBtn" type="submit" class="px-2 btn-danger"
                    style="outline: none !important;">Proceed
              <span class="spinner-border spinner-border-sm" v-if="loading"></span></button>
<!--            <button name="submitBtn" type="submit" class="px-2 btn-danger"-->
<!--                    style="outline: none !important;">Proceed</button>-->
            <button type="button" class="float-end px-2 btn-secondary"
                    @click="deleteDialog.close()" :disabled="loading">Cancel</button>

          </form>
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
import {useStore} from "vuex";

const selectedRecord = ref();
const invoices = ref([]);
const loading = ref(false);
const detailsLoading = ref(false);
const router = useRouter();
const paymentHistory = ref([]);
const paymentHistoryDialog = ref(null);
const deleteDialog = ref(null);

const store = useStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


//For row context menu
const cm = ref();
const menuModel = ref([
  {label: 'View Payment History', icon: 'pi pi-eye', command: () => showHistory(selectedRow.value), class: 'fw-bold'},
  {separator: true},
  {label: 'Accept Payment', icon: 'pi pi-money-bill', command: () => goToPaymentPage(selectedRow.value), class: 'fw-bold'},
  {separator: true},
  {label: 'Remove This Record', icon: 'pi pi-trash', command: () => deleteDialog.value.showModal(), class: 'fw-bold'},

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


//Get invoices
const getInvoices = async () => {
  try {

    loading.value = true;

    invoices.value = await db('orders')
        .leftJoin('customers', 'orders.customerId', '=', 'customers.id')
        .select('orders.id', 'orders.invoiceNumber', 'orders.orderDate', 'orders.total', 'orders.tendered',
            'orders.payments', 'orders.invoiceNumber', 'customers.name', 'customers.phone',
        'customers.id as customerId', 'customers.account')
        .where('orders.isPaid', false)

    //if Records found
    if (invoices.value.length){
      invoices.value.map((item) => {
        item.payments = JSON.parse(item.payments);
        item.dueDate = item.payments.dueDate;
        item.amountDue = 0;

        //Calculate Amount due
        if (item.payments.payments.length){
          for (const itemElement of item.payments.payments) {
            item.amountDue += itemElement.amount;
          }
        }

        item.amountDue = item.total - item.amountDue;

      })
    }  //./if Records found


  }catch (e) { ipcRenderer.send("errorMessage", e.message) }
  finally { loading.value = false; }
}
getInvoices(); // ./Get Invoices

//Go to payment page
const goToPaymentPage = ({id, invoiceNumber, orderDate, total, payments, name, phone, customerId, account}) => {
  router.push({
        name: 'invoice-payment',
        params: {
          id,
          invoiceNumber,
          orderDate,
          total,
          payments: JSON.stringify(payments),
          name,
          phone,
          account,
          customerId
        }
      });

}

// show payment history
const showHistory = async (data) => {
  try {

    paymentHistory.value = [];
    paymentHistoryDialog.value.showModal();
    detailsLoading.value = true;

    paymentHistory.value = data.payments.payments;
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }finally {
    detailsLoading.value = false;
  }

}

//payment history total
const paymentHistoryTotal = computed(() => {
  let totalPaid = 0;
  if (paymentHistory.value.length){
    for (const record of paymentHistory.value) {
      totalPaid += parseFloat(record.amount)
    }
  }
  return {totalPaid, amountDue: selectedRecord.value.total - totalPaid};
})


//close payment history dialog
const closePaymentHistoryDialog = () => {
  paymentHistoryDialog.value.close();
}

//..................Undo payment transaction....................
const confirmUndo = (data) => {

  ipcRenderer.send(
      'confirm',
      {
        id: data,
        type: 'undoCustomerPayment',
        message: 'This action will reverse this transaction. \n Are you sure you want to proceed?'
      }
  )
}

ipcRenderer.on('undoCustomerPayment', async (event, args) => {

  try {


    let customerAccount = selectedRecord.value.account;

    //get credit balance from payment
    let creditBalance = 0;
    for (const p of paymentHistory.value) {
      if (p.id.toString() === args.id.toString()) {
        creditBalance = parseFloat(p.creditBalance);
        break;
      }
    }

    paymentHistory.value = paymentHistory.value.filter(history => history.id !== args.id)

    let record;
    invoices.value.map((invoice) => {
      if (invoice.id === selectedRecord?.value?.id){
        invoice.payments.payments = paymentHistory.value;
        record = invoice;
      }
    })

    if (record){

    //update in DB
    await db.transaction( async trx => { // Transaction begins

      await trx("orders") //Update in orders table
          .where('id', selectedRecord.value.id)
          .update({
            payments: JSON.stringify(record.payments),
            tendered: paymentHistoryTotal.value.totalPaid
          })

      //If credit balance was used, update customers account
      await trx("customers")
          .where('id', selectedRecord.value.customerId)
          .update({account: creditBalance + customerAccount });

      // Update customer account in frontend
      invoices.value.map(inv => {
        if (inv.customerId === selectedRecord.value.customerId) {
          inv.account = (creditBalance + customerAccount)
        }
      })

      //Update payment history in frontend
      let paid = 0;
      for (const p of paymentHistory.value) {
        paid += p.amount;
      }

      invoices.value.map((invoice) => {
        if (invoice.id === selectedRecord?.value?.id){
          invoice.amountDue = invoice.total - paid;
        }
      })

    }) // ./Transaction Ends

    }


  }catch (e) {
    console.log(e)
    ipcRenderer.send('errorMessage', e.message)
  }
})

//Delete Record
const deleteRecord = async (e) => {
  try {
    loading.value = true;
    e.target.submitBtn.disabled = true;

    await db.transaction( async trx => {

      const records = await trx('orderDetails')
          .where('orderId', selectedRecord.value.id)
          .select('productId', 'quantity')

      //Batch update  products quantity
      for (const rec of records) {
        await trx('products').where('id', rec.productId).first().increment('quantity', rec.quantity)
      }

      //Delete record
      await trx('orders').where('id', selectedRecord.value.id).del();


      //dispatch qty to vuex store products
      for (const ret of records) {
        store.dispatch("productsModule/modifyQty", {id: ret.productId, qty: ret.returnQty, type: 'increment'});
      }

      //close dialog
      deleteDialog.value.close();

      //update in frontend
      invoices.value = invoices.value.filter(inv => inv.id !== selectedRecord.value.id);

    })


  }catch (e) { ipcRenderer.send("errorMessage", e.message) }
  finally {
    e.target.submitBtn.disabled = false;
    loading.value = false;
  }
}

</script>

<style scoped>

</style>