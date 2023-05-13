import { ref, reactive } from 'vue'
import { api } from './api'

export const store = reactive({
   isAuthorized: undefined,
})

export const loading  = ref(false)

/** @type {Record<string, import('./types').DbRecord[]>} */
export const beans = reactive({})

/** @type {Record<string, import('./types').Col[]>} */
export const colsGridView = reactive({})

export const getTableKey = (schema, table) => schema + '.' + table

const getColsGridView = (schema, table) => new Promise(async resolve => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetColsGridView) return resolve([])
   const key = getTableKey(schema, table)
   if (!Array.isArray(colsGridView[key]) && colsGridView[key] !== 'loading') {
      colsGridView[key] = 'loading'
      colsGridView[key] = await api[schema][table].GetColsGridView()
   }
   if (Array.isArray(colsGridView[key])) return resolve(colsGridView[key])
})

export const initDataGridView = (schema, table, reload = false) => new Promise(async resolve => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeans) return resolve([])
   const cols = await getColsGridView(schema, table)
   const key = getTableKey(schema, table)
   if ((reload || !Array.isArray(beans[key])) && beans[key] !== 'loading') {
      beans[key] = 'loading'
      let newBeans = await api[schema][table].GetBeans()
      for (let bean of newBeans) for (let col of cols) {
         if (col.data_type === 'date') bean[col.column_name] = new Date(bean[col.column_name])
      }
      beans[key] = newBeans
   }
   resolve(true)
})

export const removeBeans =  (schema, table, ids, callback = () => { }) => {
   const key = getTableKey(schema, table)
   api[schema][table].RemoveBeans(ids).then(deletedIds => {
      if (!Array.isArray(deletedIds)) return showMessage('Ошибка при удалении', 5000, 'error')
      if (Array.isArray(beans[key])) beans[key] = beans[key].filter(el => !deletedIds.includes(el.id))
      callback(deletedIds)
   })
}
