<template>

  <div class="container-fluid">
    <div class="row">
      <div class="col-12">


        <div class="myTabs-container">
          <button class="px-3 myTabs" :class="{ active: firstActive}"
                  type="button" @click="secondActive = false; firstActive = true">Add Customer
          </button>

          <button class="px-3 myTabs mx-2" :class="{ active: secondActive}"
                  type="button" @click="firstActive = false; secondActive = true">
            Customers List</button>
        </div>


            <!--  Customer Form  -->
            <div v-if="firstActive" style="margin-top: 10vh">

              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-md-9">
                    <form @submit.prevent="addCustomer">
                      <table class="w-100 myTable">

                        <tr>
                          <th></th>
                          <td>
                            <h4>Add A New Customer</h4>
                          </td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-user"></span> Customer Name &nbsp;</th>
                          <td><input type="text" required maxlength="200" class="form-control-dark" v-model.trim="customerData.name"></td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-home"></span> Company &nbsp;</th>
                          <td><input type="text" maxlength="150" class="form-control-dark" v-model.trim="customerData.company"></td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-phone"></span> Phone &nbsp;</th>
                          <td><input type="text" required maxlength="50" class="form-control-dark"  v-model.trim="customerData.phone"></td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-list"></span> Address &nbsp;</th>
                          <td><input type="text" maxlength="100" class="form-control-dark" v-model.trim="customerData.address"></td>
                        </tr>

                        <tr>
                          <th></th>
                          <td>
                            <button class=" mt-1 btn-secondary" type="submit" name="submitBtn" style="width: 300px;">
                              <span class="pi pi-save"></span>
                              <b style="font-size: 1.5em;"> Save</b>
                            </button>
                          </td>
                        </tr>
                      </table>
                    </form>
                  </div>
                </div>
              </div>
            </div>


            <!--  Customers Table  -->
        <div v-if="secondActive">
          <h6 class="text-success mt-4">
            <span class="pi pi-info-circle fw-bold"></span>
            Right-click on a row to show the context menu.
          </h6>
          <div class="table-responsive">
                    <DataTable
                        :value="customers" :paginator="true" dataKey="id"
                        class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
                        filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedCustomers"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        :globalFilterFields="['name','company', 'phone', 'address']" responsiveLayout="scroll"
                        contextMenu v-model:contextMenuSelection="selectedRow" @row-contextmenu="onRowContextMenu"
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

<!--                      <Column selection-mode="multiple" class="data-table-font-size" style="width: 20px;"></Column>-->

                      <Column field="name" header="Name" sortable  class="data-table-font-size"></Column>
                      <Column field="company" header="Company" sortable  class="data-table-font-size"></Column>
                      <Column field="phone" header="Contact" sortable  class="data-table-font-size"></Column>
                      <Column field="account" header="Credit Balance" sortable  class="data-table-font-size">
                        <template #body="{data}">
                          <td>{{formatNumber(data.account) }}</td>
                        </template>
                      </Column>
                      <Column field="address" header="Address" sortable class="data-table-font-size"></Column>
                    </DataTable>
            <ContextMenu :model="menuModel" ref="cm" class="context-menu" style="font-size: 0.9em;" />
                  </div>
                  <br>
<!--                  <button class="btn-secondary"  @click="confirmDelete(selectedCustomers)" v-if="selectedCustomers.length">-->
<!--                    <span class="pi pi-trash"></span>-->
<!--                    Delete Selection-->
<!--                  </button>-->
        </div>


        <!--  Edit Dialog-->
        <dialog ref="editCustomerDialog" style="border: 2px solid #ccc;">
          <h4>Edit Customer</h4>
          <div class="container-fluid">
            <div class="row justify-content-center">
              <div class="col-md-12">
                <form @submit.prevent="editCustomer">
                  <table class="w-100 myTable" id="formTable">

                    <tr>
                      <th class="float-end">Customer Name &nbsp;</th>
                      <td class="w-50"><input type="text" required maxlength="200" class="form-control-dark w-100" v-model.trim="editCustomerData.name"></td>
                    </tr>

                    <tr>
                      <th class="float-end">Company &nbsp;</th>
                      <td class="w-50"><input type="text" maxlength="60" class="form-control-dark" v-model.trim="editCustomerData.company"></td>
                    </tr>

                    <tr>
                      <th class="float-end">Phone &nbsp;</th>
                      <td class="w-50"><input type="text" required maxlength="40" class="form-control-dark"  v-model.trim="editCustomerData.phone"></td>
                    </tr>

                    <tr>
                      <th class="float-end">Credit Balance &nbsp;</th>
                      <td class="w-50">
                        <input type="number" class="form-control-dark" min="0" step="0.01" required
                               v-model="editCustomerData.account" oninput="validity.valid || (value = '')">
                      </td>
                    </tr>

                    <tr>
                      <th class="float-end">Address &nbsp;</th>
                      <td><input type="text" maxlength="200" class="form-control-dark" v-model.trim="editCustomerData.address"></td>
                    </tr>

                    <tr>
                      <th class="float-end"></th>
                      <td>
                        <button class="mt-2 btn-secondary py-1" type="submit" style="width: 49%;">Update</button>
                        <span style="width: 1%">&nbsp;</span>
                        <button type="button" @click="closeDialog" class="py-1" style="width: 49%;">Cancel</button>
                      </td>
                    </tr>
                  </table>

                </form>
              </div>
            </div>
          </div>
        </dialog>


      </div>
    </div>
  </div>




