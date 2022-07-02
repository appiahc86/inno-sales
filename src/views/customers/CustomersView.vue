<template>
  <nav id="customersNav">
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button class="nav-link active" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#add-customer" type="button" role="tab" aria-controls="nav-add-customer" aria-selected="false">Add Customer</button>
      <button class="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#all-customers" type="button" role="tab" aria-controls="nav-home" aria-selected="true">All Customer</button>
    </div>
  </nav>
  <div class="tab-content" id="nav-tabContent">

    <!--  Customer Form  -->
    <div class="tab-pane mt-5 show active" id="add-customer" role="tabpanel" aria-labelledby="nav-add-customer-tab">
      <div class="card pb-4 pt-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-9">
    <form @submit.prevent="addCustomer">
      <table class="w-100" id="formTable">

        <tr>
          <th class="w-25 text-center">Customer Name</th>
          <td class="w-50"><input type="text" maxlength="40" class="form-control-dark w-75" v-model.trim="customerData.name"></td>
        </tr>

        <tr>
          <th class="w-25 text-center">Company</th>
          <td class="w-50"><input type="text" maxlength="60" class="form-control-dark w-75" v-model.trim="customerData.company"></td>
        </tr>

        <tr>
          <th class="w-25 text-center">Phone</th>
          <td class="w-50"><input type="text" maxlength="36" class="form-control-dark w-75"  v-model.trim="customerData.phone"></td>
        </tr>

        <tr>
          <th class="w-25 text-center">Address</th>
          <td><input type="text" maxlength="100" class="form-control-dark w-75" v-model.trim="customerData.address"></td>
        </tr>

      </table>
      <button class="w-10 mt-5 btn-secondary p-1" style="margin-left: 30%" name="submitBtn">Add Customer</button>
    </form>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!--  Customers Table  -->
    <div class="tab-pane mt-2" id="all-customers" role="tabpanel" aria-labelledby="nav-all-customers-tab">
      <div class="table-responsive">
        <DataTable
            :value="customers" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
            filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedCustomers"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['name','company', 'phone', 'address']" responsiveLayout="scroll"
        >
          <template #header>
            <div class="d-flex justify-content-center align-items-center" style="height: 15px">
              <h6 class="px-3">Customers</h6>
              <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" style="height: 30px"/>
                    </span>
            </div>
          </template>
          <template #empty>
            No record found.
          </template>
          <template #loading>
            <h4 class="text-white"> Loading Customers data. Please wait.</h4>
          </template>

          <Column selection-mode="multiple"  style="font-size: 0.85em;"></Column>

          <Column field="name" header="Name" sortable  style="font-size: 0.85em;"></Column>
          <Column field="company" header="Company" sortable  style="font-size: 0.85em;"></Column>
          <Column field="phone" header="Contact" sortable  style="font-size: 0.85em;"></Column>
          <Column field="address" header="Address" sortable  style="font-size: 0.85em;"></Column>

          <Column headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible"  style="font-size: 0.85em;">
            <template #body="{data}">
              <span type="button" title="Edit" @click="openDialog(data)">&#128221;</span> &nbsp;
              <span type="button" title="Delete" @click="confirm(data.id)">&#10060;</span>
            </template>
          </Column>
        </DataTable>
      </div>
      <br>
      <button class="btn-secondary"  @click="confirm(selectedCustomers)" v-if="selectedCustomers.length">
        <span class="pi pi-trash"></span>
        Delete Selection
      </button>
    </div>

  </div>

  <!--  Edit Dialog-->
  <dialog ref="editCustomerDialog">
    <h4>Edit Customer</h4>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-12">
          <form @submit.prevent="editCustomer">
            <table class="w-100" id="formTable">

              <tr>
                <th class="w-25 text-center">Customer Name</th>
                <td class="w-50"><input type="text" maxlength="40" class="form-control-dark w-100" v-model.trim="editCustomerData.name"></td>
              </tr>

              <tr>
                <th class="w-25 text-center">Company</th>
                <td class="w-50"><input type="text" maxlength="60" class="form-control-dark w-100" v-model.trim="editCustomerData.company"></td>
              </tr>

              <tr>
                <th class="w-25 text-center">Phone</th>
                <td class="w-50"><input type="text" maxlength="36" class="form-control-dark w-100"  v-model.trim="editCustomerData.phone"></td>
              </tr>

              <tr>
                <th class="w-25 text-center">Address</th>
                <td><input type="text" maxlength="100" class="form-control-dark w-100" v-model.trim="editCustomerData.address"></td>
              </tr>

            </table>
            <button class="mt-5 btn-secondary p-1" type="submit">Update Customer</button>
            <button type="button" @click="closeDialog" class="w-25 mx-4 p-1">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>

