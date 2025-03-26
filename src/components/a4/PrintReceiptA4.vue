<script setup>

import {formatNumber} from "@/functions";
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore();
const companySettings = computed(() => store.getters.setting); //get company settings
const cart = computed(() => store.getters["cartModule/cart"]); //Cart array
const subTotal = computed(() => store.getters["cartModule/subTotal"]); //get cart subTotal
const totalTax = computed(() => store.getters["cartModule/totalTax"]); //get total Tax
const total = computed(() => store.getters["cartModule/total"]); //get cart total
const totalDiscount = computed(() => store.getters["cartModule/totalDiscount"]); //get total discount




defineProps({

  tendered: {
    type: Number,
    required: true,
  },
  change: {
    type: Number,
    required: true,
  },
  barcode: {
    type: Number,
    required: true,
  }
});


</script>

<template>

  <div id="receipt-a4">
    <div>
      <div class="mt-0" style="font-size: 11.5px;">
        <span>{{ new Date().toLocaleString() }}</span>
        <b style="float: right;">Receipt #{{ barcode }}</b>
      </div>
      <div  style="font-size: 12px;">Store: {{ companySettings.storeName }}</div>

      <div style="text-align: center;">
        <div style="font-size: 13px"><b>{{ companySettings.companyName }}</b></div>
        <div style="font-size: 11.5px">{{ companySettings.address }}</div>
        <div style="font-size: 11.5px">{{ companySettings.contact }}</div>
      </div>



      <br>
      <table style="width: 100%; font-size: 11.5px;">
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
        <div style="float: right;"><b>RECEIPT TOTAL: GH¢ {{ formatNumber(total) }}</b></div>
      </div><br>


      <div style="font-size: 12.5px;">Amount Tendered: GH¢ {{ formatNumber(tendered) }}</div>
      <div style="font-size: 12.5px;">Change Given: GH¢ {{ formatNumber(change) }}</div>

      <div style="font-size: 11.5px; text-align: center;">Thanks for shopping with us!</div>

      <div  style="text-align: center;">
        <svg id="barcode"></svg>
      </div>

<!--      <div style="font-size: 11px; text-align: center;">-->
<!--        Software by <span class="fw-bold mt-2">Appiah</span> 0242740320</div>-->

    </div>
  </div>

</template>

<style scoped>

</style>