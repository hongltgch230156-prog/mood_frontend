import { createPinia } from 'pinia';
import { createApp } from 'vue'
import App from './App.vue'

// import router
import router from './router'

//import css
import 'semantic-ui-css/semantic.min.css'
import Swal from 'sweetalert2'
import { useAuthStore } from './helpers/auth';

//create new web app instance
const app = createApp(App)
const pinia = createPinia();

app.use(pinia);
app.use(router)

const auth = useAuthStore();
auth.init();

//mount app
app.mount('#app')

