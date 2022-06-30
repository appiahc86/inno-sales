<template>
<div class="container-fluid mt-5">
  <form @submit.prevent="save">
  <div class="row shadow-sm p-3">

    <div class="col-5" style="border: 0.5px solid #ccc;">
      <h4 class="w-100 p-1 text-center text-dark" >Company Settings</h4>

        <table class="myTable w-100">
          <tr>
            <th>Company Name</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.companyName"></td>
          </tr>
          <tr>
            <th>Store Name</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.storeName"></td>
          </tr>
          <tr>
            <th>Address</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.address"></td>
          </tr>
          <tr>
            <th>Contact</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.contact"></td>
          </tr>
        </table>

    </div>

    <div class="col-4" style="border: 0.5px solid #ccc;">
      <h4 class="w-100 p-1 text-center text-dark">Tax Settings</h4>
      <table class="">
        <tr>
          <th>Tax(%)</th>
          <td> <input type="number" class="form-control-dark w-100" step="any" min="0" max="99" v-model.number="settings.tax"></td>
        </tr>
      </table>
    </div>

    <div class="col-3">
      <button class="w-50 btn-dark p-1 mt-2" type="submit">Save</button>
    </div>

  </div>
  </form>
</div>
</template>

<script setup>
import {reactive, ref} from "vue";
import db from "@/dbConfig/db";
import {useStore} from "vuex";

const store = useStore();
const settings = reactive({
  id: '',
  companyName: '',
  storeName: '',
  address: '',
  contact: '',
  tax: 0
})

const getSettings = async () => {
  try {
    const data = await db('settings').first();
    settings.companyName = data.companyName;
    settings.storeName = data.storeName;
    settings.address = data.address;
    settings.contact = data.contact;
    settings.tax = data.tax;
    settings.id = data.id;

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}
getSettings();

const save = async () => {
  try {
    settings.tax = settings.tax || 0;
    await db('settings').where('id', settings.id).update({...settings, id: undefined});
    store.dispatch('setSettings', {...settings, tax: undefined});
    store.dispatch('cartModule/setTax', settings.tax ? parseFloat(settings.tax) : 0);
    ipcRenderer.send('successMessage', 'Settings updated.');
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}
</script>

<style scoped>
.myTable th{
  padding: 10px;
}
</style>