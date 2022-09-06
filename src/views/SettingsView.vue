<template>
<div class="container-fluid mt-5">
  <form @submit.prevent="save">
  <div class="row p-3 justify-content-center">

    <div class="col-6">

      <div class="float-md-start">
        <h4 class="w-100 p-1 text-center text-dark" >Company Settings</h4>

        <table class="myTable w-100">
          <tr>
            <th class="float-end">Company Name</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.companyName"></td>
          </tr>
          <tr>
            <th class="float-end">Store Name</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.storeName"></td>
          </tr>
          <tr>
            <th class="float-end">Address</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.address"></td>
          </tr>
          <tr>
            <th class="float-end">Contact</th>
            <td> <input type="text" class="form-control-dark w-100" v-model.trim="settings.contact"></td>
          </tr>
          <tr>
            <th class="float-end">Tax(%)</th>
            <td>
              <input type="number" class="form-control-dark w-100" step="any" min="0" max="99"
                     v-model.number="settings.tax"  oninput="validity.valid || (value = 0)">
            </td>
          </tr>
          <tr>
            <th></th>
            <td>
              <button class="w-100 btn-dark p-2 mt-2" type="submit"><span class="pi pi-save"></span> Save</button>
            </td>
          </tr>
        </table>
      </div>

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
  padding: 1em;
}
.myTable td{
  width: 320px;
}
.form-control-dark{
  padding: 6px;
}
</style>