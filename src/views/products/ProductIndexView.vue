<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">



        <div class="myTabs-container">
          <button class="px-3 myTabs" :class="{ active: firstActive}"
                  type="button" @click="secondActive = false; firstActive = true">Add Product
          </button>

          <button class="px-3 myTabs mx-2" :class="{ active: secondActive}"
                  type="button" @click="firstActive = false; secondActive = true">
            Products List</button>
        </div>




            <!-- Add Product -->
            <div v-if="firstActive" style="margin-top: 10vh">
              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-md-10">

                    <form @submit.prevent="addProduct">
                      <table class="w-100 myTable">
                        <tr>
                          <th></th>
                          <td>
                            <h4>Add A New Product</h4>
                          </td>
                        </tr>
                        <tr>
                          <th class="float-end"><span class="pi pi-cog"></span> Category &nbsp;</th>
                          <td>
                            <div class="input-group">

                              <v-select :options="categories" label="name"
                                        v-model="productData.category" class="form-control-dark select">
                              </v-select>


                              <div class="input-group-text text-success">
                          <span class="pi pi-plus-circle" title="Add New Category"
                                style="cursor: pointer; font-size: 1.3em;"
                                @click="openCategoryDialog"></span>
                              </div>
                            </div>

                          </td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-tag"></span> Product Name &nbsp;</th>
                          <td><input type="text" class="form-control-dark" v-model.trim="productData.productName"></td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-money-bill"></span> Buying Price &nbsp;</th>
                          <td><input type="number" step="any" min="0" class="form-control-dark"
                               v-model.number="productData.buyingPrice" oninput="validity.valid || (value = '')"></td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-money-bill"></span> Selling Price &nbsp;</th>
                          <td><input type="number" step="any" min="0" class="form-control-dark"
                               v-model.number="productData.sellingPrice"  oninput="validity.valid || (value = '')"></td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-sort-numeric-up"></span> Quantity &nbsp;</th>
                          <td><input type="number" step="1" min="0" class="form-control-dark"
                                     v-model.number="productData.quantity" oninput="validity.valid || (value = 0)"></td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-clock"></span> Expiration Date &nbsp;</th>
                          <td>
                            <input type="date" class="form-control-dark"
                                  v-model="productData.expiration" onkeydown="return false">
                          </td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-money-bill"></span> Tax &nbsp;</th>
                          <td>
                            <select class="form-control-dark select" v-model="productData.tax">
                              <option value="tax">Tax</option>
                              <option value="non">Non</option>
                            </select>
                          </td>
                        </tr>

                        <tr>
                          <th class="float-end"><span class="pi pi-list"></span> Description &nbsp;</th>
                          <td><textarea class="form-control-dark" cols="10" rows="3" v-model.trim="productData.description"></textarea></td>
                        </tr>

                        <tr>
                          <th class="float-end"></th>
                          <td>
                            <button class=" mt-1 btn-secondary" type="submit" style="width: 26em;" name="addProductBtn">
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


        <!-- Products Table  -->
          <div :style="{ display: secondActive ? 'block' : 'none'}">
            <h6 class="text-success mt-3">
              <span class="pi pi-info-circle fw-bold"></span>
              Right-click on a row to show the context menu.
            </h6>
            <div class="table-responsive">
              <DataTable
                  :value="products" :paginator="true" dataKey="id"
                  class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                  filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedProducts"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                  :globalFilterFields="['productName','category', 'description']" responsiveLayout="scroll"
                  contextMenu v-model:contextMenuSelection="selectedRow" @row-contextmenu="onRowContextMenu"
              >
                <template #header>
                  <div class="d-flex justify-content-center align-items-center" style="height: 15px">
                    <h6 class="px-3">Products</h6>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value"
                                   placeholder="Keyword Search" style="height: 30px;"/>
                    </span>
                  </div>
                </template>
                <template #empty>
                  No product found.
                </template>
                <template #loading>
                  <h4 class="text-white"> Loading data. Please wait.</h4>
                </template>

                <Column selection-mode="multiple" class="data-table-font-size" style="width: 20px;"></Column>

                <Column field="productName" header="Product" sortable class="data-table-font-size">
                  <template #body="{data}">
                    <td :style="{color: data.quantity < 5 ? 'red' : '' }">{{ data.productName }}</td>
                  </template>
                </Column>
                <Column field="category" header="Category" sortable class="data-table-font-size">
                  <template #body="{data}">
                    <td class="text-capitalize">{{ data.category }}</td>
                  </template>
                </Column>
                <Column header="Expiration" sortable class="data-table-font-size" style="width: 20px;">
                  <template #body="{data}">
                    <td >{{ data.expiration ? new Date(data.expiration).toLocaleDateString() : '' }}</td>
                  </template>
                </Column>
                <Column field="buyingPrice" header="Buying Price" sortable class="data-table-font-size">
                  <template #body="{data}">
                    <td>{{ formatNumber(parseFloat(data.buyingPrice)) }}</td>
                  </template>
                </Column>
                <Column field="sellingPrice" header="Selling Price" sortable class="data-table-font-size">
                  <template #body="{data}">
                    <td><b>{{ formatNumber(parseFloat(data.sellingPrice)) }}</b></td>
                  </template>
                </Column>
                <Column field="quantity" header="Qty" sortable bodyStyle="width:90px !important;" class="data-table-font-size"></Column>

              </DataTable>
              <ContextMenu :model="menuModel" ref="cm" class="context-menu" style="font-size: 0.9em;" />
            </div>
            <br>
            <button class="btn-secondary" v-if="selectedProducts.length" @click="confirmDelete(selectedProducts)">
              <span class="pi pi-trash"></span>
              Delete Selection
            </button>
          </div>



        <!--  Edit Dialog-->
        <dialog ref="editProductDialog" style="border: 2px solid #ccc;" name="dialog">
          <h4>Edit product</h4>
          <div class="container-fluid">
            <div class="p-5" v-if="detailsLoading">
              <h5 class="text-center">Loading... <span class="spinner-border spinner-border-sm"></span></h5>
            </div>
            <div class="row justify-content-center" v-else>
              <div class="col-md-12">
                <form @submit.prevent="editProduct">
                  <table class="w-100 myTable">

                    <tr>
                      <th class="float-end"><span class="pi pi-cog"></span> Category &nbsp;</th>
                      <td>
                        <select class="form-control-dark select text-capitalize" v-model="editProductData.category">
                          <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                          </option>
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <th class="float-end"><span class="pi pi-tag"></span> Product Name &nbsp;</th>
                      <td><input type="text" class="form-control-dark" v-model.trim="editProductData.productName"></td>
                    </tr>


                    <tr>
                      <th class="float-end"><span class="pi pi-money-bill"></span> Tax &nbsp;</th>
                      <td>
                        <select class="form-control-dark select" v-model="editProductData.tax">
                          <option value="tax">Tax</option>
                          <option value="non">Non</option>
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <th class="float-end"><span class="pi pi-clock"></span> Expiration Date &nbsp;</th>
                      <td>
                        <input type="date" class="form-control-dark"
                               v-model="editProductData.expiration" onkeydown="return false">
                      </td>
                    </tr>

                    <tr>
                      <th class="float-end"><span class="pi pi-list"></span> Description &nbsp;</th>
                      <td><textarea class="form-control-dark" cols="10" rows="3"
                                    v-model.trim="editProductData.description"></textarea></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td colspan="2">
                        <button name="addProductBtn" class="btn-secondary p-1 fw-bold" type="submit" style="width: 49%;">Save</button>
                        <span style="width: 1%">&nbsp;</span>
                        <button name="addProductBtn" class="p-1 fw-bold" type="button" @click="editProductDialog.close()" style="width: 49%;">Cancel</button>
                      </td>
                    </tr>

                  </table>
                </form>
              </div>
            </div>
          </div>
        </dialog>


        <!--  View Details Dialog-->
        <dialog ref="detailsDialog" draggable style="min-width: 500px; border: 2px solid #ccc;">
          <button class="text-white bg-danger" style="float: right;" @click="detailsDialog.close()">X</button><br>

          <div class="container-fluid">
            <div class="p-5" v-if="detailsLoading">
              <h5 class="text-center">Loading... <span class="spinner-border spinner-border-sm"></span></h5>
            </div>
            <div class="row" v-else>
              <div class="col" v-if="productDetails">

                  <h5 class="text-center"><b>{{ productDetails.productName }}</b></h5>

                <div class="table-responsive" style="height: 350px;">
                  <table class="table table-sm table-striped table-hover">
                    <thead>
                    <tr>
                      <th>Category</th>
                      <td class="text-capitalize">{{ productDetails.category }}</td>
                    </tr>
                    <tr>
                      <th>Expiration</th>
                      <td>{{ productDetails.expiration ? new Date(productDetails.expiration).toLocaleDateString() : '' }}</td>
                    </tr>
                    <tr>
                      <th>Buying Price</th>
                      <td>{{ formatNumber(parseFloat(productDetails.buyingPrice)) }}</td>
                    </tr>
                    <tr>
                      <th>Selling Price</th>
                      <td>{{ formatNumber(parseFloat(productDetails.sellingPrice)) }}</td>
                    </tr>
                    <tr>
                      <th>Quantity</th>
                      <td>{{ productDetails.quantity }}</td>
                    </tr>
                    <tr>
                      <th>Tax</th>
                      <td class="text-capitalize">{{ productDetails.tax }}</td>
                    </tr>
                    <tr>
                      <th>Date Added</th>
                      <td>
                        {{ productDetails.dateAdded ? new Date(productDetails.dateAdded).toLocaleDateString() : '' }}
                      </td>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                  <h6 class="text-center">Description</h6>
                  <textarea cols="10" rows="4" class="w-100" disabled>{{ productDetails.description }}</textarea>
                </div>
              </div>
            </div>
          </div>
        </dialog>


        <!--  Category Dialog -->
        <dialog ref="categoryDialog" style="border: 2px solid #ccc;">

          <button class="bg-danger text-white float-end" title="Close" @click="categoryDialog.close()"><b>X</b></button>

          <div class="clearfix"></div>

          <form @submit.prevent="addCategory" class="my-3">
            <label><b>Category Name</b> <input type="text" class="form-control-dark p-1" v-model.trim="categoryName" id="catInput"></label>
            &nbsp;
            <button type="submit" name="submitBtn"><span class="pi pi-save px-2 py-1"></span><b>Save</b></button>
          </form>
        </dialog>


      </div>
    </div>
  </div>


