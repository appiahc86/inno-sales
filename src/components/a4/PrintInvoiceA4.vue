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
  }
});


</script>

<template>

  <div id="invoice-a4">
    <div class="invoice-container">
      <div class="header">
        <h1>INVOICE</h1>
      </div>
      <!-- Two Columns Section -->
      <div class="two-columns">
        <div>
          <h3><strong>{{ companySettings.companyName }}</strong></h3>
          <p>
            {{ companySettings.address }}<br>
            {{ companySettings.contact }}
          </p>
        </div>
        <div>
          <p><strong>Billed To</strong></p>
          <p>
            {{ name }}<br>
            {{ address }}<br>
            {{ phone }}
          </p>

        </div>
      </div>
      <!-- Three Columns Section -->
      <div class="three-columns">
        <div>
          <p><strong>Invoice #:</strong></p>
          <p>{{ invoiceNumber }}</p>
        </div>
        <div>
          <p><strong>Date:</strong></p>
          <p>{{ invoiceDate ? new Date(invoiceDate).toDateString(): '' }}</p>
        </div>
        <div>
          <p><strong>Due Date:</strong></p>
          <p>{{ dueDate ? new Date(dueDate).toDateString(): '' }}</p>
        </div>
      </div>
      <!-- Table Section -->
      <table>
        <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Ext Price</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="item in cart">
          <tr>
            <td>{{ item.productName }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ formatNumber(item.sellingPrice) }}</td>
            <td>{{ formatNumber(item.sellingPrice * item.qty ) }}</td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="totals">
        <p><strong>Subtotal:</strong> GH¢ {{ formatNumber(subTotal) }}</p>
        <template v-if="totalTax">
          <p><strong>Tax:</strong> GH¢ {{ formatNumber(totalTax) }}</p>
        </template>
        <template v-if="totalDiscount">
          <p><strong>Discount:</strong> GH¢ {{ formatNumber(totalDiscount) }}</p>
        </template>
        <p><strong>Total:</strong> GH¢ {{ formatNumber(total) }}</p>
      </div>

    </div>
  </div>

</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}
.invoice-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
}
.header {
  text-align: center;
  margin-bottom: 30px;
}
.header h1 {
  margin: 0;
}
.two-columns,
.three-columns {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.two-columns div,
.three-columns div {
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  flex: 1;
}
.two-columns div + div {
  margin-left: 20px;
}
.three-columns div + div {
  margin-left: 20px;
}
.three-columns div {
  flex-basis: 30%;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
table th, table td {
  padding: 10px;
  border: 1px solid #ddd;
}
table th {
  background: #f4f4f4;
}

.totals {
  text-align: right;
}
</style>