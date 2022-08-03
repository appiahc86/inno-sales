<template>

  <div class="">
    <!-- Button trigger modal -->
    <button type="button" ref="myModal" class="d-none" data-bs-toggle="modal" data-bs-target="#myModal">
    </button>

    <!-- Modal -->
    <div class="modal" id="myModal" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-body">
            <div class="container">
              <div class="row justify-content-center">

                <div class="col-5 center-div">
                  <div class="card shadow-lg p-4">
                    <h3 class="text-center text-info">Create A New Password</h3>
                    <form @submit.prevent="login">
                      <table class="myTable">
                        <tr>
                          <th>Password</th>
                          <td><input :type="showPass ? 'text' : 'password'" v-model="formData.password"
                                     class="form-control-dark py-1 px-3" id="password"></td>
                        </tr>
                        <tr>
                          <th>Confirm</th>
                          <td><input :type="showPass ? 'text' : 'password'" v-model="formData.password_confirmation" class="form-control-dark py-1 px-3"></td>
                        </tr>
                        <tr>
                          <th></th>
                          <td><label><input type="checkbox" class="p-checkbox" v-model="showPass"> Show password</label></td>
                        </tr>
                      </table>
                      <button type="submit" class="btn btn-secondary btn-sm loginBtn" name="submitBtn">
                        <span class="pi pi-lock"></span>
                        Login
                      </button>
                      <!-- this button is used to close the modal   -->
                      <button type="button" class="d-none" data-bs-dismiss="modal" ref="closeModal"></button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>



  </div>

</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import db from "@/dbConfig/db";
import * as Validator from "validatorjs";
import bcrypt from "bcryptjs";

const router = useRouter();
const myModal = ref(null);
const showPass = ref(false);
const store = useStore();
const closeModal = ref(null);
const route = useRoute();
let routeData = reactive({});

const formData = reactive({
  password: null,
  password_confirmation: null
})



onMounted(() => {
  myModal.value.click();
  document.querySelector("#password").focus();
  routeData.data = JSON.parse(route.params.data)
})


//Close modal before leaving this page
onBeforeRouteLeave( (to, from, next) => {
  closeModal.value.click();
  next();
})

              //...................Login........................
const login = async (e) => {
  try {
    // validation
    let validation = new Validator(formData,{
      password: 'required|string|min:6|confirmed',
    })

    if (validation.passes()){ // If validation passes
      e.target.submitBtn.disabled = true;

      //Hash Password
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hashSync(formData.password, salt);

      //Update Password in DB
      await db('users').where('id', routeData.data.id)
          .update({password: hashedPassword, resetPassword: false});


      await store.dispatch('setUser', { ...routeData.data, password: hashedPassword });

                   //.............Items to disable on menu...........
      let itemsToBeDisabledOnMenu = [];

      if (parseInt(routeData.data.role) === 2){ //if user is manager
        itemsToBeDisabledOnMenu.push('backup', 'receiveItems', 'receivingHistory', 'outstandingBills')
      }

      if (parseInt(routeData.data.role) === 3){ //if user is Cashier
        itemsToBeDisabledOnMenu.push('backup', 'settings');
        if (!routeData.data.runSalesReport){
          itemsToBeDisabledOnMenu.push('salesReport')
        }
      }


      ipcRenderer.send('setMenu', {role: routeData.data.role, itemsToDisable: itemsToBeDisabledOnMenu});
      router.push({name: 'home'});


    }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)
  }catch (e) { ipcRenderer.send('errorMessage', e.message) }
  finally {    e.target.submitBtn.disabled = false }
}




</script>

<style scoped>

.myTable th{
  padding: 15px;
  font-size: 1.3em;
  width: 25%;
}
.myTable td{
  width: 70%;
}

.form-control-dark{
  width: 100%;
}
.loginBtn{
  margin-top: 10px;
  width: 23%;
  margin-left: 35%;
  background: linear-gradient(45deg, #26efb9, #1d1dbd) !important;
}
.loginBtn:hover{
  background: linear-gradient(45deg, #26efb9, #6a6a6b) !important;
}

.modal-body, .modal-body .card{
  background: linear-gradient(45deg, #26cea0, #383434) !important;
  color: white;
}

.card, .form-control-dark{
  border-radius: 50px;
}

</style>