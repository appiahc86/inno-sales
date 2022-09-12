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
                <div class="h6 mb-0 fw-bold" v-if="loading">
                  <span class="spinner-border spinner-border-sm"></span> loading...
                </div>
                <div class="h6 mb-0 fw-bold" v-else>&nbsp; {{ salesCount }}</div>
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
                <div class="h6 mb-0 fw-bold" v-if="loading">
                  <span class="spinner-border spinner-border-sm"></span> loading...
                </div>
                <div class="h6 mb-0 fw-bold" v-else>GH¢ {{ formatNumber(momo) }}</div>
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
                <div class="h6 mb-0 fw-bold" v-if="loading">
                  <span class="spinner-border spinner-border-sm"></span> loading...
                </div>
                <div class="h6 mb-0 fw-bold" v-else>GH¢ {{ formatNumber(totalReturns) }}</div>
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
                <div class="h6 mb-0 fw-bold" v-if="loading">
                  <span class="spinner-border spinner-border-sm"></span> loading...
                </div>
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

import {computed, reactive, ref} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";

const loading = ref(false);
const records = ref([]);
const totalSales = ref(0);
const totalReturns = ref(0);
const momo = ref(0);
const salesCount = ref(0);


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

//Today's date
const today = () => {
  let yyyy = new Date().getFullYear();
  let mm = ( new Date().getMonth() + 1) < 10 ? '0' + ( new Date().getMonth() + 1) : new Date().getMonth() + 1;
  let dd = (new Date().getDate()) < 10 ? '0' + (new Date().getDate()) : (new Date().getDate());
  return `${yyyy}-${mm}-${dd}`;
}




//Get Records
const getTodaySales = async () => {
  try {
    loading.value = true;

    const query = await db('orders')
        .whereRaw('DATE(orderDate) >= ?', [today()])
        .andWhereRaw('DATE(orderDate) <= ?', [today()])
        .select('orders.type', 'orders.momo', 'total')
        .sum('orders.total as totalSales')
        .sum('orders.momo as totalMomo')
        .count('* as salesCount')
        .groupBy('orders.type');


    let returns = 0;
    let sales = 0;
    let totalMomo = 0;
    for (const record of query) {
      if (record.type === 'sale') {
        salesCount.value = record.salesCount; //Get sales count if type is equal to sales
        sales += parseFloat(record.totalSales);
        totalMomo += record.totalMomo;
      }
      else if (record.type === 'return') {
        returns += parseFloat(record.totalSales) || 0;
        totalReturns.value = record.totalSales || 0; //Get total returns
        totalMomo += record.totalMomo;
      }
    }

    totalSales.value = sales + returns;
    momo.value = totalMomo;

    pieChartSeries.value = [parseFloat(sales.toFixed(2)), parseFloat(returns.toFixed(2))];

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }finally {
    loading.value = false;
  }
}
getTodaySales();


 //get data for bar chart
const getRecordsForChart = async () => {
  try {
    loading.value = true;
    barChartRecords.value = await db('orderDetails')
        .innerJoin('categories', 'orderDetails.categoryId', 'categories.id')
        .innerJoin('orders', 'orders.id', 'orderDetails.orderId')
        .select('categories.name')
        .sum('orderDetails.quantity as sum')
        .whereRaw('DATE(orderDetails.date) >= ?', [today()])
        .andWhereRaw('DATE(orderDetails.date) <= ?', [today()])
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
  }finally {
    loading.value = false;
  }
}
getRecordsForChart();

</script>

<style scoped>

</style>