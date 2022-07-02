<template>
  <nav id="productsNav">
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button class="nav-link active" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#add-product" type="button" role="tab" aria-controls="nav-add-product" aria-selected="false">Add Product</button>
      <button class="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#all-products" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Products List</button>
    </div>
  </nav>
  <div class="tab-content" id="nav-tabContent">

    <!--  product Form  -->
      <div class="tab-pane mt-5 show active" id="add-product" role="tabpanel" aria-labelledby="nav-add-product-tab">
        <div class="card pb-4 pt-4">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-9">
                <form @submit.prevent="addProduct">
                  <table class="formTable">
                    <tr>
                      <th class="w-10">Category</th>
                      <td class="w-40">
                        <select class="form-control-dark w-75" v-model="productData.category">
                          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name.toUpperCase() }}</option>
                        </select>
                      </td>
                      <th class="w-10">Product Name</th>
                      <td class="w-40"><input type="text" class="form-control-dark w-75" v-model.trim="productData.productName"></td>
                    </tr>

                    <tr>
                      <th class="w-10">Buying Price</th>
                      <td class="w-40"><input type="number" step="0.01" min="0" class="form-control-dark w-75" v-model.number="productData.buyingPrice"></td>
                      <th class="w-10">Selling Price</th>
                      <td class="w-40"><input type="number" step="0.01" min="0" class="form-control-dark w-75" v-model.number="productData.sellingPrice"></td>
                    </tr>


                    <tr>
                      <th>Quantity</th>
                      <td><input type="number" class="form-control-dark w-75" v-model.number="productData.quantity"></td>
                      <th>Tax</th>
                      <td>
                        <select class="form-control-dark w-75" v-model="productData.tax">
                          <option value="tax">Tax</option>
                          <option value="non">Non</option>
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <th>Description</th>
                      <td><textarea class="form-control-dark w-75" cols="10" rows="3" v-model.trim="productData.description"></textarea></td>
                      <th></th>
                      <td><button name="addProductBtn" class="btn-secondary p-1" type="submit">
                       <span class="pi pi-save"></span>  Add Product
                      </button></td>
                    </tr>

                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>



<!--  Products Table  -->
    <div class="tab-pane mt-2" id="all-products" role="tabpanel" aria-labelledby="nav-all-products-tab">
     <div class="table-responsive">
         <DataTable
             :value="products" :paginator="true" dataKey="id"
             class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines p"
             filterDisplay="menu" :rows="10" v-model:filters="filters" :loading="loading"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
             :rowsPerPageOptions="[10,25,50]" v-model:selection="selectedProducts"
             currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
             :globalFilterFields="['productName','category', 'description']" responsiveLayout="scroll"
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

             <Column selection-mode="multiple" style="font-size: 0.85em;"></Column>

           <Column field="productName" header="Product" sortable style="font-size: 0.85em;">
             <template #body="{data}">
               <td :style="{color: data.quantity < 5 ? 'red' : '' }">{{ data.productName }}</td>
             </template>
           </Column>
           <Column field="category" header="Category" sortable style="font-size: 0.85em;"></Column>
           <Column field="buyingPrice" header="Buy. Price" sortable style="font-size: 0.85em;"></Column>
           <Column field="sellingPrice" header="Sel. Price" sortable style="font-size: 0.85em;"></Column>
           <Column field="quantity" header="Qty" sortable bodyStyle="width:90px !important;" style="font-size: 0.85em;"></Column>
           <Column field="tax" header="Tax" sortable style="font-size: 0.85em;"></Column>
           <Column field="description" header="Desc" sortable style="font-size: 0.85em;"></Column>

           <Column headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible" style="font-size: 0.85em;">
             <template #body="{data}">
               <span type="button" title="Edit" @click="openDialog(data)">&#128221;</span> &nbsp;
               <span type="button" title="Delete" @click="confirmDelete(data.id)">&#10060;</span>
             </template>
           </Column>
         </DataTable>
     </div>
      <br>
      <button class="btn-secondary" v-if="selectedProducts.length" @click="confirmDelete(selectedProducts)">
        <span class="pi pi-trash"></span>
        Delete Selection
      </button>
    </div>

  </div>

<!--  Edit Dialog-->
  <dialog ref="editProductDialog">
    <h4>Edit product</h4>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-12">
          <form @submit.prevent="editProduct">
            <table class="formTable">
              <tr>
                <th class="w-10">Category</th>
                <td class="w-40">
                  <select class="form-control-dark w-100" v-model="editProductData.category">
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name.toUpperCase() }}</option>
                  </select>
                </td>
                <th class="w-10">Product Name</th>
                <td class="w-40"><input type="text" class="form-control-dark w-100" v-model.trim="editProductData.productName"></td>
              </tr>

              <tr>
                <th class="w-10">Buying Price</th>
                <td class="w-40"><input type="number" step="0.01" min="0" class="form-control-dark w-100" v-model.number="editProductData.buyingPrice"></td>
                <th class="w-10">Selling Price</th>
                <td class="w-40"><input type="number" step="0.01" min="0" class="form-control-dark w-100" v-model.number="editProductData.sellingPrice"></td>
              </tr>


              <tr>
                <th class="w-10">Quantity</th>
                <td class="w-40"><input type="number" class="form-control-dark w-100" v-model.number="editProductData.quantity"></td>
                <th class="w-10">Tax</th>
                <td class="w-40">
                  <select class="form-control-dark w-100" v-model="editProductData.tax">
                    <option value="tax">Tax</option>
                    <option value="non">Non</option>
                  </select>
                </td>
              </tr>

              <tr>
                <th class="w-10">Description</th>
                <td class="w-40"><textarea class="form-control-dark w-100" cols="10" rows="3" v-model.trim="editProductData.description"></textarea></td>
                <th class="w-10"></th>
                <td class="w-40">
                <button name="addProductBtn" class="btn-secondary p-1 w-50" type="submit">Save</button>&nbsp;
                  <button name="addProductBtn" class="btn-outline-dark p-1 w-40" type="button" @click="editProductDialog.close()">cancel</button>
                </td>

              </tr>

            </table>
          </form>
        </div>
      </div>
    </div>
  </dialog>

