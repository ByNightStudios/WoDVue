import Vue from 'vue';
import VueRouter from 'vue-router';
import vHome from '../views/Home.vue';
import vMonster from '../views/Monster.vue';
import vAbout from '../views/About.vue';
import vNotFound from '../views/NotFound.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: vHome,
  },
  {
    path: '/monsters',
    component: vMonster,
    props: true,
    children: [
      {
        // Monster will be rendered inside Monster's <router-view>
        // when /monsters/:monster is matched
        path: '/:monster',
        name: 'Monster',
        component: vMonster,
      },
      {
        // ContentType will be rendered inside Monsters's <router-view>
        // when /monsters/:monster/:contentType is matched
        path: '/:monster/:contentType',
        name: 'Content',
        component: vMonster,
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    component: vAbout,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '*',
    component: vNotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

Vue.use(VueRouter);

export default router;
