<script setup>

import {formatNumber} from "@/functions";
import {computed} from "vue";
import {useStore} from "vuex";
import moment from "moment/moment";

const store = useStore();
const companySettings = computed(() => store.getters.setting); //get company settings
const cart = computed(() => store.getters["cartModule/cart"]); //Cart array
const subTotal = computed(() => store.getters["cartModule/subTotal"]); //get cart subTotal
const totalTax = computed(() => store.getters["cartModule/totalTax"]); //get total Tax
const total = computed(() => store.getters["cartModule/total"]); //get cart total
const totalDiscount = computed(() => store.getters["cartModule/totalDiscount"]); //get total discount



defineProps({

  invoiceDate: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  }
});



</script>

<template>

  <div id="proforma-roll">
    <div>


      <h3 style="text-align: center; font-size: 14px">PROFORMA INVOICE</h3>

      <div style="line-height: 20px; font-size: 12px">
        <p>
          <b>Bill From</b><br>
          Name: <b>{{ companySettings.companyName }}</b><br>
          Address: {{ companySettings.address }}<br>
          Phone: {{ companySettings.contact }}<br>
        </p>
      </div>


      <div style="line-height: 20px; font-size: 12px">
        <p>
          <b>Bill To</b><br>
          Name: {{ name }}<br>
          Address: {{ address }}<br>
          Phone: {{ phone }}<br>
        </p>
      </div>


      <div style="line-height: 20px; font-size: 12px">
        <p>
          Invoice#: {{  "P-" + moment().format('YYYYMMDDHHssSSS') }}<br>
          InvoiceDate: {{ invoiceDate ? new Date(invoiceDate).toDateString(): '' }}<br>
          Phone: {{ phone }}<br>
          DueDate: {{ dueDate ? new Date(dueDate).toDateString(): '' }}
        </p>
      </div>


      <table style="width: 100%; font-size: 11px;">
        <thead>
        <tr style="border-bottom: 1px solid black; text-align: left; border-bottom: 1px solid black;">
          <th style="width: 40%;">Item</th>
          <th style="width: 10%;">Qty</th>
          <th style="width: 20%;">Price</th>
          <th style="width: 30%;">Ext Price</th>
        </tr>
        </thead>

        <tbody>
        <template v-for="item in cart">
          <tr style="text-align: left;">
            <td>{{ item.productName }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ formatNumber(item.sellingPrice) }}</td>
            <td>{{ formatNumber(item.sellingPrice * item.qty ) }}</td>
          </tr>
        </template>
        </tbody>
      </table>
      <hr>

      <div style="font-size: 12px !important">
        <div style="float: right;">Subtotal: GH¢ {{ formatNumber(subTotal) }}</div> <br>
        <template v-if="totalTax">
          <div style="float: right;">Tax: GH¢ {{ formatNumber(totalTax) }}</div> <br>
        </template>
        <template v-if="totalDiscount">
          <div style="float: right;">Discount: GH¢ {{ formatNumber(totalDiscount) }}</div> <br>
        </template>
        <div style="float: right;"><b>TOTAL: GH¢ {{ formatNumber(total) }}</b></div>
      </div><br>

    </div>
  </div>

</template>

<style scoped>

</style>