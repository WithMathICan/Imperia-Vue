import { createRouter, createWebHistory } from 'vue-router'
import Main from './components/Main.vue'
import DataGrid from './components/DataGrid.vue'
import Edit from './components/Edit.vue'
import Copy from './components/Copy.vue'

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
export function addRoutes(tables){
   for(let schema in tables) for (let table of tables[schema]) {
      router.addRoute({ 
         name: `data_grid_${schema}_${table}`, 
         path: `/${schema}/${table}`, 
         component: DataGrid, 
         props: {schema, table} 
      })
      router.addRoute({ 
         name: `edit_${schema}_${table}`, 
         path: `/${schema}/${table}/edit/:id`, 
         component: Edit, 
         props: route => ({schema, table, id: route.params.id}) 
      })
      router.addRoute({ 
         name: `copy_${schema}_${table}`, 
         path: `/${schema}/${table}/copy/:id`, 
         component: Copy, 
         props: route => ({schema, table, id: route.params.id}) 
      })
   }
}