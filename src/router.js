import { createRouter, createWebHistory } from 'vue-router'
import Main from './components/Main.vue'
import DataGrid from './components/DataGrid.vue'
import UpdateRecord from './components/UpdateRecord.vue'
import CopyRecord from './components/CopyRecord.vue'
import InsertRecord from './components/InsertRecord.vue'

/**@type {import('vue-router').RouteRecordRaw[]} */
const routes = [
   {
      path: `/`,
      name: 'main',
      component: Main,
   },
   {
      path: '/:catchAll(.*)*',
      component: Main,
      // redirect: '/'
   }
]

export const router = createRouter({ history: createWebHistory(), routes })

/** @param {Record<string, string[]>} tables */
export function addRoutes(tables) {
   for (let schema in tables) for (let table of tables[schema]) {
      router.addRoute({
         name: `data_grid_${schema}_${table}`,
         path: `/${schema}/${table}`,
         component: DataGrid,
         props: { schema, table }
      })
      router.addRoute({
         name: `update_${schema}_${table}`,
         path: `/${schema}/${table}/update/:id`,
         component: UpdateRecord,
         props: route => ({ schema, table, id: route.params.id })
      })
      router.addRoute({
         name: `copy_${schema}_${table}`,
         path: `/${schema}/${table}/copy/:id`,
         component: CopyRecord,
         props: route => ({ schema, table, id: route.params.id })
      })
      router.addRoute({
         name: `insert_${schema}_${table}`,
         path: `/${schema}/${table}/insert`,
         component: InsertRecord,
         props: { schema, table }
      })
   }
}