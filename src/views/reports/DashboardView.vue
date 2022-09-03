<template>
<div class="container-fluid">

  <div class="row mb-3">

    <h4 class="text-black-50 my-3"><b>DASHBOARD</b></h4>
            <!--Products-->
    <div class="col-3">
      <div class="card shadow h-100 py-2 border-primary border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-primary mb-1" style="font-size: 0.9em;">PRODUCTS COUNT</div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold" v-else>&nbsp; {{ totalProducts.toLocaleString() }}</div>
            </div>
            <div class="col-auto">
              <span class="text-black-50" style="font-size: 250%">&#128290;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
                  <!-- Purchases -->
    <div class="col-3">
      <div class="card shadow h-100 py-2 border-warning border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold mb-1" style="font-size: 0.9em; color: darkgoldenrod">ANNUAL PURCHASES </div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold" v-else>GH¢ {{ formatNumber(totalPurchases) }}</div>
            </div>
            <div class="col-auto">
              <span class="" style="font-size: 250%">&#128179;</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="col-3">
      <div class="card shadow h-100 py-2 border-danger border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-danger mb-1" style="font-size: 0.9em;">OUTSTANDING BILLS</div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold" v-else>GH¢ {{ formatNumber(outstandingBillsTotal) }}</div>
            </div>
            <div class="col-auto">
              <span style="font-size: 250%">&#128176;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

                   <!-- Annual Sales -->
    <div class="col-3">
      <div class="card shadow h-100 py-2 border-success border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-success mb-1" style="font-size: 0.9em;">ANNUAL SALES</div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold" v-else>GH¢ {{ formatNumber(totalSales) }}</div>
            </div>
            <div class="col-auto">
                <span style="font-size: 250%">
                  &#128181;
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!--    Chart area -->
  <div class="row mt-4">
    <div class="col-8 mt-4">
      <div class="card shadow mb-1">
        <div class="card-body">
          <apexchart height="300" type="line" :series="lineChartSeries" :options="lineChartOptions"></apexchart>
        </div>
      </div>
    </div>
    <div class="col-4 mt-4">
      <div class="card mb-1 shadow">
        <div class="card-body">
          <apexchart height="300" type="pie" :options="chartOptions" :series="pieChartSeries"></apexchart>
        </div>
      </div>
    </div>
  </div>


  <!--    Best selling products -->
  <div class="row mt-3 mb-4 justify-content-center">
    <div class="col-8">
      <h6 class="text-center fw-bold">This Year's Best Selling Products</h6>
      <div class="table-responsive">
        <!--   Table     -->
        <DataTable
            :value="bestSellingProducts" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
            filterDisplay="menu" :rows="10" responsiveLayout="scroll">
          <template #empty>
            No Record Found.
          </template>
          <Column field="" header="#"  class="data-table-font-size">
            <template #body="{data}">
              <td class="fw-bold">{{ bestSellingProducts.indexOf(data) + 1 }}</td>
            </template>
          </Column>

            <Column field="productName" header="Product"  class="data-table-font-size">
              <template #body="{data}">
                <td class="fw-bold">{{ data.productName }}</td>
              </template>
            </Column>

          <Column field="category" header="Category"  class="data-table-font-size">
            <template #body="{data}">
              <td class="text-capitalize">{{ data.category }}</td>
            </template>
          </Column>

          <Column field="dateAdded" header="Date Added" class="data-table-font-size">
            <template #body="{data}">
              <td class="text-capitalize">{{ new Date(data.dateAdded).toLocaleDateString() }}</td>
            </template>
          </Column>
          <Column field="buyingPrice" header="Price" class="data-table-font-size">
            <template #body="{data}">
              <td>{{ formatNumber(parseFloat(data.sellingPrice)) }}</td>
            </template>
          </Column>
          <Column field="totalSold" header="Qty Sold" class="data-table-font-size">
            <template #body="{data}">
              <td>{{ data.totalSold ? data.totalSold.toLocaleString() : '' }}</td>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

</div>
</template>

<script setup>
import {computed, ref} from "vue";
import db from "@/dbConfig/db";
import {formatNumber} from "@/functions";
import {reactive} from "vue";

const orders = ref([]);
const outstandingBills = ref([]);
const loading = ref(false);
const totalPurchases = ref(0);
const totalProducts = ref(0);
const bestSellingProducts = ref([]);

