<template>
<form v-on:submit.prevent="onSubmit">
   <Grid2>
      <InputField v-for="col in cols" :col="col" :bean="bean" :key="col.column_name"></InputField>
   </Grid2>
   <div class="mt-3"><slot></slot></div>
</form>
</template>

<script setup>
import Grid2 from './Grid2.vue'
import InputField from './InputField.vue';
defineProps(['bean', 'cols', 'onSubmit'])
</script>