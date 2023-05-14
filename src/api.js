import {post} from './http'

/** @type {import("./types").TApi} */
export const api = {}

/** @param {Record<string, string[]>} tables */
export function CreateApi(tables) {
   for (const schema in tables) {
      api[schema] = {}
      for (const table of tables[schema]) {
         api[schema][table] = {
            GetColsGridView: () => post(`/${schema}/${table}/cols?type=grid-view`), 
            GetColsForInsert: () => post(`/${schema}/${table}/cols?type=insert`), 
            GetColsForUpdate: () => post(`/${schema}/${table}/cols?type=update`), 
            GetColsForCopy: () => post(`/${schema}/${table}/cols?type=copy`), 
            GetBeans: () => post(`/${schema}/${table}/beans`),
            GetBeanForGridView: id => post(`/${schema}/${table}/bean/${id}?type=grid-view`),
            GetBeanForUpdate: id => post(`/${schema}/${table}/bean/${id}?type=update`),
            GetBeanForInsert: id => post(`/${schema}/${table}/bean/${id}?type=insert`),
            GetBeanForCopy: id => post(`/${schema}/${table}/bean/${id}?type=copy`),
            InsertBean: bean => post(`/${schema}/${table}/insert`, JSON.stringify(bean)),
            UpdateBean: (id, bean) =>  post(`/${schema}/${table}/update`, JSON.stringify({ id, bean })),
            RemoveBeans: ids => post(`/${schema}/${table}/remove-many`, JSON.stringify({ ids })),
         }
      }
   }
}