<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-6 form-container">

        <form @submit.prevent="resetPassword">
          <table class="w-100 myTable" style="">
            <tr>
              <th>
                <button class="p-1 fw-bold mb-2 btn-success" type="button" @click="goBack">
                  <span class="pi pi-arrow-circle-left"></span> Back </button>
              </th>
              <td>
                <h4 style="width: 350px; text-align: center;">
                  Reset Password
                </h4><br>
              </td>
            </tr>


            <tr>
              <th class="float-end">Current Password &nbsp;</th>
              <td><input type="password" class="form-control-dark" v-model.trim="formData.currentPassword"></td>
            </tr>

            <tr>
              <th class="float-end">New Password &nbsp;</th>
              <td><input type="password" class="form-control-dark" v-model.trim="formData.password"></td>
            </tr>

            <tr>
              <th class="float-end"><span class="pi pi-user"></span> Confirm Password &nbsp;</th>
              <td><input type="password" class="form-control-dark" v-model.trim="formData.password_confirmation"></td>
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


      </div>
    </div>
  </div>
</template>

<script setup>

import {computed, reactive, ref} from "vue";
import * as Validator from "validatorjs";
import db from "@/dbConfig/db";
import bcrypt from "bcryptjs";

import {useStore} from "vuex";
import {useRouter} from "vue-router";
const store = useStore();
const router = useRouter();
const user = computed(() => store.getters.user); //Get User

const dialog = ref(null);
const formData = reactive({
  currentPassword: null, password: null, password_confirmation: null
})

//go back to users
const goBack = () => router.back();


//.......................Reset Password.........................
const resetPassword = async (e) => {
  try {

    // validation
    let validation = new Validator(formData,{
      currentPassword: 'required|string',
      password: 'required|min:6|confirmed'
    })

    if (validation.passes()){ // If validation passes
      e.target.submitBtn.disabled = true;

      //compare Password
     const isMatched = await bcrypt.compare(formData.currentPassword, user.value.password);
     if (!isMatched) return ipcRenderer.send('errorMessage', 'Your current password is incorrect')

      //hash Password
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hashSync(formData.password, salt);

      //Save password in database
      await db('users').where('id', user.value.id).first()
          .update({password: hashedPassword})

      //log user out and redirect to login page
      ipcRenderer.send('logout');
      store.dispatch('logout', '');
      ipcRenderer.send('successMessage', 'Password reset was successful! \n You may login now') //Success Message
      router.push({name: 'login'})

    }else ipcRenderer.send('errorMessage', `${Object.values(validation.errors.all())[0]}`)

  }catch (e) { ipcRenderer.send('errorMessage', e.message)}
  finally { e.target.submitBtn.disabled = false }

}

</script>

<style scoped>
.form-control-dark{
  padding: 5px;
}

.myTable th{
  padding: 13px 0;
}

.myTable input{
  width: 26em;
  padding: 5px;
}

.form-container{
  margin-top: 20vh;
}
</style>>