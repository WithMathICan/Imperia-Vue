<!-- eslint-disable vue/no-mutating-props -->
<template>
   <Dropdown class="w-full" v-model="bean[col.column_name]" :required="!col.is_nullable"
      :options="showOptions" :optionLabel="col.fk.foreign_title_column_name" 
      :optionValue="col.fk.foreign_column_name" :filter="(showOptions.length>8)" />
</template>

<script setup>
import { initDataGridView, beans, getTableKey } from '../../store';
import Dropdown from 'primevue/dropdown'
import { computed } from 'vue';

/** @type {{bean: any, col: import('../../types').Col}} */ // @ts-ignore
const props = defineProps(['bean', 'col']) 

initDataGridView(props.col.fk.foreign_table_schema, props.col.fk.foreign_table_name)
let key = getTableKey(props.col.fk.foreign_table_schema, props.col.fk.foreign_table_name)
let showOptions = computed(() => {
   if (Array.isArray(beans[key])) {
      let arr = beans[key].sort((a, b) => {
         if (a[props.col.fk.foreign_title_column_name] > b[props.col.fk.foreign_title_column_name]) return 1
         else if (a[props.col.fk.foreign_title_column_name] === b[props.col.fk.foreign_title_column_name]) return 0
         return -1
      })
      // console.log(props);
      if (props.col.fk.foreign_table_schema === props.col.table_schema && props.col.fk.foreign_table_name === props.col.table_name) {
         arr = arr.filter(el => {
            return el.id != props.bean.id
         })
      }
      return arr
   }
   return []
})
</script>