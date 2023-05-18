import 'primevue/resources/themes/lara-light-blue/theme.css'
// import 'primevue/resources/themes/saga-purple/theme.css'
// import 'primevue/resources/themes/lara-light-purple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './style.scss'

import { createApp } from 'vue'

import PrimeVue from 'primevue/config';
import App from './App.vue'
import ConfirmationService from 'primevue/confirmationservice';
// const Calendar = defineAsyncComponent({
//    loader: () => import('primevue/calendar'),
//    loadingComponent: EmptyComponent,
//    errorComponent: NotLoadedComponent,
//    suspensible: true,
// })
// import Calendar from 'primevue/calendar'

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
import { router } from './router'

const primevueComponents = [Button, InputText, InputNumber, Card]

async function start() {
   try {
      const app = createApp(App)
      app.use(PrimeVue)
      primevueComponents.forEach(el => {
         app.component(el.name, el)
      })
      // app.component(Calendar.name, Calendar)
      app.use(ConfirmationService)
      
      app.use(router)
      app.mount('#app')
   } catch (e) {
      console.log(e);
   }
}

start()

// addEventListener("unhandledrejection", (event) => {
//    console.log({event});
//    event.preventDefault();
// });

// window.addEventListener('error', (event) => {
//    // An uncaught exception occurred. It will be logged in the console.
//    event.preventDefault();
   
//    // Get the error properties from the error event object
//    const { message, filename, lineno, colno, error } = event;
   
//    // Output, if desired.
//    console.log('Captured uncaught exception:', message, filename, lineno, colno, error.stack);
//  });


