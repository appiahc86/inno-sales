<template>

  <div class="">
    <!-- Button trigger modal -->
    <button type="button" ref="loginModal" class="d-none" data-bs-toggle="modal" data-bs-target="#loginModal">
    </button>

    <!-- Modal -->
    <div class="modal" id="loginModal" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-body">
            <div class="container">
              <div class="row justify-content-center">

                <div class="col-5">
                  <div class="card shadow-lg p-4 login-form-container">
                      <h3 class="text-center text-info">{{ companyName }}</h3>
                      <form @submit.prevent="login">
                        <table class="myTable">
                          <tr>
                            <th>Username</th>
                            <td><input type="text" v-model.trim="username" class="form-control-dark py-1 px-3" id="username"></td>
                          </tr>
                          <tr>
                            <th>Password</th>
                            <td><input :type="showPass ? 'text' : 'password'" v-model="password" class="form-control-dark py-1 px-3"></td>
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

import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import db from "@/dbConfig/db";

const router = useRouter();
const username = ref('');
const password = ref('');
const loginModal = ref(null);
const showPass = ref(false);
const store = useStore();
const closeModal = ref(null);
const companyName = ref('');

const getCompany = async () => {
  try {
    const data = await db('settings').first();
    if (data) companyName.value = data.companyName;
  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }
}
getCompany();

onMounted(() => {
  loginModal.value.click();
 document.querySelector("#username").focus();

})

const login = async (e) => {

  e.target.submitBtn.disabled = true;
  try {

    const user = await db('users').where('id', 1).first();
    if (user) {
      store.dispatch('setUser', user);
      ipcRenderer.send('setMenu', 'admin');
      router.push({name: 'home'})
    }else  ipcRenderer.send('errorMessage', 'hellooooooooo');

  }catch (e) {
    ipcRenderer.send('errorMessage', e.message);
  }finally {  e.target.submitBtn.disabled = false; }


}

//Close modal before leaving this page
onBeforeRouteLeave( (to, from, next) => {
   closeModal.value.click();
  next();
})

</script>

<style scoped>

.login-form-container{
  top: 50%;
  box-sizing: border-box;
}
.myTable th{
  padding: 15px;
  font-size: 1.3em;
  width: 25%;
}
.myTable td{
  width: 70%
}

.form-control-dark{
  width: 100%;
}
.loginBtn{
  margin-top: 10px;
  width: 23%;
  margin-left: 35%;
  background: linear-gradient(45deg, red, blue) !important;
}
.loginBtn:hover{
  background: linear-gradient(45deg, blue, black, red) !important;
}

.modal-body, .modal-body .card{
  /*background-image: url("../assets/bg.jpg");*/
  background: linear-gradient(45deg, red, blue) !important;
  color: white;
}
.login-form-container{
  max-width: 530px;
}
.card, .form-control-dark{
  border-radius: 50px;
}

</style>