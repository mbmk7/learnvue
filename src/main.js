import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';

// 引入index。less（webpack特性）
import './common/less/index.less';

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/goods' }, // 重定向，使一进入页面就到指定路由
    { path: '/goods', component: goods },
    { path: '/ratings', component: ratings },
    { path: '/seller', component: seller }
  ]
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
