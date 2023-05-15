<template>
   <Button 
      :label="label" 
      :loading="loading" 
      type="button" 
      icon="pi pi-trash" 
      iconPos="right"
      class="p-button-danger mr-1" 
      @click="confirmDelete($event)" 
      :disabled="!(ids && ids.length>0)"
   ></Button>
   <ConfirmPopup></ConfirmPopup>
</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";
import { loading, removeBeans } from '../../store'
import { defineAsyncComponent } from 'vue'
const ConfirmPopup = defineAsyncComponent(() => import('primevue/confirmpopup'));

let props = defineProps(['schema', 'table', 'ids', 'label', 'deleteCb'])


const confirm = useConfirm();
/** @param {any} event */
const confirmDelete = (event) => {
   confirm.require({
      target: event.currentTarget,
      message: 'Действительно хотите удалить?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'УДАЛИТЬ',
      acceptClass: 'p-button-danger',
      rejectLabel: 'Не удалять',
      accept: () => {
         removeBeans(props.schema, props.table, props.ids, props.deleteCb)
      },
   });
}
</script>