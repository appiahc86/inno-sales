<template>
  <div class="container-fluid">
    <h4 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow"></span></h4>
    <h4 class="text-center" v-else>Inactive Users</h4>
    <div class="row">
      <div class="col">

          <button class="p-1 fw-bold mb-2 btn-success" title="Go To Users" @click="goBack">
            <span class="pi pi-arrow-circle-left"></span>
            Back
          </button>

          <div class="table-responsive">
            <DataTable :value="users" :paginator="true" dataKey="id" filterDisplay="menu" :rows="10" v-model:filters="filters"
                       class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                       :rowsPerPageOptions="[10,25,50]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                       :globalFilterFields="['firstName','lastname', 'username', 'phone']" responsiveLayout="scroll"
            >
              <template #header>
                <div class="d-flex justify-content-center align-items-center" style="height: 15px">
                  <h6 class="px-3">Users</h6>
                  <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value"
                                   placeholder="Keyword Search" style="height: 30px;"/>
                    </span>
                </div>
              </template>
              <template #empty>
                No Record Found.
              </template>

              <Column field="firstName" header="First Name" sortable class="data-table-font-size">
                <template #body="{data}">
                  <td class="text-capitalize">{{ data.firstName }}</td>
                </template>
              </Column>
              <Column field="lastName" header="Last Name" sortable class="data-table-font-size">
                <template #body="{data}">
                  <td class="text-capitalize">{{ data.lastName }}</td>
                </template>
              </Column>
              <Column field="username" header="Username" sortable class="data-table-font-size">
                <template #body="{data}">
                  <td><b>{{ data.username }}</b></td>
                </template>
              </Column>
              <Column field="phone" header="Phone" sortable bodyStyle="width:90px !important;" class="data-table-font-size"></Column>
              <Column field="dateAdded" header="Date Added" sortable class="data-table-font-size">
                <template #body="{data}">
                  <td>{{ new Date(data.dateAdded).toLocaleDateString() }}</td>
                </template>
              </Column>
              <Column field="isActive" header="Active" sortable class="data-table-font-size">
                <template #body="{data}">
                  <td>
                    <input type="checkbox" :checked="data.isActive" class="p-checkbox"
                      title="Mark As Active" @click="toggleActive($event, data.id, data.isActive)">
                  </td>
                </template>
              </Column>
            </DataTable>
          </div>
          <br>

      </div>
    </div>
  </div>
</template>

<script setup>
import db from "@/dbConfig/db";
import {ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import {useRouter} from "vue-router";
import {computed} from "vue";
import {useStore} from "vuex";

const users = ref([]);
const loading = ref(false);
const router = useRouter();
const store = useStore();

const user = computed(() => store.getters.user)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

//get all users
const getUsers = async () => {

  try {

    loading.value = true;

    if (parseInt(user.value.role) === 1){ //If loggedIn user is admin
      users.value = await db('users')
          .where('isActive', false);

    }else {//If loggedIn user is manager
      users.value = await db('users')
          .where('isActive', false).where('role', '>', 1);
    }

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }
}
getUsers();

const goBack = () => router.back(); //go back to users

//Toggle Active
const toggleActive = async (e, id, isActive) => {

  try {
    e.target.disabled = true;
    await db('users').where('id', id)
        .update({isActive: !isActive})

    users.value = users.value.filter(user => user.id.toString() !== id.toString())

  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
  finally { e.target.disabled = false; }

}

</script>

<style scoped>

</style>