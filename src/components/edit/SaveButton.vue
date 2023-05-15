<template>
<Button label="Сохранить" :loading="loading" type="submit" icon="pi pi-save" iconPos="right" :class="saveBtnClass" />
</template>

<script setup>
const props = defineProps(['isBeanChanged'])
import { computed } from 'vue';
import { loading } from '../../store'

const saveBtnClass = computed(() => `p-button-${props.isBeanChanged ? 'help' : 'success'} mr-1`)
</script>