import {reactive, ref} from "vue";
import * as Validator from "validatorjs";
import db from "@/dbConfig/db";
import {FilterMatchMode} from "primevue/api";

const loading = ref(false);
const customers = ref([]);
const selectedCustomers = ref([]);
const editCustomerDialog = ref(null);
const customerId = ref(null);
const customerData = reactive({
  name: "",
  company: "",
  phone: "",
  address: ""
})
const editCustomerData = reactive({
  name: "",
  company: "",
  phone: "",
  address: ""
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

    //.............Get all Customers .........................
const getCustomers = async () => {
  try {
    loading.value = true;
    customers.value = await db.select().from('customers');

  }catch (e) {
    ipcRenderer.send("errorMessage", e.message)
  }finally {
    loading.value = false;
  }
} // ./get all customers
getCustomers();


//Clear form data
const clearFormData = () => {
  customerData.name = '';
  customerData.company = '';
  customerData.phone = '';
  customerData.address = '';
}


       //.............Add Customer .........................
const addCustomer = async (e) => {
  try {
    e.target.submitBtn.disabled = true
    // validation
    let validation = new Validator(customerData,{
      name: 'required|min:3'
    })
    if (validation.passes()){ //Save Data
      const customer = await db('customers').insert(customerData);
      customers.value.push({...customerData, id: customer[0]})
      clearFormData();
    }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }finally { e.target.submitBtn.disabled = false }

} // ./add Customer



//.............Edit Customer .........................
const editCustomer =async () => {
  try {
      await db('customers').where('id', customerId.value).update(editCustomerData);
    for (let cust of customers.value) {
      if (cust.id === customerId.value){
        cust.name = editCustomerData.name;
        cust.company = editCustomerData.company;
        cust.phone = editCustomerData.phone;
        cust.address = editCustomerData.address;
      }
    }
    customerId.value = null;
    closeDialog();
  }catch (e) {
    ipcRenderer.send("errorMessage", e.message)
  }
}

//Open dialog
const openDialog = (data) => {
  editCustomerData.name = data.name;
  editCustomerData.company = data.company;
  editCustomerData.phone = data.phone;
  editCustomerData.address = data.address;
  customerId.value = data.id;
  editCustomerDialog.value.showModal()
}

//Close Dialog
const closeDialog = () => {
  editCustomerDialog.value.close();
  customerId.value = null;
}


                          //.............Delete Customer .........................
const confirm = (id) => {
  let singleOrMultiple = id;
  let ids = [];
  if (typeof id === 'object'){    // check if user selected multiple items
    const convertToArray = Object.values(id);
    for (const item of convertToArray) {
      ids.push(item.id);
    }
    singleOrMultiple = ids;
  }else { singleOrMultiple = [singleOrMultiple]}  //If user selected a single record
  ipcRenderer.send('confirm', { id:singleOrMultiple, type: 'customer' });
}

ipcRenderer.on('deleteCustomer', async (event, args) => {
  try {
    await db('customers').whereIn('id', args).del();
    selectedCustomers.value = []; //clear selected customers
    const newCustomers = [];
    for (const c of customers.value) {
      if (!args.includes(c.id)) newCustomers.push(c)
    }
    customers.value = newCustomers;
  }catch (e) { ipcRenderer.send("errorMessage", e.message) }

})
//. /delete Customer

</script>

<style scoped>
#formTable th{
  padding: 1em;
}
.form-control-dark{
  padding: 5px;
}
#formTable input{
  max-width: 250px;
}

</style>