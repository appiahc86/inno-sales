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
          <h5 class="text-center">{{ company }}</h5>
          <h6 class="text-center">Due Date: {{ new Date(invoiceDue).toDateString() }}</h6>
          <hr>
          <div class="d-flex">
            <h6>Invoice#: {{ invoice }}</h6>
            <h6 class="text-danger mx-auto">Amount Due: {{ amountDue ? formatNumber(parseFloat(amountDue)) : '' }}</h6>
          </div>


          <div class="d-flex mt-3">
            <label>
              <b :class="formData.date ? '' : 'blink'">DATE &nbsp;</b>
              <input type="date" class="form-control-dark p-1" v-model="formData.date">
            </label>
            <label class="mx-auto">
              <b>AMT TO PAY </b>
              <input type="number" step="any" min="0" :max="amountDue"
                     class="form-control-dark p-1" v-model.number="formData.amount">
            </label>
          </div>

          <div class="text-center my-3">
            <label style="float: left;" class="w-50"><b>Note </b>
              <textarea cols="10" rows="2" v-model="formData.note" placeholder="Note" maxlength="254"
               class="form-control-dark w-100"></textarea>
            </label>
            <br><button type="submit" name="submitBtn" :disabled="!formData.date || !formData.amount"
                class="text-center mt-2" style="width: 90px;">
              <span class="pi pi-money-bill"></span>
              Pay
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";
import moment from "moment/moment";

const route = useRoute();
const router = useRouter();

const purchaseId = ref(null);
const company = ref(null);
const invoice = ref(null);
const amountDue = ref(0);
const invoiceDue = ref(null);

const formData = reactive({
  amount: 0,
  date: '',
  note: ''
})

onMounted(() => {
  purchaseId.value = route.params.purchaseId;
  company.value = route.params.company;
  invoice.value = route.params.invoice;
  amountDue.value = parseFloat(route.params.amountDue);
  invoiceDue.value = parseInt(route.params.invoiceDue);
  formData.amount = parseFloat(route.params.amountDue);
})


//Go Back to previous page
const goBack = () => router.go(-1);


        //................Payment..................
const pay = async (e) => {

  try {
     e.target.submitBtn.disabled = true;

    await db.transaction( async trx => {

       await trx('billPayments').insert({ // Save to billPayments table
        purchaseId: purchaseId.value,
        date: moment(formData.date).format("YYYY-MM-DD hh:mm:ss"),
        amount: parseFloat(formData.amount),
        note: formData.note
      })

    })

    //Go back to previous page
    goBack();

  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
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