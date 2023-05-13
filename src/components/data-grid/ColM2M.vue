<template>
   <div>{{ data }}</div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { beans, initDataGridView, getTableKey } from '../../store.js'

/** @type {{col: import('types').Col, bean: any}} */ //@ts-ignore
const props = defineProps(['col', 'bean'])

onMounted(() => initDataGridView(props.col.table_schema, props.col.m2m.table))
let key = getTableKey(props.col.table_schema, props.col.m2m.table)
const data = computed(() => {
   if (props.col && props.col.m2m && props.bean[props.col.column_name] && Array.isArray(beans[key])) {
      return props.bean[props.col.column_name].join(', ')
      // return spBeans[key.value]
      //    .filter(el => props.bean[props.col.column_name].includes(el.id))
      //    // .map(el => el[props.col.m2m.title_column])
      //    .join(',')
   }
   return ''
})
</script>
