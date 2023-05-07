import 'primevue/resources/themes/lara-light-blue/theme.css'
// import 'primevue/resources/themes/saga-purple/theme.css'
// import 'primevue/resources/themes/lara-light-purple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './style.scss'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import ConfirmationService from 'primevue/confirmationservice';

//import DataTable from 'primevue/datatable';
//import Column from 'primevue/column';
//import Calendar from 'primevue/calendar';
//import MultiSelect from 'primevue/multiselect';
//import Image from 'primevue/image'
//import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Card from 'primevue/card'

import NotFound from './components/NotFound.vue'
import Main from './components/Main.vue'

const primevueComponents = [Button, InputText, InputNumber, Card]

const routes = [{
   path: `/`,
   name: 'main',
   component: Main,
}]
routes.push({
   path: '/:catchAll(.*)*',
   component: NotFound,
})

async function start() {
   try {
      const app = createApp(App)
      app.use(PrimeVue)
      primevueComponents.forEach(el => {
         app.component(el.name, el)
      })
      app.use(ConfirmationService)
      const router = createRouter({ history: createWebHistory(), routes })
      app.use(router)
      app.mount('#app')
   } catch (e) {
      console.log(e);
   }
}

start()


