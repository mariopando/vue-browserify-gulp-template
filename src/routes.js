// 1. Define route components.
// These can be imported from other files
//dependencias
import Vue from 'vue'
import VueRouter from 'vue-router'

// Components
import Login from './components/Login.vue'

// Vue extensions
Vue.use(VueRouter);

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
const routes = [{
        path: '/',
        component: Login,
        name: 'Login Page'
    }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.,
export default new VueRouter({
    mode: 'hash',
    routes // short for routes: routes
})
