<template>
   <Menubar :model="menuItems">
      <template #end>
         <Button label="Выход" severity="secondary" text @click="logout" />
    </template>
   </Menubar>
   <div class="container p-2 main-container">
      <router-view />
   </div>
</template>

<script setup>
import Menubar from 'primevue/menubar'
import { post } from './http';
import { store } from './store';
import { ref, onMounted } from 'vue';

const menuItems = ref([])

function logout() {
   post('/logout', '').then(data => {
      store.isAuthorized = false
   })
}

onMounted(init)

function init() {
   console.log('init');
}

</script>