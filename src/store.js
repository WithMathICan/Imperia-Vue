import { ref, reactive } from 'vue'

export const store = reactive({
   isAuthorized: undefined,
})

export const loading  = ref(false)