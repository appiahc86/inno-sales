<template>
  <div class="container-fluid">

    <div class="row mb-5">

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
    <div class="row mt-5">
      <div class="col-lg-9 mt-4">
        <div class="card shadow mb-1">
          <div class="card-body">
            <canvas id="myBarChart" width="100%" height="50"></canvas>
          </div>
          <div class="card-footer small text-muted">Top Selling Categories For Today</div>
        </div>
      </div>
      <div class="col-lg-3 mt-4">
        <div class="card mb-1 shadow">
          <div class="card-body">
            <canvas id="myPieChart" width="100%" height="100"></canvas>
          </div>
          <div class="card-footer small text-muted">Today's Sales And Returns</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

import {computed, onMounted, ref, watch} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";
const records = ref([]);
const barChartRecords = ref([]);


//Get today's orders
const getTodaySales = async () => {
  try {
    records.value = await db('orders')
        .whereRaw('?? = ?', ['orderDate', new Date().setHours(0,0,0,0)])
        .select('orders.type', 'orders.momo', 'total');

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

//Get returns
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
        .select('categories.name')
        .sum('orderDetails.quantity as sum')
        .where('orderDetails.date', '=', new Date().setHours(0,0,0,0))
        .groupBy('categories.id')
        .orderBy('sum', 'desc')
        .limit(10);

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}
getRecordsForChart();


            //......................Bar chart.........................
onMounted(() => {

// Bar Chart Example
  const ctx = document.getElementById("myBarChart");
  const myBarChart = new Chart(ctx, {


    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        maxBarThickness: 8,
        label: "Category",
        backgroundColor: [
            "rgba(255,99,132,0.7)", "rgba(175, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)",
            "rgba(25, 119,132, 0.7)","rgba(125, 99,192, 0.7)", "rgba(67,87,215, 0.7)", "rgba(128, 12, 128, 0.7)",
            "rgba(200, 199,12, 0.7)", "rgba(100, 110,152, 0.7)",
        ],
        borderColor: [
          "rgb(255, 99,132)", "rgb(255, 159, 64)", "rgb(25, 105, 89)", "rgb(75, 192, 192)", "rgb(255, 99,132)",
          "rgb(25, 119,132)", "rgb(125, 99,192)", "rgb(246,235,12)", "rgb(255, 12,115)", "rgb(255, 99,132)",
        ],
        data: [],
      }],
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            display: true
          },
          ticks: {
            maxTicksLimit: 5
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 1,
            maxTicksLimit: 8
          },
          gridLines: {
            display: true
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });

      //Set values for bar chart
watch(
    () => barChartRecords.value, (value) => {

      if (barChartRecords.value.length){
        let myLabels = [];
        let myValues = [];
        for (const chartRecord of barChartRecords.value) {
          myLabels.push(chartRecord.name);
          myValues.push(chartRecord.sum);
        }
        myBarChart.data.labels = myLabels;
        myBarChart.data.datasets[0].data = myValues;
        myBarChart.options.scales.yAxes[0].ticks.max = barChartRecords.value[0].sum || 0
        myBarChart.update();
      }

    }
)


                      //............Doughnut Chart.............

  const myPieChart = document.getElementById("myPieChart");
  const myDoughnut = new Chart(myPieChart, {

    type: 'doughnut',
    data: {
      labels: ["Returns", "Sales"],
      datasets: [{
        label: "Revenue",
        backgroundColor:[ "rgba(25,78,215,0.73)", "rgba(255, 205, 86)"],
       hoverOffset: 4,
        data: [0, 0],
      }],
    }
  });


  //Set values for Doughnut chart
  watch(
      () => records.value, (value) => {
        let returns = 0;
        let sales = 0;
        let data = [];
        for (const record of records.value) {
          if (record.type === 'sale') sales += parseFloat(record.total)
          else returns += parseFloat(record.total)
        }

        myDoughnut.data.datasets[0].data = [returns.toFixed(2), sales.toFixed(2)];
        myDoughnut.update();
      }
  )



})
</script>

<style scoped>

</style>