</template>

<script setup>
import { reactive, ref } from "vue";
import * as Validator from "validatorjs";
import db from "@/dbConfig/db";
import { FilterMatchMode } from "primevue/api";
import { formatNumber } from "@/functions";


    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });


    const selectedProducts = ref([]);

    const loading = ref(false);
    const categories = ref([]);
    const products = ref([]);
    const editProductDialog = ref(null)
    const productData = reactive({
      productName: '',
      quantity: '',
      description: '',
      buyingPrice: '',
      sellingPrice: '',
      category: '',
      tax: 'tax'
    })

    const editProductData = reactive({
      id: '',
      productName: '',
      quantity: '',
      description: '',
      buyingPrice: '',
      sellingPrice: '',
      category: '',
      categoryName: '',
      tax: ''
    })




    //Get all categories
    const getAllCategories = async () => {
      try {
        categories.value = await db.select().from('categories').orderBy('name', 'asc');
      }catch (e){
        ipcRenderer.send('errorMessage', e.message)
      }
    }
    getAllCategories(); // ./get all categories

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
                  'products.tax',
                  'products.description',
                  'categories.name as category',
                  'categories.id as categoryId'
              )
          products.value.map(product => {
            product.sellingPrice = formatNumber(parseFloat(product.sellingPrice))
            product.buyingPrice = formatNumber(parseFloat(product.buyingPrice))
          })


      }
      catch (e){ ipcRenderer.send('errorMessage', e.message) }
      finally { loading.value = false; }


    }
    getAllProducts();


    //Reset Product from data
    const resetProductData = () => {
      productData.productName = ''; productData.quantity = ''; productData.description = '';
      productData.buyingPrice = ''; productData.sellingPrice = ''; productData.category = '';
      productData.tax = 'tax';
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
          e.target.addProductBtn.innerText = 'Processing...'

          await db('products').insert(productData);
          resetProductData();
          getAllProducts(); //TODO update in front end

        }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

      }catch (e) {ipcRenderer.send('errorMessage', e.message)}
      finally {
        e.target.addProductBtn.disabled = false
        e.target.addProductBtn.innerText = 'Add Product'
      }

    } // ./Add product


    //Edit Product
    const editProduct = async () => {

      try {
        // validation
        let validation = new Validator(editProductData,{
          category: 'required',
          productName: 'required|string|min:2|max:100',
          buyingPrice: 'required|numeric',
          sellingPrice: 'required|numeric',
          quantity: 'required|numeric',
          tax: 'required',
          description: 'string|max:100'
        })

        if (validation.passes()){ // If validation passes

          await db('products').where('id', editProductData.id).first().update({...editProductData, id: undefined, categoryName: undefined});
          editProductDialog.value.close(); // Close edit dialog
          products.value.map(product => { //Update data in front end without reloading from database
            if (product.id === editProductData.id){
              const cat = categories.value.filter(c => c.id.toString() === editProductData.category.toString());
              product.buyingPrice = formatNumber(parseFloat(editProductData.buyingPrice));
              product.category = cat[0].name;
              product.categoryId = editProductData.category;
              product.description = editProductData.description;
              product.tax = editProductData.tax;
              product.id = editProductData.id;
              product.productName = editProductData.productName;
              product.quantity = editProductData.quantity;
              product.sellingPrice = formatNumber(parseFloat(editProductData.sellingPrice));
            };
          })

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

      ipcRenderer.send('confirm', {id: singleOrMultiple, type: 'product'})
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

      }catch (e){
        ipcRenderer.send('errorMessage', e.message);
      }
    }) // ./Delete Product


    // open dialog for editing product
    const openDialog = (data) => {
          editProductData.id = data.id;

          editProductData.productName = data.productName;
          editProductData.quantity = data.quantity;
          editProductData.description = data.description;
          editProductData.buyingPrice = data.buyingPrice.replaceAll(',','');
          editProductData.sellingPrice = data.sellingPrice.replaceAll(',','');
          editProductData.category = data.categoryId;
          editProductData.categoryName = data.category;
          editProductData.tax = data.tax;
      editProductDialog.value.showModal()
    }

</script>

<style scoped>

#nav-tab button{
  color: black;
}
#nav-tab button.active{
  color: #b02a37;
  font-weight: bold;
}
.form-control-dark{
  width: 70%;
  padding: 5px;
}

.formTable td, .formTable th{
  padding: 10px  5px;
}
.w-10{
  width: 10%;
}
.w-40{
  width: 40%;
}
.formTable input, .formTable textarea, .formTable select {
  max-width: 300px;
}

</style>