</template>

<script setup>
import {reactive, ref} from "vue";
import * as Validator from "validatorjs";
import db from "@/dbConfig/db";
import { FilterMatchMode } from "primevue/api";
import { formatNumber } from "@/functions";
import {useStore} from "vuex";
const firstActive = ref(true);
const secondActive = ref(false);


    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const selectedProducts = ref([]);
    const store = useStore();
    const loading = ref(false);
    const detailsLoading = ref(false);
    const categories = ref([]);
    const products = ref([]);
    const productDetails = ref();
    const detailsDialog = ref();
    const categoryDialog = ref(null);
    const editProductDialog = ref(null);
    const categoryName = ref('');

    const productData = reactive({
      productName: '',
      quantity: 0,
      description: '',
      buyingPrice: '',
      sellingPrice: '',
      category: null,
      tax: 'tax',
      expiration: null
    })

    const editProductData = reactive({
      id: '',
      productName: '',
      // quantity: '',
      description: '',
      expiration: null,
      // buyingPrice: '',
      // sellingPrice: '',
      category: '',
      categoryName: '',
      tax: ''
    });

//For row context menu
const cm = ref();
const selectedRow = ref();
const menuModel = ref([
  {label: 'Edit', icon: 'pi pi-pencil', command: () => openDialog(selectedRow.value.id), class: 'fw-bold'},
  {separator: true},
  {label: 'Delete', icon: 'pi pi-trash', command: () => confirmDelete(selectedRow.value.id), class: 'fw-bold'},
  {separator: true},
  {label: 'View Details', icon: 'pi pi-eye-slash', command: () => viewDetails(selectedRow.value.id), class: 'fw-bold'}
]);

