<template>
  <div class="container-fluid">
    <h4 class="text-center" v-if="loading">Loading Data Please Wait... <span class="spinner-grow"></span></h4>
    <h4 class="text-center" v-else>&#128106;Manage Users</h4>
    <div class="row">
      <div class="col">

          <button class="p-1 fw-bold mb-2 btn-secondary" title="Add New User" @click="goToAddUser">
            <span class="pi pi-user-plus"></span>
             Add User
          </button>
          <button class="p-1 fw-bold mb-2 btn-danger mx-3" title="View Inactive Users" @click="goToInactiveUsers">
            <span class="pi pi-users"></span>
            Inactive Users
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
                           @click="toggleActive($event, data.id, data.isActive)">
                  </td>
                </template>
              </Column>
              <Column field="" header="Edit">
                <template #body="{data}">
                  <td>
                    <span type="button" title="Edit" @click="gotoEditUser(data)">&#128221;</span></td>
                </template>
              </Column>
              <Column field="" header="Delete">
                <template #body="{data}">
                  <td>
                    <span type="button" title="Delete" @click="confirmDelete(data.id)">&#10060;</span>
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
import {computed, ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import {useRouter} from "vue-router";
import errorMessages from "@/errorMessages";
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
          .where('isActive', true);

    }else {//If loggedIn user is manager
      users.value = await db('users')
          .where('isActive', true).where('role', '>', 1);
    }

    users.value = users.value.filter(u => u.id.toString() !== user.value.id.toString() )

  }
  catch (e){ ipcRenderer.send('errorMessage', e.message) }
  finally { loading.value = false; }
}
getUsers();

const goToAddUser = () => router.push({name: 'add-user'}); //go to add user page

const goToInactiveUsers = () => router.push({name: 'inactive-users'}); //go to inactive users page


//go to Edit users page
const gotoEditUser = (data) => {
  router.push({
    name: 'edit-user',
    params: {data: JSON.stringify({...data, password: undefined, isActive: undefined, username: undefined})}
  })
};


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



             //..................Delete User.........................................
const confirmDelete = (id) => {
  ipcRenderer.send('confirm', {id:id, type: 'user', message: 'Are you sure you want to delete this User?' } );
}
ipcRenderer.on('deleteUser', async (event, args) => {
  try {
    await db('users').where('id', args).del();
    users.value = users.value.filter(user => user.id.toString() !== args.toString());
  }catch (e) {
    if (e.code === "SQLITE_CONSTRAINT")
      ipcRenderer.send('errorMessage', errorMessages.sqlConstraint);
    else ipcRenderer.send('errorMessage', e.message);
  }
})

</script>

<style scoped>

</style>