<template>
  <div class="container-fluid">

    <div class="row mb-3">

      <h4 class="text-black-50 my-3"><b>HOME</b></h4>

      <div class="col-3">
        <div class="card shadow h-100 py-2 border-primary border-4 border-bottom-0 border-top-0 border-end-0">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs fw-bold text-primary mb-1" style="font-size: 0.9em;">SALES COUNT</div>
                <div class="h6 mb-0 fw-bold">&nbsp; {{ salesCount }}</div>
              </div>
              <div class="col-auto">
                <span class="text-black-50" style="font-size: 250%">&#128722;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-3">
        <div class="card shadow h-100 py-2 border-warning border-4 border-bottom-0 border-top-0 border-end-0">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs fw-bold text-warning mb-1" style="font-size: 0.9em;">MOMO </div>
                <div class="h6 mb-0 fw-bold">GH¢ {{ formatNumber(momo) }}</div>
              </div>
              <div class="col-auto">
                <span class="" style="font-size: 250%">&#128241;</span>
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
                <div class="text-xs fw-bold text-danger mb-1" style="font-size: 0.9em;">RETURNS</div>
                <div class="h6 mb-0 fw-bold">GH¢ {{ formatNumber(returns) }}</div>
              </div>
              <div class="col-auto">
                <span style="font-size: 250%">&#128683;</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="col-3">
        <div class="card shadow h-100 py-2 border-success border-4 border-bottom-0 border-top-0 border-end-0">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs fw-bold text-success mb-1" style="font-size: 0.9em;">TOTAL SALES</div>
                <div class="h6 mb-0 fw-bold">GH¢ {{ formatNumber(totalSales) }}</div>
              </div>
              <div class="col-auto">
                <span style="font-size: 250%">
<!--                  &#128722;-->
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
              <apexchart height="300" type="bar" :series="barChartSeries" :options="barChartOptions"></apexchart>
            </div>
          </div>
        </div>
        <div class="col-4 mt-4">
          <div class="card mb-1 shadow">
            <div class="card-body">
              <apexchart height="300" type="donut" :options="chartOptions" :series="pieChartSeries"></apexchart>
            </div>
          </div>
        </div>
      </div>


  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref, watch} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";
const records = ref([]);
const barChartRecords = ref([]);

//Barchart data
const barChartOptions = reactive({
  chart: {
    id: 'bar-chart',
  },
  plotOptions: {
    bar: {
      distributed: true
    }
  },
  colors: [
    "rgba(255,99,132,0.7)", "rgba(175, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)",
    "rgba(25, 119,132, 0.7)","rgba(125, 99,192, 0.7)", "rgba(67,87,215, 0.7)", "rgba(128, 12, 128, 0.7)",
    "rgba(200,199,12,0.89)", "rgba(100, 110,152, 0.7)",
  ],
  dataLabels: {
    enabled: false
  },
  title: {
    text: 'Top Selling Categories For Today',
    align: 'left'
  },
  xaxis: {
    categories: []
  }
})
const barChartSeries = reactive([
  {
    name: 'Category',
    data: []

  }
])



//PieChart data
const chartOptions = reactive({
  labels: ['Sales', 'Returns'],
  title: {
    text: 'Today\'s Sales And Returns',
    align: 'left'
  },
})
const pieChartSeries = ref( []);




//Get today's orders
const getTodaySales = async () => {
  try {
    records.value = await db('orders')
        .whereRaw('?? = ?', ['orderDate', new Date().setHours(0,0,0,0)])
        .select('orders.type', 'orders.momo', 'total');

    let returns = 0;
    let sales = 0;
    for (const record of records.value) {
      if (record.type === 'sale') sales += parseFloat(record.total)
      else returns += parseFloat(-record.total)
    }

    pieChartSeries.value = [parseFloat(sales.toFixed(2)), parseFloat(returns.toFixed(2))];

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}
getTodaySales();

//Get total sales
const totalSales = computed(() => {
  let total = 0;
  for (const record of records.value) {
    total += parseFloat(record.total);
  }
  return total;
})


//Get momo
const momo = computed(() => {
  let total = 0;
  for (const record of records.value) {
    total += parseFloat(record.momo);
  }
  return total;
})



//Get returns
const returns = computed(() => {
  let total = 0;
  for (const record of records.value) {
    if (record.type === 'return')
    total += parseFloat(record.total);
  }
  return total;
})

//Get sales count
const salesCount = computed(() => {
  let total = 0;
  for (const record of records.value) {
    if (record.type === 'sale')
      total += 1
  }
  return total;
})



 //get data for bar chart
const getRecordsForChart = async () => {
  try {
    barChartRecords.value = await db('orderDetails')
        .innerJoin('categories', 'orderDetails.categoryId', 'categories.id')
        .innerJoin('orders', 'orders.id', 'orderDetails.orderId')
        .select('categories.name')
        .sum('orderDetails.quantity as sum')
        .where('orderDetails.date', '=', new Date().setHours(0,0,0,0))
        // .where('orders.type', 'sale')
        .groupBy('categories.id')
        .orderBy('sum', 'desc')
        .limit(10);


    barChartRecords.value =  barChartRecords.value.filter(item => item.sum > 0)

    if (barChartRecords.value.length){
      for (const chartRecord of barChartRecords.value) {
        barChartOptions.xaxis.categories.push(chartRecord.name);
        barChartSeries[0].data .push(chartRecord.sum);
      }
    }

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}
getRecordsForChart();

</script>

<style scoped>

</style>