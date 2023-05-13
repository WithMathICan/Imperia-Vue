<template>
   {{ data }}
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { beans, initDataGridView, getTableKey } from '../../store'

/** @type {{col: import('../../types').Col, bean: any}} */
const props = defineProps(['col', 'bean'])
onMounted(() => initDataGridView(props.col.fk.foreign_table_schema, props.col.fk.foreign_table_name))
let data = computed(() => {
   let { fk } = props.col
   let id = props.bean[props.col.column_name]
   let key = getTableKey(fk.foreign_table_schema, fk.foreign_table_name)
   if (!Array.isArray(beans[key])) return props.bean[props.col.column_name]
   let fkBean = beans[key].find(el => el[fk.foreign_column_name] === id)
   if (fkBean) return fkBean[fk.foreign_title_column_name] ?? props.bean[props.col.column_name]
   return props.bean[props.col.column_name]
})
</script>