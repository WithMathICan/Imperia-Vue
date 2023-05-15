<template>
   <div class="text-pink-500 font-bold mb-2 changed-message">
      <span :class="`opacity-${isBeanChanged ? 100 : 0}`">Есть не сохраненные изменения!</span>
   </div>
</template>

<script setup>
defineProps(['isBeanChanged'])
</script>

<style scoped>
.changed-message {
   margin-top: -1.5rem;
}
</style>