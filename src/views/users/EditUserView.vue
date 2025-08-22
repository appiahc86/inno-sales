<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-6 form-container">

        <form @submit.prevent="editUser">
          <table class="w-100 myTable" style="">
            <tr>
              <th>
                <button class="p-1 fw-bold mb-2 btn-success" type="button"
                        style="" title="Go To Users" @click="goBack">
                  <span class="pi pi-arrow-circle-left"></span> Back </button>
              </th>
              <td>
                <h4 style="width: 350px; text-align: center;">
                  Edit User
                </h4><br>
              </td>
            </tr>


            <tr>
              <th class="float-end">First Name &nbsp;</th>
              <td><input type="text" class="form-control-dark" v-model.trim="formData.firstName"></td>
            </tr>

            <tr>
              <th class="float-end">Last Name &nbsp;</th>
              <td><input type="text" class="form-control-dark" v-model.trim="formData.lastName"></td>
            </tr>

            <tr>
              <th class="float-end">Role &nbsp;</th>
              <td>
                <div class="input-group">
                  <select  class="form-control-dark select" v-model="formData.role">
                    <option value=""></option>
                    <option value="3">Cashier</option>
<!--                    <option value="2">Manager</option>-->
                    <option value="1" v-if="parseInt(user.role) === 1">Admin</option>
                  </select>
                  <div class="input-group-text" v-if="parseInt(formData.role) === 3">
                      <span class="pi pi-user-edit" title="Set Permissions"
                            style="cursor: pointer; font-size: 1.3em;"
                            @click="showDialog"></span>
                  </div>
                  <div class="input-group-text" style="visibility: hidden;" v-else>
                    <span class="pi pi-user-edit" style=" font-size: 1.3em;"></span>

                  </div>
                </div>

              </td>
            </tr>

            <tr>
              <th class="float-end"><span class="pi pi-phone"></span> Phone &nbsp;</th>
              <td><input type="text" class="form-control-dark" v-model.trim="formData.phone"></td>
            </tr>

            <tr>
              <th class="float-end"><span class="pi pi-lock"></span> Password &nbsp;</th>
              <td><input type="password" class="form-control-dark" v-model="formData.password"></td>
            </tr>

            <tr>
              <th class="float-end"></th>
              <td>
                <button class=" mt-1 btn-secondary" type="submit" style="width: 26em;" name="submitBtn">
                  <span class="pi pi-save"></span>
                  <b style="font-size: 1.5em;"> Save</b>
                </button>
              </td>
            </tr>
          </table>
        </form>


        <!--  Dialog      -->
        <dialog ref="dialog" style="border: 2px solid #ccc;" class="p-4">
          <label>
            <input type="checkbox" class="p-checkbox" v-model="formData.giveDiscount">
            <b> Give Discount On Sale</b>
          </label><br><br>
          <label>
            <input type="checkbox" class="p-checkbox" v-model="formData.changePrice">
            <b> Modify Price On Sale</b>
          </label><br><br>
          <label>
            <input type="checkbox" class="p-checkbox" v-model="formData.runSalesReport">
            <b> Run Sales Report</b>
          </label><br>
          <button class="p-1 mt-2 w-100 btn-secondary" @click="dialog.close()"><b>Save</b></button>
        </dialog>
      </div>
    </div>
  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref} from "vue";
import * as Validator from "validatorjs";
import db from "@/dbConfig/db";
import bcrypt from "bcryptjs";

import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();
const userId = ref(null);
const user = computed(() => store.getters.user); //Get User

const dialog = ref(null);
const formData = reactive({
  firstName: '', lastName: '', phone: '', password: '',
  role: null, runSalesReport: true, giveDiscount: true, changePrice: true

})

//go back to users
const goBack = () => router.back();

//reset permissions in form data
const resetPermissions = () => {
  formData.runSalesReport = true;  formData.giveDiscount = true; formData.changePrice = true;
}


//Open dialog
const showDialog = () => {
  dialog.value.showModal();
}


//.......................Edit user.........................
const editUser = async (e) => {

  try {
    // validation
    let validation = new Validator(formData,{
      firstName: 'required|min:3',
      role: 'required',
      password: 'min:6',
    })

    if (validation.passes()){ // If validation passes
      e.target.submitBtn.disabled = true;
      if (parseInt(formData.role) !== 3) resetPermissions(); //Reset permissions if user is not cashier

      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: parseInt(formData.role),
        runSalesReport: formData.runSalesReport,
        giveDiscount: formData.giveDiscount,
        changePrice: formData.changePrice
      }

      //Hash Password if password is modified
      if (formData.password.trim() !== ''){
        const salt = await bcrypt.genSaltSync(10);
        data.password = await bcrypt.hashSync(formData.password, salt);
        data.resetPassword = 1;
      }


      //Update user in database
      await db('users').where('id', userId.value).update(data)

      ipcRenderer.send('successMessage', 'Update was successful!') //Success Message

      goBack();

    }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
 finally {    e.target.submitBtn.disabled = false }

}



//On  page load, populate form data
onMounted(() => {
  const parsedData = JSON.parse(route.params.data);

  formData.firstName = parsedData.firstName;
  formData.lastName = parsedData.lastName;
  formData.phone = parsedData.phone;
  formData.role = parsedData.role;
  formData.runSalesReport = !!parsedData.runSalesReport;
  formData.giveDiscount = !!parsedData.giveDiscount;
  formData.changePrice = !!parsedData.changePrice;

  userId.value = parsedData.id;

})

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

.form-container{
  margin-top: 20vh;
}
</style>