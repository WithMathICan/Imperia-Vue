<template>
   <h2 class="font-normal text-blue-500">Редактирование записи</h2>
   <h1 class="text-700 mb-2">{{ t(table) }}</h1>

   <Card v-if="bean && cols && cols.length > 0">
      <template #content>
         <ChangeMessage :is-bean-changed="isBeanChanged"/>
         <EditForm :bean="bean" :cols="cols" :on-submit="onSubmit">
            <SaveButton :is-bean-changed="isBeanChanged" />
            <router-link class="link p-button mr-1" :to="{ name: `copy_${schema}_${table}`, params: { id } }">Копировать</router-link>
            <router-link class="link p-button p-button-warning mr-1" :to="{ name: `insert_${schema}_${table}` }">Создать</router-link>
            <ButtonDelete :schema="schema" :table="table" :ids="[id]" :deleteCb="viewAll" />
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
import ButtonDelete from './data-grid/ButtonDelete.vue';
import { useConfirm } from "primevue/useconfirm";
import EditForm from './edit/EditForm.vue';
import SaveButton from './edit/SaveButton.vue';
import { createDataForEdit } from './edit/edit-data'
import { updateBean } from '../store';
import ChangeMessage from './edit/ChangeMessage.vue';

const props = defineProps(['schema', 'table', 'id'])
const router = useRouter()
const viewAll = () => router.push({ name: `data_grid_${props.schema}_${props.table}` })
const confirm = useConfirm()

const {
   bean, cols, init, isBeanChanged, onSubmit, stopRouter,
} = createDataForEdit(props.schema, props.table, props.id, 'update', confirm.require, save)

onMounted(init)
watch(() => [props.schema, props.table, props.id], init)
onBeforeRouteLeave(stopRouter)

async function save() {
   const data = await updateBean(props.schema, props.table, props.id, bean.value, cols.value);
   if (!data || !data.id) return;
   bean.value = data;
   setTimeout(() => isBeanChanged.value = false, 0);
}
</script>
