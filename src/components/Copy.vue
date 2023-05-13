<template>
<h1>Copy {{ schema }} {{ table }} {{ id }}</h1>

</template>

<script setup>
const props = defineProps(['schema', 'table', 'id'])
</script>