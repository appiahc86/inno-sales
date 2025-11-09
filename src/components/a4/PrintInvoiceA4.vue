<script setup>

import {formatNumber} from "@/functions";
import {computed} from "vue";
import {useStore} from "vuex";


const props = defineProps({

  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  invoiceDate: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  wholesale: {
    type: Boolean,
    required: false,
    default: false,
  }

});




const store = useStore();
const companySettings = computed(() => store.getters.setting); //get company settings
let cart = computed(() => store.getters["cartModule/cart"]); //Cart array
let subTotal = computed(() => store.getters["cartModule/subTotal"]); //get cart subTotal
let totalTax = computed(() => store.getters["cartModule/totalTax"]); //get total Tax
let total = computed(() => store.getters["cartModule/total"]); //get cart total
let totalDiscount = computed(() => store.getters["cartModule/totalDiscount"]); //get total discount

if (props.wholesale){
  cart = computed(() => store.getters["wholesaleCartModule/cart"]); //Cart array
  subTotal = computed(() => store.getters["wholesaleCartModule/subTotal"]); //get cart subTotal
  totalTax = computed(() => store.getters["wholesaleCartModule/totalTax"]); //get total Tax
  total = computed(() => store.getters["wholesaleCartModule/total"]); //get cart total
  totalDiscount = computed(() => store.getters["wholesaleCartModule/totalDiscount"]); //get total discount
}

</script>

<template>

  <div id="invoice-a4">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="margin: 0;">{{ companySettings.companyName }}</h2>
      <p style="margin: 0;">{{ companySettings.address }}</p>
      <p style="margin: 0;">{{ companySettings.contact }}</p>
      <h3 style="margin-top: 10px;">Credit Sales Invoice</h3>
    </div>

    <!-- Customer Details -->
    <div style="padding-bottom: 10px;">
      <h4 style="margin: 0;">Invoice To:</h4>
      <p style="margin: 5px 0;">Name: {{ name }}</p>
      <p style="margin: 5px 0;">Address: {{ address }}</p>
      <p style="margin: 5px 0;">Contact: {{ phone }}</p>
    </div>

    <div style="margin-bottom: 15px; float: right;">
      <p style="margin: 5px 0;">Invoice #: <b>{{ invoiceNumber }}</b></p>
      <p style="margin: 5px 0;">Invoice Date: {{ invoiceDate ? new Date(invoiceDate).toDateString(): '' }}</p>
      <p style="margin: 5px 0;">Due Date: {{ invoiceDate ? new Date(dueDate).toDateString(): '' }}</p>
    </div>

    <!-- Item Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
      <tr>
        <th style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">Item</th>
        <th style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">Qty</th>
        <th style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">Price</th>
        <th style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">Ext Price</th>
      </tr>
      </thead>
      <tbody>
      <template  v-for="item in cart">
        <tr>
          <td style="border: 1px solid #ccc; padding: 10px;">{{ item.productName }}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">{{ item.qty }}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: right;">{{ formatNumber(item.sellingPrice) }}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: right;">{{ formatNumber(item.sellingPrice * item.qty ) }}</td>
        </tr>
      </template>

      </tbody>
    </table>

    <!-- Summary -->
    <div style="text-align: right; margin-bottom: 20px;">
      <p style="margin: 5px 0;">Subtotal: GH¢ {{ formatNumber(subTotal) }}</p>
      <template v-if="totalTax">
        <p style="margin: 5px 0;">Tax: GH¢ {{ formatNumber(totalTax) }}</p> <br>
      </template>
      <template v-if="totalDiscount">
        <p style="margin: 5px 0;">Discount: GH¢ {{ formatNumber(totalDiscount) }}</p> <br>
      </template>
      <p style="margin: 5px 0; font-weight: bold;">Total: GH¢ {{ formatNumber(total) }}</p>
    </div>

    <!-- Footer -->
<!--    <div style="text-align: center; border-top: 1px solid #ccc; padding-top: 10px;">-->
<!--      <p style="margin: 0;">Thank you for your business!</p>-->
<!--      <p style="margin: 0;">Please make payments to avoid penalties.</p>-->
<!--    </div>-->

  </div>
</template>

<style scoped>

</style>