</template>

<script setup>

import {reactive, ref} from "vue";
import * as Validator from "validatorjs";
import db from "@/dbConfig/db";
import {FilterMatchMode} from "primevue/api";
import { formatNumber } from "@/functions/index.js";


const loading = ref(false);
const customers = ref([]);
const selectedCustomers = ref([]);
const editCustomerDialog = ref(null);
const customerId = ref(null);
const firstActive = ref(true);
const secondActive = ref(false);

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
  address: "",
  account: null,
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


//For row context menu
const cm = ref();
const selectedRow = ref();
const menuModel = ref([
  {label: 'Edit', icon: 'pi pi-pencil', command: () => openDialog(selectedRow.value), class: 'fw-bold'},
  {separator: true},
  {label: 'Delete', icon: 'pi pi-trash', command: () => confirmDelete(selectedRow.value.id), class: 'fw-bold'}
]);

const onRowContextMenu = (event) => {
  selectedCustomers.value = [];
  selectedCustomers.value.push(event.data);
  cm.value.show(event.originalEvent);
}




    //.............Get all Customers .........................
const getCustomers = async () => {
  try {
    loading.value = true;
    customers.value = await db.select()
        .from('customers')
        .where('id', '!=', 1);

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
      customers.value.push({...customerData, id: customer[0], account: 0})
      clearFormData();
    }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }finally { e.target.submitBtn.disabled = false }

} // ./add Customer



//.............Edit Customer .........................
const editCustomer =async () => {
  try {
      await db('customers').where('id', customerId.value)
          .first()
          .update({
            name: editCustomerData.name,
            company: editCustomerData.company,
            phone: editCustomerData.phone,
            address: editCustomerData.address,
            account: editCustomerData.account || 0,
          });
    for (let cust of customers.value) {
      if (cust.id === customerId.value){
        cust.name = editCustomerData.name;
        cust.company = editCustomerData.company;
        cust.phone = editCustomerData.phone;
        cust.address = editCustomerData.address;
        cust.account = editCustomerData.account || 0;
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
  editCustomerData.account = data.account;
  customerId.value = data.id;
  editCustomerDialog.value.showModal()
}

//Close Dialog
const closeDialog = () => {
  editCustomerDialog.value.close();
  customerId.value = null;
}


                          //.............Delete Customer .........................
const confirmDelete = (id) => {
  let singleOrMultiple = id;
  let ids = [];
  if (typeof id === 'object'){    // check if user selected multiple items
    const convertToArray = Object.values(id);
    for (const item of convertToArray) {
      ids.push(item.id);
    }
    singleOrMultiple = ids;
  }else { singleOrMultiple = [singleOrMultiple]}  //If user selected a single record
  ipcRenderer.send('confirm', { id:singleOrMultiple, type: 'customer', message: 'Are you sure you want to delete this item(s)?' });
}

ipcRenderer.on('deleteCustomer', async (event, args) => {
  try {

   // return console.log(args)

    const check = await db('orders')
        .where('customerId', args[0]).limit(1);

    //If customer has orders
    if(check.length){
     return ipcRenderer.send("errorMessage", 'Sorry, this record could not be deleted.');
    }

    //Delete Customer
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


.myTable th{
  padding: 10px 0;
}
.form-control-dark{
  padding: 5px;
}
.myTable input, .myTable textarea{
  width: 300px;
  padding: 4px;
}

</style>