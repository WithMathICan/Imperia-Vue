<template>
<h1>Edit {{ schema }} {{ table }} {{ id }}</h1>

</template>

<script setup>
const props = defineProps(['schema', 'table', 'id'])
</script>