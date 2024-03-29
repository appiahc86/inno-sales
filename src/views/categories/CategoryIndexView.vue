<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-7 mt-4">
        <form @submit.prevent="saveCategory">
              <label class="w-50">
                <span class="fw-bold" id="label">Enter Category</span>
                <input type="text" v-model.trim="name" maxlength="100" class="form-control form-control-dark">
              </label>&nbsp;
          <button ref="saveButton" class="btn-secondary p-1 px-3">
          <span class="pi pi-save"></span><b> Save</b>
          </button>
        </form>
      </div>

      <div class="col-5 mt-4">
      <!--   Table     -->
        <h6 class="text-success"><span class="pi pi-info-circle fw-bold"></span> Right-click on a row to show the context menu.</h6>
        <div class="table-responsive">

          <DataTable
              :value="categories" :paginator="true"
              class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
              filterDisplay="menu" :rows="10" v-model:filters="filters"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10, 15, 25]" v-model:selection="selectedRecord"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :globalFilterFields="['name']" responsiveLayout="scroll"
              contextMenu v-model:contextMenuSelection="selectedCategory" @row-contextmenu="onRowContextMenu"
          >
            <template #header>
              <div class="d-flex justify-content-center align-items-center" style="height: 15px">
                <h6 class="px-3">Categories</h6>
                <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Search Category" style="height: 30px;"/>
                    </span>
              </div>
            </template>
            <template #empty>
              No Category found.
            </template>
            <Column selection-mode="single" class="data-table-font-size" style="width: 20px;"></Column>
            <Column field="name" header="Name" sortable style="font-size: 0.85em;">
              <template #body="{data}">
                <td class="text-capitalize">{{ data.name }}</td>
              </template>
            </Column>

          </DataTable>

          <ContextMenu :model="menuModel" ref="cm" style="font-size: 1em;" />

        </div>
      </div>

    </div>
  </div>

<dialog ref="editDialog" style="border: 1px solid #ccc; padding: 20px;" class="shadow shadow-lg">
  <form @submit.prevent="editCategory">
    <h5>Edit this record?</h5>
    <label><b>Name</b> <input type="text" maxlength="20" class="form-control-dark p-1" v-model.trim="editName"></label>&nbsp;
    <button type="submit" class="p-1 px-3 fw-bold bg-dark text-white">Save</button>&nbsp;
    <button type="button" @click="editDialog.close()" class="p-1 px-2 fw-bold">Cancel</button>
  </form>
</dialog>

</template>

<script setup>
import db from "@/dbConfig/db";
import {ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import errorMessages from "@/errorMessages";
import {useStore} from "vuex";

    const selectedRecord = ref();
    const store = useStore();
    const name = ref('');
    const  categories = ref([])
    const saveButton = ref(null);
    const editName = ref('');
    let editId = null;
    const editDialog = ref(null);
    const cm = ref();

    const menuModel = ref([
      {label: 'Edit', icon: 'pi pi-pencil', command: () => showModal(selectedCategory.value.id, selectedCategory.value.name)},
      {label: 'Delete', icon: 'pi pi-trash', command: () => confirmDelete(selectedCategory.value.id)}
    ]);
    const selectedCategory = ref();
    const onRowContextMenu = (event) => {
      selectedRecord.value = null;
      selectedRecord.value = event.data;
      cm.value.show(event.originalEvent);
    }

    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    //Get all Categories
    const getCategories = async () => {
      try {
        categories.value =  await db.select().from('categories').orderBy('name', 'asc');
      }catch (e) { ipcRenderer.send('errorMessage', e.message) }
    }
    getCategories();


    //Save category
    const saveCategory = async () => {
      try {
        saveButton.value.disabled = true;
        const categoryName = name.value.toLowerCase()
        //validation
        if (!name.value) return ipcRenderer.send('errorMessage', "Category name cannot be empty")

          //Save record
         const newCat =  await db('categories').insert({ name: categoryName });
          name.value = '';
          categories.value.push({ id: newCat[0], name: categoryName });

      }catch (e){
        if(e.code === "SQLITE_CONSTRAINT") return ipcRenderer.send('errorMessage', 'Record already exists')
        ipcRenderer.send('errorMessage', e.message)
      }finally {
        saveButton.value.disabled = false;
      }

    } // ./save category


    //Edit Category
    const editCategory = async () => {
      try {
        //Validation
        if (!editName.value) return ipcRenderer.send('errorMessage', "Category name cannot be empty");

        //Save data
        await db('categories').where({id: editId } ).first().update({ name:editName.value.toLowerCase() });
        editDialog.value.close()

        //edit in front end
        for (const cat of categories.value) {
          if (cat.id.toString() === editId.toString()) {
            cat.name = editName.value.toLowerCase();
            break;
          }
        }
        editId = null;

      }catch (e) {
        if(e.code === "SQLITE_CONSTRAINT") return ipcRenderer.send('errorMessage', 'Record already exists')
        ipcRenderer.send('errorMessage', e.message)
      }
    } // ./Edit Category


    //Delete Category
    const confirmDelete = (id) => ipcRenderer.send('confirm', {id:id, type: 'category', message: 'Are you sure you want to delete this item?' } )

    ipcRenderer.on('deleteCategory', async (event, id ) => {
      try {
          await db('categories').where({id}).del();
        categories.value = categories.value.filter(cat => parseInt(cat.id) !== parseInt(id));
      }catch (e){
        if (e.code === "SQLITE_CONSTRAINT")
          ipcRenderer.send('errorMessage', errorMessages.sqlConstraint);
        else ipcRenderer.send('errorMessage', e.message);
      }
    }) // ./Delete Category


    //Show edit modal
    const showModal = (id, name) => {
      editId = id;
      editName.value = name;
      editDialog.value.showModal()
    }

</script>

<style scoped>
#label{
  font-size: 1.3em;
}
</style>