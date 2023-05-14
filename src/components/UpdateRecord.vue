<template>
   <h2 class="font-normal text-blue-500">Редактирование записи</h2>
   <h1 class="text-700 mb-2">{{ t(table) }}</h1>

   <Card v-if="bean && cols && cols.length > 0">
      <template #content>
         <div class="text-pink-500 font-bold mb-2 changed-message">
            <span :class="`opacity-${isBeanChanged ? 100 : 0}`">Есть не сохраненные изменения!</span>
         </div>
         <EditForm :bean="bean" :cols="cols" :on-submit="onSubmit">
            <Button label="Сохранить" :loading="loading" type="submit" icon="pi pi-save" iconPos="right" :class="saveBtnClass"></Button>
            <router-link class="link p-button mr-1" :to="{ name: `copy_${schema}_${table}`, params: { id } }">Копировать</router-link>
            <router-link class="link p-button p-button-warning mr-1" :to="{ name: `insert_${schema}_${table}` }">Создать</router-link>
            <ButtonDelete :schema="schema" :table="table" :ids="[id]" :deleteCb="viewAll" />
            <router-link v-if="id" class="link p-button mr-1" :to="{ name: `data_grid_${schema}_${table}` }">Все записи</router-link>
         </EditForm>
      </template>
   </Card>
</template>

<script setup>
import { t } from '../translation';
import Card from 'primevue/card';
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import ButtonDelete from './data-grid/ButtonDelete.vue';
import { loading, getBeanForUpdate, updateBean } from '../store'
import { useConfirm } from "primevue/useconfirm";
import EditForm from './edit/EditForm.vue';


const props = defineProps(['schema', 'table', 'id'])
const confirm = useConfirm()

const bean = ref()
watch(() => [props.schema, props.table, props.id], init)
const cols = ref([])
// const key = computed(() => getTableKey(props.schema, props.table))
const isBeanChanged = ref(false)
async function init() {
   [bean.value, cols.value] = await getBeanForUpdate(props.schema, props.table, props.id)
   setTimeout(() => isBeanChanged.value = false, 0)
}

onMounted(init)

const router = useRouter()
const saveBtnClass = computed(() => `p-button-${isBeanChanged.value ? 'help' : 'success'} mr-1`)
const viewAll = () => router.push({ name: `view_all_${props.schema}_${props.table}` })

let isExecuting = false
watch(() => bean, () => {
   // setTimeout(() => {
      if (!isExecuting && isBeanChanged.value  === false) isBeanChanged.value = true
   // }, 0)
}, { deep: true })
const preventLeavePage = e => {
   e.preventDefault();
   return e.returnValue = '';
}
watch(isBeanChanged, val => {
   // console.log({val});
   if (val) window.addEventListener('beforeunload', preventLeavePage, {capture: true});
   else removeEventListener("beforeunload", preventLeavePage, {capture: true});
})
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

const onSubmit = () => {
   isExecuting = true
   updateBean(props.schema, props.table, props.id, bean.value, cols.value).then(data => {
      if (!data) return
      bean.value = data
      setTimeout(() => {
         isBeanChanged.value = false
         isExecuting = false
      }, 0)
   })
}
</script>

<style scoped>
.changed-message {
   margin-top: -1.5rem;
}
</style>