//Line chart data
const lineChartOptions = reactive({
  chart: {
    id: 'line-chart',
    zoom: {enabled: false}
  },
  stroke: { curve: 'straight'},
  title: {
    text: 'Annual Sales Chart',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
})
const lineChartSeries = reactive([
  {
    name: 'Sale',
    data: [0,0,0,0,0,0,0,0,0,0,0,0]

  }
])

//PieChart data
const chartOptions = reactive({
  labels: ['Purchases', 'Sales' ],
  title: {
    text: 'Annual Sales And Purchases',
    align: 'center'
  },
})
const pieChartSeries = ref([0, 0]);


//total sales
const totalSales = computed(() => { //Get Annual Sales
  let total = 0;
  if (orders.value.length){
    for (const record of orders.value) {
      total += parseFloat(record.total)
    }
  }
  pieChartSeries.value[1] = total;
  return total;
})

//Get total bills
const outstandingBillsTotal = computed(() => {
  let total = 0;
  if (outstandingBills.value.length){
    for (const record of outstandingBills.value) {
      total += parseFloat(record.total) - (parseFloat(record.totalPaid) || 0);
    }
  }

  return total;
})


const startDate = () => { //This will set date to January 1 of the current year
  let yyyy = new Date().getFullYear();
  let mm = '01';
  let dd = '01';
  return `${yyyy}-${mm}-${dd}`;
}



const endDate = () => { //This will set date to December 31 of the current year
  let yyyy = new Date().getFullYear();
  let mm = '12';
  let dd = '31';
  return `${yyyy}-${mm}-${dd}`;
}

      //...................Get all data from db...............
const getData = async () => {
  loading.value = true;
  try {
    await db.transaction( async trx => {

      //Get orders
      orders.value = await trx('orders')
          .whereRaw('DATE(orderDate) >= ?', [startDate()])
          .andWhereRaw('DATE(orderDate) <= ?', [endDate()])
          .select('orderDate')
          .sum('total as total')
          .groupByRaw('DATE(orderDate)');

      //Get purchases
      const purchases = await trx('purchases').where('status', 'received')
          .whereRaw('DATE(billDate) >= ?', [startDate()])
          .andWhereRaw('DATE(billDate) <= ?', [endDate()])
          .sum('total as totalPurchases');
      totalPurchases.value = purchases[0].totalPurchases || 0;
      pieChartSeries.value[0] = purchases[0].totalPurchases || 0;

      //Get  Number of products
      const productsCount = await trx('products').count('id as totalProducts');
      totalProducts.value = productsCount[0].totalProducts || 0;

      //Outstanding Bills
      outstandingBills.value = await trx('purchases')
          .innerJoin('vendors', 'purchases.vendorId', '=', 'vendors.id')
          .leftJoin('billPayments', 'purchases.id', 'billPayments.purchaseId')
          .select('purchases.total', )
          .sum('billPayments.amount as totalPaid')
          .where('purchases.status', 'received')
          .groupBy('purchases.id')
          .havingRaw('?? > ?', ['purchases.total',  db.raw('coalesce(sum(billPayments.amount), 0)'  )] )
          .orderBy('purchases.id', 'DESC');

      // Best-selling products
      bestSellingProducts.value = await trx('products')
          .leftJoin('orderDetails', 'products.id', '=','orderDetails.productId')
          .leftJoin('categories', 'categories.id', 'orderDetails.categoryId')
          .sum('orderDetails.quantity as totalSold')
          .whereRaw('DATE(orderDetails.date) >= ?', [startDate()])
          .andWhereRaw('DATE(orderDetails.date) <= ?', [endDate()])
          .select('products.id','products.productName','products.sellingPrice',
              'products.dateAdded','categories.name as category'
          ).groupBy('products.id')
          .orderBy('totalSold', 'desc')
          .limit(10)
    })


        //............Calculations for line chart................//////////////////////////////
    if (orders.value.length){
      let jan=0, feb=0, mar=0, apr=0, may=0, jun=0, jul=0, aug=0, sep=0, oct=0, nov=0, dec=0
      for (const order of orders.value) { // for of loop
        switch (new Date(order.orderDate).getMonth() + 1) { //switch

          case 1: jan+= parseFloat(order.total); //January
          break;
          case 2: feb+= parseFloat(order.total); //February
          break;
          case 3: mar+= parseFloat(order.total); //March
          break;
          case 4: apr+= parseFloat(order.total);  //April
          break;
          case 5: may+= parseFloat(order.total);  //May
          break;
          case 6: jun+= parseFloat(order.total);  //June
          break;
          case 7: jul+= parseFloat(order.total);  //July
          break;
          case 8: aug+= parseFloat(order.total);  //August
          break
          case 9: sep+= parseFloat(order.total);  //September
          break;
          case 10: oct+= parseFloat(order.total);  //October
          break;
          case 11: nov+= parseFloat(order.total);  //November
          break;
          case 12: dec+= parseFloat(order.total);  //December
          break;
          default: console.clear();
          break;
        } // ./end of switch

      } // ./end of for of loop

      //update chart values
      lineChartSeries[0].data[0] = jan;  lineChartSeries[0].data[1] = feb;
      lineChartSeries[0].data[2] = mar;  lineChartSeries[0].data[3] = apr;
      lineChartSeries[0].data[4] = may;  lineChartSeries[0].data[5] = jun;
      lineChartSeries[0].data[6] = jul;  lineChartSeries[0].data[7] = aug;
      lineChartSeries[0].data[8] = sep;  lineChartSeries[0].data[9] = oct;
      lineChartSeries[0].data[10] = nov;  lineChartSeries[0].data[11] = dec;

    }////////////////////////////////////////

  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false }
}

getData();

</script>

<style scoped>

</style>