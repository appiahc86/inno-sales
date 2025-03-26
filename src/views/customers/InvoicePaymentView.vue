<template>
  <div class="container-fluid">
    <button class="bg-danger text-white float-end"
            style="width: 30px; height: 30px; font-size: 1.2em;" @click="goBack" title="Close">
      <b>X</b>
    </button>
    <div class="row justify-content-center">

      <div class="col-6 form-cover">
        <div class="card shadow p-3">
          <form @submit.prevent="pay">
            <h5 class="text-center">{{ name }}</h5>
            <h6 class="text-center">{{ phone }}</h6>
            <h6 class="text-center">Due Date: {{ payments?.dueDate ? moment(payments.dueDate).format('MM-DD-YYYY') : '' }}</h6>
            <hr>
            <h6 class="text-success">Total: {{ formatNumber(parseFloat(total)) }}</h6>
            <div class="">
              <h6>Invoice#: {{ invoiceNumber }}</h6>
              <h6 class="text-danger mx-auto">Amount Due: {{ amountDue ? formatNumber(parseFloat(amountDue)) : '' }}</h6>
            </div>

            <label v-if="account">
              <input type="checkbox" class="p-checkbox" v-model="useCreditBalance">
              &nbsp; <b>Use Credit Balance ({{ formatNumber(account) }})</b>
            </label>

            <div class="d-flex mt-3">
              <label class="me-3">
                <b :class="formData.date ? '' : 'blink'">DATE &nbsp;</b>
                <input type="date" class="form-control-dark p-1" v-model="formData.date">
              </label>


              <label class="">
                <b> Amount </b>
                <input type="number" step="any" min="0" class="form-control-dark p-1"
                        v-model.number="formData.amount" oninput="validity.valid||(value = 0);">
              </label>

              <label class="">
                <b>Receipt # </b>
                <input type="text" maxlength="100" class="form-control-dark p-1"
                       v-model.trim="formData.receiptNumber" required>
              </label>
            </div>

            <div class="text-center my-3">
              <label style="float: left;" class="w-50"><b>Note </b>
                <textarea cols="10" rows="2" v-model="formData.note" placeholder="Note" maxlength="254"
                          class="form-control-dark w-100"></textarea>
              </label>
              <br><button type="submit" name="submitBtn" class="text-center mt-2" style="width: 90px;"
                          :disabled="!formData.date || formData.amount < 0 || !formData.receiptNumber"
                         >
              <span class="pi pi-money-bill"></span>
              Pay
            </button>

              <br>
              <h5>Total Paying:
                <b>{{ useCreditBalance ? formData.amount + account : formData.amount }}</b>
              </h5>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";
import moment from "moment/moment";

const route = useRoute();
const router = useRouter();

const id = ref(null);
const orderDate = ref(null);
const total = ref(0);
const payments = ref(null);
const name = ref('');
const phone = ref('');
const account = ref(0);
const customerId = ref('');
const invoiceNumber = ref('');

const useCreditBalance = ref(false)


const formData = reactive({
  amount: 0,
  date: '',
  note: '',
  receiptNumber: ''
})


const resetData = () => {
  id.value = route.params.id;
  invoiceNumber.value = route.params.invoiceNumber;
  orderDate.value = route.params.orderDate;
  total.value = route.params.total;
  payments.value = JSON.parse(route.params.payments);
  name.value = route.params.name;
  phone.value = route.params.phone;
  account.value = route.params.account ? parseFloat(route.params.account) : 0;
  customerId.value = route.params.customerId;
}

onMounted(() => {
resetData();
})

//Calculate Amount Due
const amountDue = computed( () => {
  let amount = 0;
  if (payments?.value?.payments?.length){
    for (const payment of payments.value.payments) {
      amount += parseFloat(payment.amount)
    }
  }

  amount = total.value - amount;
  formData.amount = amount;
  return amount;
});


//Go Back to previous page
const goBack = () => router.go(-1);


//................Payment..................
const pay = async (e) => {

  try {
    e.target.submitBtn.disabled = true;
    let isPaid = false;

    await db.transaction( async trx => { // Transaction begins


      if (!formData.amount) formData.amount = 0;
      let totalPaying = formData.amount;
      if (useCreditBalance.value) totalPaying += parseFloat(account.value);
      if (!useCreditBalance.value && formData.amount <= 0) //If amount input value is empty
        return ipcRenderer.send("errorMessage", "Please Enter Amount")

      let creditBalance = account.value //will save it in customers table (account)


      if (useCreditBalance.value) //if adding credit balance to amount paying
      {
        if (totalPaying > amountDue.value) creditBalance = totalPaying - amountDue.value;
        else creditBalance = 0;

      }else if (!useCreditBalance.value) { //If not using credit balance in payment
        if (totalPaying > amountDue.value)  creditBalance += totalPaying - amountDue.value;
      }



      payments.value.payments.unshift({
        id: moment().format('YYYYMMDDHHssSSS'),
        receiptNumber: formData?.receiptNumber?.toUpperCase(),
        amount: totalPaying,
        date: moment(formData.date).format("YYYY-MM-DD hh:mm:ss"),
        note: formData.note,
        creditBalance: useCreditBalance.value ? account.value : 0
      })

      if (amountDue.value <= 0) isPaid = true;


      let tendered = 0;
      if (amountDue.value <= 0) tendered = total.value
      else tendered = total.value - amountDue.value;


      // console.log('c-balance',creditBalance)
      // return console.log('tendered',tendered)

      // Update orders table
      await trx("orders")
          .where("id", id.value)
          .update({
            payments: JSON.stringify(payments.value),
            isPaid: isPaid,
            tendered
          })

      //Update Customers account in customers table
      await trx("customers")
          .where("id", customerId.value)
          .update({account: parseFloat(creditBalance)})


      //Go back to previous page
      goBack();



    }) // ./Transaction ends



  }catch (e) {
    resetData();
    ipcRenderer.send('errorMessage', e.code);
  }
  finally {  e.target.submitBtn.disabled = false; }

}

</script>

<style scoped>
.form-cover{
  position: absolute;
  top: 10%;
}
.card{
  max-width: 600px;
}
</style>