<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">

        <div class="myTabs-container">
          <button class="px-3 myTabs" :class="{ active: firstActive}"
                  type="button" @click="secondActive = false; firstActive = true">Add Vendor
          </button>

          <button class="px-3 myTabs mx-2" :class="{ active: secondActive}"
                  type="button" @click="firstActive = false; secondActive = true">
            Vendors List</button>
        </div>

            <!--   Add Vendor       -->

          <div v-if="firstActive" style="margin-top: 10vh">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-9">
                  <form @submit.prevent="addVendor">
                    <table class="w-100 myTable">
                      <tr>
                        <th></th>
                        <td>
                          <h4>Add A New Vendor</h4>
                        </td>
                      </tr>
                      <tr>
                        <th class="float-end"><span class="pi pi-home"></span> Company &nbsp;&nbsp;</th>
                        <td><input type="text" class="form-control-dark" v-model.trim="vendorData.company"></td>
                      </tr>

                      <tr>
                        <th class="float-end">Address &nbsp;&nbsp;</th>
                        <td><input type="text" class="form-control-dark" v-model.trim="vendorData.address"></td>
                      </tr>

                      <tr>
                        <th class="float-end"><span class="pi pi-user"></span> Contact Person &nbsp;&nbsp;</th>
                        <td><input type="text" class="form-control-dark" v-model.trim="vendorData.contactPerson"></td>
                      </tr>

                      <tr>
                        <th class="float-end"><span class="pi pi-phone"></span> Phone &nbsp;&nbsp;</th>
                        <td><input type="text" class="form-control-dark" v-model.trim="vendorData.phone"></td>
                      </tr>

                      <tr>
                        <th class="float-end">Account# &nbsp;&nbsp;</th>
                        <td><input type="text" class="form-control-dark" v-model.trim="vendorData.accountNumber"></td>
                      </tr>

                      <tr>
                        <th class="float-end"><span class="pi pi-list"></span> Notes &nbsp;&nbsp;</th>
                        <td><textarea rows="4" class="form-control-dark" v-model.trim="vendorData.notes"></textarea></td>
                      </tr>

                      <tr>
                        <th class="float-end"></th>
                        <td>
                          <button class=" mt-1 btn-secondary" type="submit" name="submitBtn" style="width: 22em;">
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
          </div >


          <!--   Vendors Table       -->
        <div v-if="secondActive">
          <h6 class="text-success mt-4">
            <span class="pi pi-info-circle fw-bold"></span>
            Right-click on a row to show the context menu.
          </h6>
          <div class="table-responsive">
            <DataTable
                :value="vendors" :paginator="true" dataKey="id"
                class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedVendors"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                :globalFilterFields="['company', 'phone', 'address', 'contactPerson']" responsiveLayout="scroll"
                contextMenu v-model:contextMenuSelection="selectedRow" @row-contextmenu="onRowContextMenu"
            >
              <template #header>
                <div class="d-flex justify-content-center align-items-center" style="height: 15px">
                  <h5 class="px-3">Vendors</h5>
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
                <h4 class="text-white"> Loading data. Please wait...</h4>
              </template>

              <Column selection-mode="multiple" class="data-table-font-size" style="width: 20px;"></Column>

              <Column field="company" header="Company" sortable class="data-table-font-size"></Column>
              <Column field="address" header="Address" sortable  class="data-table-font-size"></Column>
              <Column field="contactPerson" header="Contact Person" sortable class="data-table-font-size"></Column>
              <Column field="phone" header="Phone" sortable class="data-table-font-size"></Column>
              <Column field="accountNumber" header="Account#" sortable class="data-table-font-size"></Column>
              <Column field="notes" header="Notes" sortable class="data-table-font-size">
                <template #body="{data}">
                  <td :title="data.notes">
                    {{ data.notes.length > 20 ? data.notes.substring(0, 20) + '...' : data.notes }}
                  </td>
                </template>
              </Column>

            </DataTable>
            <ContextMenu :model="menuModel" ref="cm" class="context-menu" style="font-size: 0.9em;" />
          </div>
          <br>
          <button class="btn-secondary" v-if="selectedVendors.length" @click="confirmDelete(selectedVendors)">
            <span class="pi pi-trash"></span>
            Delete Selection
          </button>
        </div>



        <!--  Edit Dialog-->
        <dialog ref="editDialog" style="border: 2px solid #ccc;">
          <h4>Edit Vendor</h4>
          <div class="container-fluid">
            <div class="row justify-content-center">
              <div class="col-md-12">
                <form @submit.prevent="editVendor">
                  <table class="w-100 myTable">
                    <tr>
                      <th class="float-end"><span class="pi pi-home"></span> Company &nbsp;&nbsp;</th>
                      <td><input type="text" class="form-control-dark" v-model.trim="editVendorData.company"></td>
                    </tr>

                    <tr>
                      <th class="float-end">Address &nbsp;&nbsp;</th>
                      <td><input type="text" class="form-control-dark" v-model.trim="editVendorData.address"></td>
                    </tr>

                    <tr>
                      <th class="float-end"><span class="pi pi-user"></span> Contact Person &nbsp;&nbsp;</th>
                      <td><input type="text" class="form-control-dark" v-model.trim="editVendorData.contactPerson"></td>
                    </tr>

                    <tr>
                      <th class="float-end"><span class="pi pi-phone"></span> Phone &nbsp;&nbsp;</th>
                      <td><input type="text" class="form-control-dark" v-model.trim="editVendorData.phone"></td>
                    </tr>

                    <tr>
                      <th class="float-end">Account# &nbsp;&nbsp;</th>
                      <td><input type="text" class="form-control-dark" v-model.trim="editVendorData.accountNumber"></td>
                    </tr>

                    <tr>
                      <th class="float-end"><span class="pi pi-list"></span> Notes &nbsp;&nbsp;</th>
                      <td><textarea rows="4" class="form-control-dark" v-model.trim="editVendorData.notes"></textarea></td>
                    </tr>

                    <tr>
                      <th class="float-end"></th>
                      <td>
                        <button class=" mt-1 btn-secondary p-1" style="width: 49%;" type="submit" name="submitBtn">
                          <span class="pi pi-save"></span>
                          Save
                        </button>
                        <span style="width: 1%">&nbsp;</span>
                        <button type="button" class="p-1" @click="editDialog.close()" style="width: 49%;">Cancel</button>
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

