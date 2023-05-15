<template>
<div style="text-align:left" v-if="Array.isArray(colsGridView[key])">
   <MultiSelect :modelValue="selected" :options="[...colsGridView[key]].sort(sortCols)"
      optionLabel="column_name" placeholder="Select Columns" style="width: 100%" display="chip"
      @update:modelValue="onToggle" />
</div>
</template>

<script setup>
import {computed, ref, onMounted, defineAsyncComponent} from 'vue'
import { getTableKey, colsGridView } from '../../store'
const MultiSelect = defineAsyncComponent(() => import('primevue/multiselect'));
const selected = ref([])
const emit = defineEmits(['update:columns'])

const props = defineProps(['schema', 'table', 'columns'])
const key = computed(() => getTableKey(props.schema, props.table))
let localStorageKey = computed(() => `key-grid-view-${props.schema}-${props.table}`)

function sortCols(col1, col2) {
   if (col1.column_name < col2.column_name) return -1
   if (col1.column_name > col2.column_name) return 1
   return 0
}

function onToggle(val) {
   if (!Array.isArray(val)) return
   localStorage.setItem(localStorageKey.value, val.map(col => col.column_name).join(','))
   if (Array.isArray(colsGridView[key.value])) {
      selected.value = colsGridView[key.value].filter(col => val.includes(col));
      emit('update:columns', selected.value)
   }
}

onMounted(setInitialCols)

function setInitialCols() {
   const fields = localStorage.getItem(localStorageKey.value)
   if (fields) {
      const arrFields = fields.split(',')
      selected.value = colsGridView[key.value].filter(col => arrFields.includes(col.column_name))
   } else {
      selected.value = colsGridView[key.value]
   }
   emit('update:columns', selected.value)
}
</script>