import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);  // Ensure 'router' is passed correctly here
app.mount('#app');
