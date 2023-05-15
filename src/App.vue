<template>
   <Card v-if="store.isAuthorized === false" class="login-card">
      <template #title> Вход </template>
      <template #content>
         <form @submit.prevent="authorize">
            <InputText type="text" v-model="loginData.login" placeholder="Login" class="w-full mb-2" />
            <Password v-model="loginData.password" placeholder="Password" :feedback="false" toggleMask class="w-full mb-2"
               input-class="w-full" />
            <Button label="Войти" type="submit" />
         </form>
      </template>
   </Card>
   <MainLayout v-if="store.isAuthorized === true" />
   <div class="container p-2 main-container">
      <div id="toast-container">
         <transition-group name="p-message" tag="div">
            <Message v-for="msg of messages" :key="msg.id" :life="msg.life" :closable="msg.closable"
               :severity="msg.severity" @close="msgClose(msg.id)">
               <b>{{ msg.content }}</b>
            </Message>
         </transition-group>
      </div>
   </div>
   <ConfirmDialog group="router"></ConfirmDialog>
</template>

<script setup>
import MainLayout from './MainLayout.vue'
import { defineAsyncComponent, reactive, onMounted } from 'vue';
import { store } from './store'
import { ClearMessages, messages, msgClose } from './messages'
import { post } from './http'
import Message from 'primevue/message'

import ConfirmDialog from 'primevue/confirmdialog'
const Password = defineAsyncComponent(() => import('primevue/password'));
// const Message = defineAsyncComponent(() => import('primevue/message'));

const loginData = reactive({
   login: '',
   password: ''
})
function authorize() {
   ClearMessages()
   post('/login', JSON.stringify(loginData)).then(data => {
      if (data) {
         localStorage.setItem('token', data)
         store.isAuthorized = true
      }
   })
}

function restoreSession() {
   post('/restore-session', JSON.stringify({ token: localStorage.getItem('token') })).then(data => store.isAuthorized = data)
}

onMounted(restoreSession)

// import { useConfirm } from "primevue/useconfirm";
// import { router } from './router'
// const confirm = useConfirm();
// router.beforeEach((to, from, next) => {
//    if (from.name && from.name.startsWith('update')) {
//       if (store.isBeanChanged) {
//          confirm.require({
//             message: 'У вас есть несохраненные изменения. Продолжить?',
//             header: 'Внимание',
//             icon: 'pi pi-exclamation-triangle',
//             accept: () => {
//                console.log('accept');
//                next()
//             },
//             reject: () => {
//                console.log('reject');
//             }
//          });
//          //let result = confirm("Есть не сохраненные изменения")
//          // console.log({ result });
//       }
//    }
//    else next()
// })
</script>

<style scoped>
.login-card {
   max-width: 400px;
   margin: 150px auto;
}

#toast-container {
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
   padding: 0 10px;
}

.main-container {
   margin-bottom: 16rem;
}
</style>