const onRowContextMenu = (event) => {
  selectedProducts.value = [];
  selectedProducts.value.push(event.data);
  cm.value.show(event.originalEvent);
}




//Get all Categories
const getCategories = async () => {
  try {
    categories.value =  await db.select().from('categories').orderBy('name', 'asc');
  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
}
getCategories();

    //get all products
    const getAllProducts = async () => {

      try {

        loading.value = true;

          products.value = await db('products')
              .leftJoin('categories', 'products.category', '=','categories.id')
              .select('products.id',
                  'products.productName',
                  'products.buyingPrice',
                  'products.sellingPrice',
                  'products.quantity',
                  'products.expiration',
                  'categories.name as category',
                  'categories.id as categoryId'
              )

      }
      catch (e){ ipcRenderer.send('errorMessage', e.message) }
      finally {
        loading.value = false;
      }


    }
    getAllProducts();


    //View product details
    const viewDetails = async (id) => {
      try {
        productDetails.value = null;
        detailsDialog.value.showModal();
        detailsLoading.value = true;

       productDetails.value = await db('products')
           .leftJoin('categories', 'products.category', '=','categories.id')
           .select(
               'products.productName',
               'products.buyingPrice',
               'products.sellingPrice',
               'products.quantity',
               'products.tax',
               'products.description',
               'products.expiration',
               'products.dateAdded',
               'categories.name as category'
           )
           .where('products.id', id)
           .first();

      }catch (e) {
        ipcRenderer.send('errorMessage', e.message)
      }finally {
        detailsLoading.value = false;
      }
    }


    //Reset Product from data
    const resetProductData = () => {
      productData.productName = ''; productData.quantity = 0; productData.description = '';
      productData.buyingPrice = ''; productData.sellingPrice = ''; productData.category = null;
      productData.tax = 'tax'; productData.expiration = null
    }
//Reset Product from data
const resetEditProductData = () => {
  editProductData.productName = ''; editProductData.id = ''; editProductData.description = '';
  editProductData.expiration = null; editProductData.category = ''; editProductData.tax = 'tax'; editProductData.categoryName = ''
}

      // Add product
    const addProduct = async (e) => {


      try {
        // validation
        let validation = new Validator(productData,{
          category: 'required',
          productName: 'required|string|min:2|max:100',
          buyingPrice: 'required|numeric',
          sellingPrice: 'required|numeric',
          quantity: 'required|integer|min:0',
          tax: 'required',
          description: 'string|max:100'
        })

        if (validation.passes()){ // If validation passes
          e.target.addProductBtn.disabled = true
          productData.category = productData.category.id;

          const product = await db('products')
              .insert({
                ...productData,
                expiration:   productData.expiration ? productData.expiration : ''
              });

          //Update on front-end
          const cat = categories.value.filter(c => c.id.toString() === productData.category.toString());
          products.value.push({ ...productData, id: product[0], categoryId: productData.category, category: cat[0].name })

          //push to vuex store products
          store.dispatch("productsModule/addProduct", {
            ...productData, id: product[0]
          })
          resetProductData();

        }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

      }catch (e) {ipcRenderer.send('errorMessage', e.message)}
      finally {
        e.target.addProductBtn.disabled = false
      }

    } // ./Add product


    //Edit Product
    const editProduct = async () => {

      try {
        // validation
        let validation = new Validator(editProductData,{
          category: 'required',
          productName: 'required|string|min:2|max:100',
          // buyingPrice: 'required|numeric',
          // sellingPrice: 'required|numeric',
          // quantity: 'required|numeric',
          tax: 'required',
          description: 'string|max:100'
        })

        if (validation.passes()){ // If validation passes
          await db('products')
              .where('id', editProductData.id)
              .first()
              .update({
                ...editProductData,
                id: undefined,
                categoryName: undefined,
                expiration: editProductData.expiration ? editProductData.expiration : undefined
              });
          editProductDialog.value.close(); // Close edit dialog

          products.value.map(product => { //Update data in front end without reloading from database
            if (product.id === editProductData.id){
              const cat = categories.value.filter(c => c.id.toString() === editProductData.category.toString());
              // product.buyingPrice = parseFloat(editProductData.buyingPrice);
              product.category = cat[0].name;
              product.categoryId = editProductData.category;
              product.description = editProductData.description;
              product.tax = editProductData.tax;
              product.id = editProductData.id;
              product.productName = editProductData.productName;
              product.expiration = editProductData.expiration ? editProductData.expiration : product.expiration;
              // product.quantity = editProductData.quantity;
              // product.sellingPrice = parseFloat(editProductData.sellingPrice);
            }
          })

          //Update product expiration date in vuex store
          if (editProductData.expiration){
            store.dispatch("productsModule/modifyDate", {
              id: editProductData.id,
              date: editProductData.expiration
            })
          }

        }else ipcRenderer.send('errorMessage', `${ Object.values(validation.errors.all())[0] }`)
      }catch (e) { ipcRenderer.send('errorMessage', e.message) }

    }// ./Edit product


    //Delete product
    const confirmDelete = (id) => {
      let singleOrMultiple = id;

      if (typeof singleOrMultiple === 'object'){ // check if user selected multiple items
        const ids = [];
        const convertToArray = Object.values(id)
        for (const item of convertToArray) {
          ids.push(item.id);
        }
        singleOrMultiple = ids;
      }else { singleOrMultiple = [singleOrMultiple]} //If user selected a single record

      ipcRenderer.send('confirm', {id: singleOrMultiple, type: 'product', message: 'Are you sure you want to delete this item(s)?'})
    }

    ipcRenderer.on('deleteProduct', async (event, args) => {
      try {
        await db('products').whereIn('id', args).del();
        selectedProducts.value = []; //clear selected products
        const newPros = [];
        for (const p of products.value) {
          if (!args.includes(p.id)) newPros.push(p)
        }

        products.value = newPros;

        //Update in vuex store
        store.dispatch("productsModule/deleteProduct", args);

      }catch (e){
        ipcRenderer.send('errorMessage', e.message);
      }
    }) // ./Delete Product

    // open dialog for editing product
    const openDialog = async (id) => {

      try {
        resetEditProductData();
        editProductDialog.value.showModal();
        detailsLoading.value = true; //Use detail loading icon instead of creating new variable

        const query =  await db('products')
            .leftJoin('categories', 'products.category', '=','categories.id')
            .select(
                'products.id',
                'products.productName',
                'products.tax',
                'products.description',
                'products.expiration',
                'categories.id as categoryId',
                'categories.name as category'
            )
            .where('products.id', id)
            .first();

        if (query.expiration){
          let yyyy = new Date(query.expiration).getFullYear();
          let mm = ( new Date(query.expiration).getMonth() + 1) < 10 ? '0' + ( new Date(query.expiration).getMonth() + 1) : new Date(query.expiration).getMonth() + 1;
          let dd = ( new Date(query.expiration).getDate()) < 10 ? '0' + ( new Date(query.expiration).getDate()) : ( new Date(query.expiration).getDate());
          editProductData.expiration = `${yyyy}-${mm}-${dd}`;
        }else editProductData.expiration = null;


        editProductData.id = id;

        editProductData.productName = query.productName;
        editProductData.description = query.description;
        editProductData.category = query.categoryId;
        editProductData.categoryName = query.category;
        editProductData.tax = query.tax;

      }catch (e) {
        ipcRenderer.send('errorMessage', e.message)
      }finally {
        detailsLoading.value = false; //Use detail loading icon instead of creating new variable
      }


    }


    //Add category
const openCategoryDialog = (e) => {
  categoryName.value = '';
  categoryDialog.value.showModal();
  document.querySelector("#catInput").focus();
}
    const addCategory = async (e) => {
      try {
        e.target.submitBtn.disabled = true;
        const cat = categoryName.value.toLowerCase()
        //validation
        if (!cat) return ipcRenderer.send('errorMessage', "Category name cannot be empty")

        //Save record
        const newCat =  await db('categories').insert({ name: cat });
        categories.value.push({ id: newCat[0], name: cat });
        productData.category = { id: newCat[0], name: cat } //select this category in the dropdown
        categoryDialog.value.close();
        categoryName.value = '';

      }catch (e){
        if(e.code === "SQLITE_CONSTRAINT") return ipcRenderer.send('errorMessage', 'Record already exists')
        ipcRenderer.send('errorMessage', e.message)
      }finally {
        e.target.submitBtn.disabled = false;
      }
    }

</script>

<style scoped>

.form-control-dark{
  padding: 5px;
}

.myTable th{
  padding: 13px 0;
}

.myTable input, .myTable textarea, .myTable .select{
  width: 26em;
  padding: 5px;
}

</style>