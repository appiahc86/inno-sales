<template>
  <nav id="vendorsNav">
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button class="nav-link active" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#add-vendor" type="button" role="tab" aria-controls="nav-add-vendor" aria-selected="false">Add Vendor</button>
      <button class="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#all-vendors" type="button" role="tab" aria-controls="nav-home" aria-selected="true">All Vendors</button>
    </div>
  </nav>
  <div class="tab-content" id="nav-tabContent">

    <!--  Vendor Form  -->
    <div class="tab-pane mt-5 show active" id="add-vendor" role="tabpanel" aria-labelledby="nav-add-vendor-tab">
      <div class="card pb-4 pt-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-9">
              <form>
                <table class="w-100" id="formTable">

                  <tr>
                    <th class="w-25 text-center">Vendor Name</th>
                    <td class="w-50"><input type="text" maxlength="40" class="form-control-dark w-75"></td>
                  </tr>

                  <tr>
                    <th class="w-25 text-center">Company</th>
                    <td class="w-50"><input type="text" maxlength="60" class="form-control-dark w-75"></td>
                  </tr>

                  <tr>
                    <th class="w-25 text-center">Phone</th>
                    <td class="w-50"><input type="text" maxlength="36" class="form-control-dark w-75"></td>
                  </tr>

                  <tr>
                    <th class="w-25 text-center">Address</th>
                    <td><input type="text" maxlength="100" class="form-control-dark w-75"></td>
                  </tr>

                </table>
                <button class="w-10 mt-5 btn-secondary p-1" style="margin-left: 30%" name="submitBtn">Add Vendor</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!--  Vendors Table  -->
    <div class="tab-pane mt-2" id="all-vendors" role="tabpanel" aria-labelledby="nav-all-vendors-tab">
      <div class="table-responsive">
        <DataTable
            :value="vendors" :paginator="true" dataKey="id"
            class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
            filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedVendors"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['name','company', 'phone', 'address']" responsiveLayout="scroll"
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
            <h4 class="text-white"> Loading data. Please wait.</h4>
          </template>

          <Column selection-mode="multiple"></Column>

          <Column field="name" header="Name" sortable></Column>
          <Column field="company" header="Company" sortable></Column>
          <Column field="phone" header="Contact" sortable></Column>
          <Column field="address" header="Address" sortable></Column>

          <Column headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible">
            <template #body="{data}">
              <span type="button" title="Edit">&#128221;</span> &nbsp;
              <span type="button" title="Delete">&#10060;</span>
            </template>
          </Column>
        </DataTable>
      </div>
      <br>
      <button class="btn-secondary">
        <span class="pi pi-trash"></span>
        Delete Selection
      </button>
    </div>

  </div>

  <!--  Edit Dialog-->
  <dialog ref="editCustomerDialog">
    <h4>Edit Vendor</h4>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-12">
          <form>
            <table class="w-100" id="formTable">

              <tr>
                <th class="w-25 text-center">Vendor Name</th>
                <td class="w-50"><input type="text" maxlength="40" class="form-control-dark w-100"></td>
              </tr>

              <tr>
                <th class="w-25 text-center">Company</th>
                <td class="w-50"><input type="text" maxlength="60" class="form-control-dark w-100"></td>
              </tr>

              <tr>
                <th class="w-25 text-center">Phone</th>
                <td class="w-50"><input type="text" maxlength="36" class="form-control-dark w-100"></td>
              </tr>

              <tr>
                <th class="w-25 text-center">Address</th>
                <td><input type="text" maxlength="100" class="form-control-dark w-100"></td>
              </tr>

            </table>
            <button class="mt-5 btn-secondary p-1" type="submit">Save</button>
            <button type="button" class="w-25 mx-4 p-1">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </dialog>

</template>

<script setup>

import { ref } from "vue";
import { FilterMatchMode } from "primevue/api";

const selectedVendors = ref([]);
const vendors = ref([])
const loading = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
</script>

<style scoped>

</style>