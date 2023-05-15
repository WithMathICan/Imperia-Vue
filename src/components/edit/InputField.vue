<template>
<div>
   <label :for="col.column_name">{{t(col.column_name)}}<span class="text-red-500" v-if="!col.is_nullable">*</span></label>
   <InputText v-if="col.data_type === 'varchar'" class="w-full" :required="!col.is_nullable" :id="col.column_name" 
      type="text" v-model="bean[col.column_name]"/>
   <Textarea v-else-if="col.data_type === 'text' || col.data_type === 'json'" v-model="bean[col.column_name]" autoResize rows="2" class="w-full"/>
   <InputNumber v-else-if="col.data_type === 'number'" class="w-full" :required="!col.is_nullable" 
      :id="col.column_name" v-model.number="bean[col.column_name]" />
   <Calendar v-else-if="col.data_type === 'date'" class="w-full" :required="!col.is_nullable" 
      v-model="bean[col.column_name]" :showTime="true" />
   <InputFk v-else-if="col.data_type === 'fk'" :bean="bean" :col="col"></InputFk>
   <!-- <InputM2MTree v-else-if="col.data_type === 'm2m' && col.m2m.isTree && bean[col.column_name]" :bean="bean" :col="col"></InputM2MTree>
   <InputM2M v-else-if="col.data_type === 'm2m'" :bean="bean" :col="col"></InputM2M>
   <InputFile v-else-if="col.data_type === 'file'" v-model="bean[col.column_name]"  
      :schema="col.table_schema" :table="col.table_name" :field_name="col.column_name" ></InputFile>
   <InputKeyValue v-else-if="col.data_type  === 'key-value'" :key_schema="col.keyValue.keys_schema_name" 
      :key_table="col.keyValue.keys_table_name" v-model="bean[col.column_name]"/> -->
</div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
// import EmptyComponent from '../EmptyComponent.vue'
// import NotLoadedComponent from '../NotLoadedComponent.vue'
// import Calendar from "primevue/calendar"
// const Calendar = defineAsyncComponent({
//    loader: () => import('primevue/calendar'),
//    loadingComponent: EmptyComponent,
//    errorComponent: NotLoadedComponent,
//    suspensible: true,
// })
const Calendar = defineAsyncComponent(() => import('primevue/calendar'))
import InputFk from "./InputFk.vue";
import Textarea from 'primevue/textarea'
import { t } from "../../translation";
/** @type {{bean: any, col: import('types').Col}} */
const props = defineProps(['bean', 'col'])
</script>