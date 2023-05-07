import { showMessage } from "./messages"
import { loading } from "./store"
const API_PREFIX = '/api/smart-panel'
// const API_PREFIX = 'http://localhost:3000/api'


// export const post = async (url, body = '') => {
//    loading.value = true
//    try {
//       const data = await fetch(API_PREFIX + url, { method: 'POST', body, headers: { 'Accept': 'application/json' } })
//       console.log(data);
//       if (!data.ok) {
//          let message = undefined
//          try {
//             const resJson = await data.json()
//             message = resJson.message
//          } catch (e) { /** Nothing to do */ }
//          // console.log(2);
//          throw new Error(message ?? 'Ошибка сервера ' + data.statusText)
//       } else {
//          // console.log(1);
//          const { result, message } = await data.json()
//          if (message) showMessage(message, 5000, 'success')
//          return result
//       }
//    } catch (e) {
//       // console.log(e);
//       showMessage(e.message, 15000, 'error')
//    } finally {
//       // console.log(3);
//       loading.value = false
//    }
// }


export const post = (url, body = '') => new Promise(async resolve => {
   loading.value = true
   try {
      const data = await fetch(API_PREFIX + url, { method: 'POST', body, headers: { 'Accept': 'application/json' } })
      if (!data.ok) {
         let message = undefined
         try {
            const resJson = await data.json()
            message = resJson.message
         } catch (e) { 
            /** Nothing to do */ 
         }
         throw new Error(message ?? 'Ошибка сервера ' + data.statusText)
      } else {
         const { result, message } = await data.json()
         if (message) showMessage(message, 5000, 'success')
         resolve(result ?? true)
      }
   } catch (e) {
      showMessage(e.message, 15000, 'error')
      resolve(false)
   } finally {
      loading.value = false
   }
})