const click3 = ref(null);
import {reactive, ref} from "vue";
import { FilterMatchMode } from "primevue/api";
import * as Validator from "validatorjs";
import db from "@/dbConfig/db";
import errorMessages from "@/errorMessages";


const selectedVendors = ref([]);
const vendors = ref([])
const loading = ref(false);
const editDialog = ref(null);
const vendorId = ref(null)
const firstActive = ref(true);
const secondActive = ref(false);

const vendorData = reactive({
  company: '', address: '', contactPerson: '', phone: '', accountNumber: '', notes: ''
})
const editVendorData = reactive({
  company: '', address: '', contactPerson: '', phone: '', accountNumber: '', notes: ''
})

const resetVendorData = () => {
  vendorData.company = ''; vendorData.address = ''; vendorData.contactPerson = ''; vendorData.phone = '';
  vendorData.accountNumber = ''; vendorData.notes = '';
}


//For row context menu
const cm = ref();
const selectedRow = ref();
const menuModel = ref([
  {label: 'Edit', icon: 'pi pi-pencil', command: () => openDialog(selectedRow.value), class: 'fw-bold'},
  {separator: true},
  {label: 'Delete', icon: 'pi pi-trash', command: () => confirmDelete(selectedRow.value.id), class: 'fw-bold'}
]);

const onRowContextMenu = (event) => {
  selectedVendors.value = [];
  selectedVendors.value.push(event.data);
  cm.value.show(event.originalEvent);
}


            //........................Get all vendors ...........................
const getVendors = async () => {

  try {
    loading.value = true;
    vendors.value = await db('vendors');
  }catch (e) { ipcRenderer.send('errorMessage', e.message); }
finally {
    loading.value = false;
  }
} // ./get all vendors
getVendors();


            // ..................................Add Vendor.................................
const addVendor = async (e) => {
  try {
    e.target.submitBtn.disabled = true;
    // validation
    let validation = new Validator(vendorData,{
      company: 'required|string|min:5|max:150',
      address: 'string|max:100',
      contactPerson: 'string|max:50',
      phone: 'string|max:50',
      accountNumber: 'string|max:50',
      notes: 'string|max:255'
    })

    if (validation.passes()){
      const vendor = await db('vendors').insert(vendorData);
      vendors.value.push({...vendorData, id: vendor[0]});
      resetVendorData()
    } else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }finally {
    e.target.submitBtn.disabled = false;
  }
} // ./Add vendor


//Open Dialog
const openDialog = (vendor) => {
  vendorId.value = vendor.id;
  editVendorData.company = vendor.company;
  editVendorData.address = vendor.address;
  editVendorData.phone = vendor.phone;
  editVendorData.contactPerson = vendor.contactPerson;
  editVendorData.accountNumber = vendor.accountNumber;
  editVendorData.notes = vendor.notes;
  editDialog.value.showModal();
}

        //.......................Edit Vendor...............................
const editVendor = async () => {
  try {
    // validation
    let validation = new Validator(editVendorData,{
      company: 'required|string|min:5|max:150',
      address: 'string|max:100',
      contactPerson: 'string|max:50',
      phone: 'string|max:50',
      accountNumber: 'string|max:50',
      notes: 'string|max:255'
    })

    if (validation.passes()){

      await db('vendors').where('id', vendorId.value).first().update(editVendorData);
      editDialog.value.close();
      vendors.value.map(vendor => { //Update data in front end without reloading from database
        if (vendor.id.toString() === vendorId.value.toString()){
          vendor.company = editVendorData.company;
          vendor.address = editVendorData.address;
          vendor.contactPerson = editVendorData.contactPerson;
          vendor.phone =editVendorData.phone;
          vendor.accountNumber = editVendorData.accountNumber;
          vendor.notes = editVendorData.notes
        }
      })

    } else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message)
  }

} // ./Edit vendor


//.............Delete Vendor .........................
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
  ipcRenderer.send('confirm', { id:singleOrMultiple, type: 'vendor', message: 'Are you sure you want to delete this item(s)?' });
}

ipcRenderer.on('deleteVendor', async (event, args) => {
  try {
    await db('vendors').whereIn('id', args).del();
    selectedVendors.value = []; //clear selected vendor
    const newVendors = [];
    for (const v of vendors.value) {
      if (!args.includes(v.id)) newVendors.push(v)
    }
    vendors.value = newVendors;
  }catch (e) {
    if (e.code === "SQLITE_CONSTRAINT")
      ipcRenderer.send('errorMessage', errorMessages.sqlConstraint);
    else ipcRenderer.send('errorMessage', e.message);
  }
})//. /delete Customer

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
</script>

<style scoped>
.myTable th{
  padding: 10px 0;
}
.myTable input, .myTable textarea{
  width: 22em;
  padding: 4px;
}
</style>