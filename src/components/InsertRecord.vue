<template>
   <h2 class="font-normal text-green-500">Создание записи</h2>
   <h1 class="text-700 mb-2">{{ t(table) }}</h1>

   <Card v-if="bean && cols && cols.length > 0">
      <template #content>
         <div class="text-pink-500 font-bold mb-2 changed-message">
            <span :class="`opacity-${isBeanChanged ? 100 : 0}`">Есть не сохраненные изменения!</span>
         </div>
         <EditForm :bean="bean" :cols="cols" :on-submit="onSubmit">
            <Button label="Сохранить" :loading="loading" type="submit" icon="pi pi-save" iconPos="right" :class="saveBtnClass" />
            <router-link class="link p-button mr-1" :to="{ name: `data_grid_${schema}_${table}` }">Все записи</router-link>
         </EditForm>
      </template>
   </Card>
</template>

<script setup>
import { t } from '../translation';
import Card from 'primevue/card';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { loading, initDataForInsert, insertBean } from '../store'
import { useConfirm } from "primevue/useconfirm";
import EditForm from './edit/EditForm.vue';

const props = defineProps(['schema', 'table'])

const saveBtnClass = computed(() => `p-button-${isBeanChanged.value ? 'help' : 'success'} mr-1`)
const router = useRouter()

const bean = ref()
const cols = ref([])
async function init() {
   [bean.value, cols.value] = await initDataForInsert(props.schema, props.table)
   setTimeout(() => isBeanChanged.value = false, 0)
}
onMounted(init)
watch(() => [props.schema, props.table], init)

// leave page
const isBeanChanged = ref(false)
const preventLeavePage = e => {
   e.preventDefault();
   return e.returnValue = '';
}
watch(isBeanChanged, val => {
   if (val) window.addEventListener('beforeunload', preventLeavePage, {capture: true});
   else removeEventListener("beforeunload", preventLeavePage, {capture: true});
})
const confirm = useConfirm()
onBeforeRouteLeave((to, from, next) => {
   if (isBeanChanged.value) {
      confirm.require({
         group: 'router',
         message: 'У вас есть несохраненные изменения. Продолжить?',
         header: 'Внимание',
         icon: 'pi pi-exclamation-triangle',
         acceptLabel: 'Покинуть страницу без сохранения',
         rejectLabel: 'Продолжить редактирование',
         acceptClass: 'p-button-danger',
         accept: () => next(),
      })
   } else next()
})

// Saving
let isExecuting = false
watch(() => bean, () => {
   if (!isExecuting && isBeanChanged.value  === false) isBeanChanged.value = true
}, { deep: true })
const onSubmit = () => {
   isExecuting = true
   insertBean(props.schema, props.table, bean.value, cols.value).then(data => {
      if (!data || !data.id) return
      isBeanChanged.value = false
      router.push({name: `update_${props.schema}_${props.table}`, params: {id: data.id}})
   })
}
</script>

<style scoped>
.changed-message {
   margin-top: -1.5rem;
}
</style>
