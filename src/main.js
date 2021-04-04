import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

const app = createApp(App);

app.directive('focus', el => {
    el.focus();
});

app.use(store).mount('#app');
