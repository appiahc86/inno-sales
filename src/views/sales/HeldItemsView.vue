<template>
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div class="card p-3 mt-5">
        <h4 class="text-center">Held Receipts</h4>
        <div class="table-responsive">
        <!--    Table     -->
          <table class="table table-sm table-hover table-borderless table-striped">

            <thead>
            <tr>
              <th>Time</th>
              <th>No. of Items</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <template  v-if="heldItems.length">
              <template v-for="item in heldItems" :key="item.id">
                <tr>
                  <td>{{ new Date(item.id).toLocaleTimeString() }}</td>
                  <td>{{ item.cart.length }}</td>
                  <td>{{ formatNumber(item.total) }}</td>
                  <td>
                    <span class="badge rounded-pill bg-info" style="cursor: pointer;" @click="viewDetails(item.total, item.cart)">
                      Show Details
                    </span>
                  </td>
                  <td>
                    <span class="badge rounded-pill bg-success" style="cursor: pointer;" @click="unHold(item)">
                      Unhold
                    </span>
                  </td>
                  <td>
                    <span class="badge rounded-pill bg-danger" style="cursor: pointer;" @click="removeFromHeldItems(item.id)">
                      Remove
                    </span>
                  </td>
                </tr>
              </template>

            </template>
            <template v-else><h5 class="text-danger">No Record Found</h5></template>

            </tbody>

          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<!--  Dialog -->
  <dialog ref="dialog" style="min-width: 500px; border: 2px solid #ccc;">
    <button class="text-white bg-danger" style="float: right;" @click="dialog.close()">X</button><br>

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="table-responsive" v-if="item.lists.length" style="height: 300px;">
            <table class="table table-sm table-borderless table-striped">
              <thead>
              <tr>
                <th>Item</th>
                <th>Unit Price</th>
                <th>Qty</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="item in item.lists" :key="item.id">
                <tr>
                  <td>{{ item.productName }}</td>
                  <td>{{ formatNumber(item.sellingPrice) }}</td>
                  <td>{{ item.qty }}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
          <h5>Total : <span class="text-danger">{{ formatNumber(item.total ) }}</span></h5>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {formatNumber} from "@/functions";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const heldItems = ref([])
const dialog = ref(null);
const item = reactive({
  total: 0,
  lists: []
})

   // Remove from held items
const removeFromHeldItems = (id) => {
  let items = JSON.parse(sessionStorage.heldItems);
  items = items.filter((item) => item.id !== id);
  heldItems.value = items;
  sessionStorage.heldItems = JSON.stringify(items);
}

//View Item Details
const viewDetails = (total, lists) => {
  item.total = total;
  item.lists = lists;
  dialog.value.showModal();
}

//Unhold item
const unHold = (item) => {
  if (item.type === 'retail'){
    store.dispatch('cartModule/clearCart');
    store.dispatch('cartModule/unhold', item.cart);
    removeFromHeldItems(item.id);
    router.push({name: 'sales'})
  }else {
    store.dispatch('wholesaleCartModule/clearCart');
    store.dispatch('wholesaleCartModule/unhold', item.cart);
    removeFromHeldItems(item.id);
    router.push({name: 'wholesale'})
  }

}


onMounted(() => {
  if (!sessionStorage.heldItems) sessionStorage.heldItems = JSON.stringify([]);
  heldItems.value = JSON.parse(sessionStorage.heldItems);
})
</script>

<style scoped>

</style>