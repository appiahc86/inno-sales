<template>
  <div class="home">


    <!-- Button trigger modal -->
    <button type="button" class="btn btn-sm btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Show Modal
    </button>

    <!-- Modal -->
    <div class="modal" id="exampleModal"  aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Products</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h6>my modal</h6>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>

import {useRouter} from "vue-router";
import {onMounted} from "vue";

const  router = useRouter();
onMounted(() => {
  router.push({name: 'login'})
})
</script>

<style scoped>

</style>