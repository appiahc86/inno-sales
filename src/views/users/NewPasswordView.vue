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
                    <form @submit.prevent="">
                      <table class="myTable">
                        <tr>
                          <th>Password</th>
                          <td><input :type="showPass ? 'text' : 'password'" v-model.trim="password"
                                     class="form-control-dark py-1 px-3" id="password"></td>
                        </tr>
                        <tr>
                          <th>Confirm</th>
                          <td><input :type="showPass ? 'text' : 'password'" v-model="confirm" class="form-control-dark py-1 px-3"></td>
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
const confirm = ref(null);
const password = ref(null);
const myModal = ref(null);
const showPass = ref(false);
const store = useStore();
const closeModal = ref(null);




onMounted(() => {
  myModal.value.click();
  document.querySelector("#password").focus();

})


//Close modal before leaving this page
onBeforeRouteLeave( (to, from, next) => {
  closeModal.value.click();
  next();
})

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