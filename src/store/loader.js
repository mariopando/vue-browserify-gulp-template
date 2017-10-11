import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

//Separate Module States
import appModule from './modules/app/module'

export default new Vuex.Store({
    strict: true,
    modules: {
        app: appModule
    }
})
