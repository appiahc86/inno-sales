<template>
  <div class="container-fluid">

    <div class="row mb-3">

      <h4 class="text-black-50 my-3"><b>HOME</b></h4>


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
                <span title="View Details" style="font-size: 250%; cursor: pointer;" @click="showMomoDetails">&#128241;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

<!--      Credit Sales -->
      <div class="col-3">
        <div class="card shadow h-100 py-2 border-danger border-4 border-bottom-0 border-top-0 border-end-0">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs fw-bold text-danger mb-1" style="font-size: 0.9em;">CREDIT SALES</div>
                <div class="h6 mb-0 fw-bold" v-if="loading">
                  <span class="spinner-border spinner-border-sm"></span> loading...
                </div>
                <div class="h6 mb-0 fw-bold" v-else>&nbsp; {{ formatNumber(creditSales) }}</div>
              </div>
              <div class="col-auto">
                <span class="text-black-50" style="font-size: 250%">&#128683;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

<!--      Cash sales -->
      <div class="col-3">
        <div class="card shadow h-100 py-2 border-primary border-4 border-bottom-0 border-top-0 border-end-0">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs fw-bold text-primary mb-1" style="font-size: 0.9em;">CASH SALES</div>
                <div class="h6 mb-0 fw-bold" v-if="loading">
                  <span class="spinner-border spinner-border-sm"></span> loading...
                </div>
                <div class="h6 mb-0 fw-bold" v-else>GH¢ {{ formatNumber(cashSales) }}</div>
              </div>
              <div class="col-auto">
                <span style="font-size: 250%">&#128176;</span>
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

<!--   Loading dialog -->
    <dialog class="myDialog" ref="loadingDialog"></dialog>


    <!-- Details dialog -->
    <dialog ref="dialog" style="min-width: 400px; border: 2px solid #ccc;">
      <button class="text-white bg-danger" v-if="!detailsLoading" style="float: right;" @click="dialog.close()">X</button><br>

      <div class="container-fluid">
        <div class="p-5" v-if="detailsLoading">
          <h5 class="text-center">Loading... <span class="spinner-border spinner-border-sm"></span></h5>
        </div>
        <div class="row" v-else>
          <div class="col">
            <div class="table-responsive" v-if="momoDetails.length" style="height: 100px;">
              <table class="table table-sm table-borderless table-striped">
                <template v-for="record in momoDetails" :key="record.momoType">
                  <tr>
                    <th class="text-uppercase">{{ record.momoType }}</th>
                    <td>{{ formatNumber(parseFloat(record.total)) }}</td>
                  </tr>
                </template>
              </table>
            </div>
            <div v-else><h5 class="text-center">No Record Found</h5></div>
            <br>
          </div>
        </div>
      </div>
    </dialog>


  </div>
</template>

<script setup>

import {computed, reactive, ref} from "vue";
import {formatNumber} from "@/functions";
import db from "@/dbConfig/db";
import {onMounted, watch} from "vue";
import {useStore} from "vuex";

const loading = ref(false);
const loadingDialog = ref();
const detailsLoading = ref(false);
const dialog = ref();
const momoDetails = ref([]);
const cashSales = ref(0);
const momo = ref(0);
const creditSales = ref(0);
const store = useStore();

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
  labels: ['Cash Sales', 'Credit Sales'],
  title: {
    text: 'Today\'s Cash And Credit Sales',
    align: 'left'
  },
})
const pieChartSeries = ref( []);

//Today's date
const today = () => {
  let yyyy = new Date().getFullYear();
  let mm = ( new Date().getMonth() + 1) < 10 ? '0' + ( new Date().getMonth() + 1) : new Date().getMonth() + 1;
  let dd = (new Date().getDate()) < 10 ? '0' + (new Date().getDate()) : (new Date().getDate());
  return {start: `${yyyy}-${mm}-${dd} 00:00:01`, end: `${yyyy}-${mm}-${dd} 23:59:59`};
}
const interval = today();


onMounted(() => {
  if (loading.value){
    loadingDialog.value.showModal();
    loadingDialog.value.addEventListener('cancel', e => e.preventDefault());
    watch(() => loading.value, (value) => {
      if (!value) loadingDialog.value.close();
    })
  }
})

//Get Records
const getData = async () => {
  try {
    loading.value = true;
    store.commit("setFreezeRouting", true); //Freeze routing

    await db.transaction( async tx => {

    //...............................Today's sales................................
    const query = await tx('orders')
        .whereRaw('orderDate >= ?', [interval.start])
        .andWhereRaw('orderDate <= ?', [interval.end])
        .select('orders.saleType', 'total', 'momo')




    for (const record of query) {
      if (record.saleType === 'credit') {
        creditSales.value += parseFloat(record.total);
        momo.value += parseFloat(record.momo);
      }
      else if (record.saleType === 'cash') {
        cashSales.value += record.total;
        momo.value += parseFloat(record.momo);
      }
    }


    pieChartSeries.value = [parseFloat(cashSales.value.toFixed(2)), parseFloat(creditSales.value.toFixed(2))];


    //..........................Records for bar chart.............................
      barChartRecords.value = await tx('orderDetails')
          .innerJoin('categories', 'orderDetails.categoryId', 'categories.id')
          .innerJoin('orders', 'orders.id', 'orderDetails.orderId')
          .select('categories.name')
          .sum('orderDetails.quantity as sum')
          .whereRaw('orderDetails.date >= ?', [interval.start])
          .andWhereRaw('orderDetails.date <= ?', [interval.end])
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

    })

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }finally {
    loading.value = false;
    store.commit("setFreezeRouting", false); // Enable routing
  }
}
getData();

//Total sales
const  totalSales = computed(() => {
  return creditSales.value + cashSales.value;
})

const showMomoDetails = async () => {
  try {
    dialog.value.showModal();
    detailsLoading.value = true;
    momoDetails.value = await db('orders')
        .select('momoType')
        .whereRaw('orderDate >= ?', [interval.start])
        .andWhereRaw('orderDate <= ?', [interval.end])
        .andWhereNot({momoType: ''})
        .sum("momo as total")
        .groupBy('momoType')
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }finally {
    detailsLoading.value = false;
  }
}

</script>

<style scoped>
.myDialog{
  border: none; visibility: hidden;
}
.myDialog::backdrop{
  background: transparent;
}
</style>