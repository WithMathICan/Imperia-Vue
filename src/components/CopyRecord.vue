<template>
   <h2 class="font-normal text-pink-500">Копирование записи</h2>
   <h1 class="text-700 mb-2">{{ t(table) }}</h1>

   <Card v-if="bean && cols && cols.length > 0">
      <template #content>
         <ChangeMessage :is-bean-changed="isBeanChanged"/>
         <EditForm :bean="bean" :cols="cols" :on-submit="onSubmit">
            <SaveButton :is-bean-changed="isBeanChanged" />
            <router-link class="link p-button mr-1" :to="{ name: `data_grid_${schema}_${table}` }">Все записи</router-link>
         </EditForm>
      </template>
   </Card>
</template>

<script setup>
import { t } from '../translation';
import Card from 'primevue/card';
import { onMounted, watch } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { insertBean } from '../store'
import { useConfirm } from "primevue/useconfirm";
import EditForm from './edit/EditForm.vue';
import SaveButton from './edit/SaveButton.vue';
import { createDataForEdit } from './edit/edit-data';
import ChangeMessage from './edit/ChangeMessage.vue';

const props = defineProps(['schema', 'table', 'id'])
const router = useRouter()
const confirm = useConfirm()

const {
   bean, cols, init, isBeanChanged, onSubmit, stopRouter,
} = createDataForEdit(props.schema, props.table, props.id, 'copy', confirm.require, save)

onMounted(init)
watch(() => [props.schema, props.table], init)
onBeforeRouteLeave(stopRouter)

async function save() {
   const data = await insertBean(props.schema, props.table, bean.value, cols.value)
   if (!data || !data.id) return
   isBeanChanged.value = false
   router.push({name: `update_${props.schema}_${props.table}`, params: {id: data.id}})
}
</script>

