import { ref, reactive } from 'vue'
import { api } from './api'
import { showMessage } from './messages'

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

//----------- COLS ----------------
const getCols = async (schema, table, method, colsObj) => {
   if (!api[schema] || !api[schema][table] || !api[schema][table][method]) return []
   const key = getTableKey(schema, table)
   if (!Array.isArray(colsObj[key]) && colsObj[key] !== 'loading') {
      colsObj[key] = 'loading'
      colsObj[key] = await api[schema][table][method]()
   }
   if (Array.isArray(colsObj[key])) return colsObj[key]
   return []
}
const getColsGridView = (schema, table) => getCols(schema, table, 'GetColsGridView', colsGridView)
const getColsForUpdate = (schema, table) => getCols(schema, table, 'GetColsForUpdate', colsForUpdate)
const getColsForInsert = (schema, table) => getCols(schema, table, 'GetColsForInsert', colsForInsert)
const getColsForCopy = (schema, table) => getCols(schema, table, 'GetColsForCopy', colsForCopy)

//------------- BEANS -------------
export const initDataGridView = async (schema, table, reload = false) => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeans) return
   const cols = await getColsGridView(schema, table)
   const key = getTableKey(schema, table)
   if ((reload || !Array.isArray(beans[key])) && beans[key] !== 'loading') {
      beans[key] = 'loading'
      let newBeans = await api[schema][table].GetBeans()
      for (let bean of newBeans) processBeanFields(bean, cols)
      beans[key] = newBeans
   }
}

//---------- BEAN ---------------------
export const getBeanForGridView = async (schema, table, id) => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeanForGridView) return {}
   const cols = await getColsGridView(schema, table)
   const bean = await api[schema][table].GetBeanForGridView(id)
   processBeanFields(bean, cols)
   return bean
}

export const initDataForUpdate = async (schema, table, id) => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeanForUpdate) return [null, null]
   const cols = await getColsForUpdate(schema, table)
   const bean = await api[schema][table].GetBeanForUpdate(id)
   processBeanFields(bean, cols)
   return [bean, cols]
}

export const initDataForInsert = async (schema, table) => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeanForInsert) return [null, null]
   const cols = await getColsForInsert(schema, table)
   const bean = await api[schema][table].GetBeanForInsert()
   processBeanFields(bean, cols)
   return [bean, cols]
}

export const initDataForCopy = async (schema, table, id) => {
   if (!api[schema] || !api[schema][table] || !api[schema][table].GetBeanForCopy) return [null, null]
   const cols = await getColsForCopy(schema, table)
   const bean = await api[schema][table].GetBeanForCopy(id)
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
   if (updatedBean.id) {
      await updateBeansStorage(schema, table, updatedBean.id)
   }
})

export const insertBean = (schema, table, bean, cols) => new Promise(async resolve => {
   const insertedBean = await api[schema][table].InsertBean(bean)
   processBeanFields(insertedBean, cols)
   resolve(insertedBean)
   if (insertedBean.id) {
      await updateBeansStorage(schema, table, insertedBean.id)
   }
})

async function updateBeansStorage(schema, table, beanId) {
   const tableKey = getTableKey(schema, table)
   if (Array.isArray(beans[tableKey]) && beanId) {
      const bean = await getBeanForGridView(schema, table, beanId)
      const oldBean = beans[tableKey].find(el => el.id === bean.id)
      if (oldBean) for (const key in bean) oldBean[key] = bean[key]
      else beans[tableKey].push(bean)
   }
}

