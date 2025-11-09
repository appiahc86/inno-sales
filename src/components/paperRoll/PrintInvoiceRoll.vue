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

// const barcode = computed(() => store.getters["cartModule/barcode"]);
if (props.wholesale){
  cart = computed(() => store.getters["wholesaleCartModule/cart"]); //Cart array
  subTotal = computed(() => store.getters["wholesaleCartModule/subTotal"]); //get cart subTotal
  totalTax = computed(() => store.getters["wholesaleCartModule/totalTax"]); //get total Tax
  total = computed(() => store.getters["wholesaleCartModule/total"]); //get cart total
  totalDiscount = computed(() => store.getters["wholesaleCartModule/totalDiscount"]); //get total discount
}

</script>

<template>

  <div id="invoice-roll">
    <div>
      <div  style="font-size: 12px;">Store: {{ companySettings.storeName }}</div>

      <div style="text-align: center;">
        <div style="font-size: 13px"><b>{{ companySettings.companyName }}</b></div>
        <div style="font-size: 11px">{{ companySettings.address }}</div>
        <div style="font-size: 11px">{{ companySettings.contact }}</div>
      </div>

      <p style="font-size: 11px">
        <b>Invoice To</b><br>
        {{ name }}<br>
        {{ address }}<br>
        {{ phone }}
      </p>

      <p style="float: right; font-size: 11px;">
        Invoice#: {{ invoiceNumber }} <br>
        Date: {{ invoiceDate ? new Date(invoiceDate).toDateString(): '' }} <br>
        Due Date: {{ dueDate ? new Date(dueDate).toDateString(): '' }}
      </p>



      <br>
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


<!--      <div style="font-size: 11px; text-align: center;">Thanks for shopping with us!</div>-->

<!--      <div  style="text-align: center;">-->
<!--        <svg id="barcode"></svg>-->
<!--      </div>-->

      <!--        <div style="font-size: 11px; text-align: center;">-->
      <!--          Software by <span class="fw-bold mt-2">Appiah</span> 0242740320</div>-->

    </div>
  </div>

</template>

<style scoped>

</style>