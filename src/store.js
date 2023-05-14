import { ref, reactive } from 'vue'
import { api } from './api'

export const store = reactive({
   isAuthorized: undefined,
   // isBeanChanged: false,
})

export const loading  = ref(false)

/** @type {Record<string, import('./types').DbRecord[]>} */
export const beans = reactive({})

/** @type {Record<string, import('./types').Col[]>} */
export const colsGridView = reactive({})

/** @type {Record<string, import('./types').Col[]>} */
export const colsForUpdate = reactive({})

/** @type {Record<string, import('./types').Col[]>} */
export const colsForInsert = reactive({})

/** @type {Record<string, import('./types').Col[]>} */
export const colsForCopy = reactive({})

export const getTableKey = (schema, table) => schema + '.' + table

const getCols = (schema, table, method, colsObj) => new Promise(async resolve => {
   if (!api[schema] || !api[schema][table] || !api[schema][table][method]) return resolve([])
   const key = getTableKey(schema, table)
   if (!Array.isArray(colsObj[key]) && colsObj[key] !== 'loading') {
      colsObj[key] = 'loading'
      colsObj[key] = await api[schema][table][method]()
   }
   if (Array.isArray(colsObj[key])) return resolve(colsObj[key])
   resolve([])
})

const getColsGridView = (schema, table) => getCols(schema, table, 'GetColsGridView', colsGridView)
const getColsForUpdate = (schema, table) => getCols(schema, table, 'GetColsForUpdate', colsForUpdate)
const getColsForInsert = (schema, table) => getCols(schema, table, 'GetColsForInsert', colsForInsert)
const getColsForCopy = (schema, table) => getCols(schema, table, 'GetColsForCopy', colsForCopy)

export const initDataGridView = (schema, table, reload = false) => new Promise(async resolve => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeans) return resolve([])
   const cols = await getColsGridView(schema, table)
   const key = getTableKey(schema, table)
   if ((reload || !Array.isArray(beans[key])) && beans[key] !== 'loading') {
      beans[key] = 'loading'
      let newBeans = await api[schema][table].GetBeans()
      for (let bean of newBeans) processBeanFields(bean, cols)
      beans[key] = newBeans
   }
   resolve(true)
})

export const getBeanForGridView = (schema, table, id) => new Promise(async resolve => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeanForGridView) return resolve({})
   const cols = await getColsGridView(schema, table)
   const bean = await api[schema][table].GetBeanForGridView(id)
   processBeanFields(bean, cols)
   resolve(bean)
})

export const getBeanForUpdate = async (schema, table, id) => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeanForUpdate) return [null, null]
   const cols = await getColsForUpdate(schema, table)
   const bean = await api[schema][table].GetBeanForUpdate(id)
   processBeanFields(bean, cols)
   return [bean, cols]
}

export const removeBeans =  (schema, table, ids, callback = () => { }) => {
   const tableKey = getTableKey(schema, table)
   api[schema][table].RemoveBeans(ids).then(deletedIds => {
      if (!Array.isArray(deletedIds)) return showMessage('Ошибка при удалении', 5000, 'error')
      if (Array.isArray(beans[tableKey])) beans[tableKey] = beans[tableKey].filter(el => !deletedIds.includes(el.id))
      callback(deletedIds)
   })
}

/**
 * @param {import('./types').DbRecord} bean 
 * @param {import('./types').Col[]} cols 
 */
function processBeanFields(bean, cols) {
   if (!bean) return
   for (let col of cols) {
      if (col.data_type === 'date') bean[col.column_name] = new Date(bean[col.column_name])
      if (col.data_type === 'number') bean[col.column_name] = +bean[col.column_name] 
   }
}

export const updateBean = (schema, table, id, bean, cols) => new Promise(async resolve => {
   const updatedBean = await api[schema][table].UpdateBean(id, bean)
   processBeanFields(updatedBean, cols)
   resolve(updatedBean)
   // console.log('AFTER RESOLVE');
   const tableKey = getTableKey(schema, table)
   if (Array.isArray(beans[tableKey]) && updatedBean.id) {
      const bean = await getBeanForGridView(schema, table, id)
      const oldBean = beans[tableKey].find(el => el.id === bean.id)
      if (oldBean) for (const key in bean) oldBean[key] = bean[key]
      else beans[tableKey].push(bean)
   }
})

