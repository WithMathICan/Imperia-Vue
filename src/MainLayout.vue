<template>
   <Menubar :model="menuItems">
      <template #end>
         <Button label="Выход" severity="secondary" text @click="logout" />
    </template>
   </Menubar>
   <div class="container p-2 main-container" v-if="isInit">
      <router-view />
   </div>
</template>

<script setup>
import Menubar from 'primevue/menubar'
import { post } from './http';
import { store } from './store';
import { CreateApi } from './api'
import { ref, onMounted } from 'vue';
import { addRoutes } from './router';
import { useRouter } from 'vue-router'
import { t } from './translation'

const menuItems = ref([])
const router = useRouter()
const isInit = ref(false)

function logout() {
   post('/logout', '').then(() => {
      store.isAuthorized = false
   })
}

onMounted(init)

function init() {
   post('/init', '').then(tables => {
      menuItems.value = Object.keys(tables).map(schema => ({
         label: t(schema),
         items: tables[schema].map(table => ({ label: t(table), to: `/${schema}/${table}` }))
      }))
      addRoutes(tables)
      CreateApi(tables)
      router.push(router.currentRoute.value.fullPath)
      isInit.value = true
   })
}

</script>