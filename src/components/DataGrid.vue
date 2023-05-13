<template>
<h1 class="text-700 mb-2">{{ t(table) }} </h1>

<div v-if="Array.isArray(beans[key]) && Array.isArray(colsGridView[key])">
   <DataTable 
      :value="beans[key]" 
      :rowHover="true"
      :rows="10" 
      :paginator="true"
      :rowsPerPageOptions="[2, 5, 10, 25, 50, 100, 500]"
      :stateKey="sessionKeyForTableSettings" 
      :globalFilterFields="['title']"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Показано {first} - {last} из {totalRecords}" 
      stateStorage="session"
      v-model:filters="filters" 
      filterDisplay="menu" 
      v-model:selection="selectedBeans" 
      dataKey="id" 
      responsiveLayout="scroll" 
   >
      <template #empty>
         <h3 class="text-pink-500">Записей нет</h3>
      </template>
      <template #header>
         <div class="flex justify-content-between align-items-center mb-2">
            <div>
               <Button type="button" icon="pi pi-filter-slash" class="p-button-outlined" @click="filters=createFilters(colsGridView[key])" />
               <span class="p-input-icon-left" v-if="filters">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
               </span>
            </div>
            <span v-if="selectedBeans.length" class="text-blue-600">{{ selectedBeans.length }} выбрано</span>
         </div>
         <SelectedGridColumns :schema="schema" :table="table" :selectedColumns="selectedColumns" />
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="id" header="ID" :sortable="true">
         <template #body="slotProps">
            <router-link class="link p-button p-button-info" :to="{ name: `edit_${schema}_${table}`, params: { id: slotProps.data.id } }">
               {{ slotProps.data.id.toString().substring(0, 7) }}
            </router-link>
         </template>
         <template #filter="{ filterModel }">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by ID" />
         </template>
      </Column>
      <Column v-for="col of colsGridView[key]" :field="col.column_name" :header="col.column_name" :sortable="true"
         :data-type="findDataType(col)" :showFilterMatchModes="!col.fk">
         <template #body="slotProps">
            <ColFk v-if="col.data_type === 'fk'" :col="col" :bean="slotProps.data" />
            <ColM2M v-else-if="col.data_type === 'm2m'" :col="col" :bean="slotProps.data"></ColM2M>
            <Image v-else-if="col.data_type === 'file'" :src="slotProps.data[col.column_name]" :alt="slotProps.data[col.column_name]" width="250" preview ></Image>
            <span v-else-if="col.data_type === 'date'">{{ showDate(slotProps.data[col.column_name]) }}</span>
            <span v-else>{{ slotProps.data[col.column_name] }}</span>
         </template>
         <template #filter="{ filterModel }">
            <Calendar v-if="col.data_type === 'date'" v-model="filterModel.value" dateFormat="dd-mm-yy"
               placeholder="dd-mm-yyyy" />
            <MultiSelect
               v-else-if="col.fk && Array.isArray(beans[getTableKey(col.fk.foreign_table_schema, col.fk.foreign_table_name)])"
               v-model="filterModel.value"
               :filter="beans[getTableKey(col.fk.foreign_table_schema, col.fk.foreign_table_name)].length > 5"
               :options="beans[getTableKey(col.fk.foreign_table_schema, col.fk.foreign_table_name)]"
               :optionLabel="col.fk.foreign_title_column_name" 
               :option-value="col.fk.foreign_column_name"
               placeholder="Any" class="p-column-filter">
            </MultiSelect>
            <InputNumber v-else-if="col.data_type === 'number'" v-model="filterModel.value" mode="decimal"
               :min-fraction-digits="0" :max-fraction-digits="5" />
            <InputText v-else type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search" />
         </template>
      </Column>
      <Column header="Actions">
         <template #body="slotProps">
            <ButtonDelete :schema="schema" :table="table" :ids="[slotProps.data.id]" label="" :delete-cb="clearSelected" />
            <!-- <ButtonModalEdit :schema="schema" :table="table" :id="slotProps.data.id" /> -->
            <router-link class="link p-button p-button-secondary p-button-icon-only p-component"
               :to="{ name: `copy_${schema}_${table}`, params: { id: slotProps.data.id } }">
               <span class="pi pi-copy p-button-icon"></span>
            </router-link>
         </template>
      </Column>
   </DataTable>
   <Button label="Очистить настройки таблицы" @click="clearTableSettings" severity="secondary" />
</div>

</template>

<script setup>
import { t } from '../translation'
import { api } from '../api.js'
import { loading, initDataGridView, beans, colsGridView, getTableKey } from '../store'
import { onMounted, computed, ref, watch } from 'vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Image from 'primevue/image'
import MultiSelect from 'primevue/multiselect'
import Calendar from 'primevue/calendar'
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import ColFk from './data-grid/ColFk.vue'
import ColM2M from './data-grid/ColM2M.vue'
import ButtonDelete from './data-grid/ButtonDelete.vue'
import SelectedGridColumns from './data-grid/SelectedGridColumns.vue'
// import ButtonModalEdit from './data-grid/ButtonModalEdit.vue'


const props = defineProps(['schema', 'table'])
const key = computed(() => getTableKey(props.schema, props.table))
onMounted(init)
watch(() => [props.schema, props.table], init)

async function init() {
   await initDataGridView(props.schema, props.table)
   filters.value = createFilters(colsGridView[key.value])
}

let selectedColumns = ref([])

const selectedBeans = ref([])
const filters = ref()
function clearSelected(deletedIds) {
   selectedBeans.value = selectedBeans.value.filter(el => !deletedIds.includes(el.id))
}

/** @param {import('../types').Col[]} */
function createFilters(cols) {
   if (!cols) return
   /** @type {import('primevue/datatable').DataTableFilterMeta} */
   const filter = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      id: {
         operator: FilterOperator.AND,
         constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      }
   }
   if (!cols) return filter
   for (const col of cols) {
      if (col.fk) {
         filter[col.column_name] = { value: null, matchMode: FilterMatchMode.IN }
      } else {
         const matchMode = col.data_type === 'date' ?
            FilterMatchMode.DATE_IS :
            col.data_type === 'number' ?
               FilterMatchMode.EQUALS :
               FilterMatchMode.CONTAINS
         filter[col.column_name] = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode }],
         }
      }
   }
   return filter
}

/** @param {import('../types').Col} col */
function findDataType(col) {
   if (col.data_type === 'date') return 'date'
   else if (col.data_type === 'number') return 'numeric'
   return 'text'
}

const sessionKeyForTableSettings = computed(() => `dt-state-session-${props.schema}-${props.table}`)

function clearTableSettings() {
   sessionStorage.removeItem(sessionKeyForTableSettings.value)
}

const showDate = date => new Intl.DateTimeFormat("ru", { dateStyle: 'short', timeStyle: 'short' }).format(date)
</script>