import { ref, watch } from 'vue'
import { initDataForCopy, initDataForInsert, initDataForUpdate } from '../../store'
import { ClearMessages } from '../../messages'

/**
 * @param {string} schema 
 * @param {string} table 
 * @param {string?} id
 * @param {'insert' | 'update' | 'copy'} type 
 * @param {(option: import('primevue/confirmationoptions').ConfirmationOptions) => void} confirmRequire
 */
export function createDataForEdit(schema, table, id, type, confirmRequire, save)  {
   const bean = ref()
   const cols = ref([])
   const isBeanChanged = ref(false)

   const preventLeavePage = e => {
      e.preventDefault();
      return e.returnValue = '';
   }
   watch(isBeanChanged, val => {
      if (val) window.addEventListener('beforeunload', preventLeavePage, { capture: true });
      else removeEventListener("beforeunload", preventLeavePage, { capture: true });
   })

   async function init() {
      if (type === 'update') [bean.value, cols.value] = await initDataForUpdate(schema, table, id)
      if (type === 'insert') [bean.value, cols.value] = await initDataForInsert(schema, table)
      if (type === 'copy') [bean.value, cols.value] = await initDataForCopy(schema, table, id)
      setTimeout(() => isBeanChanged.value = false, 0)
   }

   // Saving
   let isExecuting = false
   watch(() => bean, () => {
      if (!isExecuting && isBeanChanged.value === false) isBeanChanged.value = true
   }, { deep: true })

   const onSubmit = () => {
      isExecuting = true
      ClearMessages()
      save().finally(() => {
         isExecuting = false
      })
   }

   function stopRouter(_to, _from, next) {
      if (isBeanChanged.value) {
         confirmRequire({
            group: 'router',
            message: 'У вас есть несохраненные изменения. Продолжить?',
            header: 'Внимание',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Покинуть страницу без сохранения',
            rejectLabel: 'Продолжить редактирование',
            acceptClass: 'p-button-danger',
            accept: () => {
               next()
               removeEventListener("beforeunload", preventLeavePage, { capture: true })
            },
         })
      } else next()
   }

   return { bean, cols, init, isBeanChanged, onSubmit, stopRouter }
}