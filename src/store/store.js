import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

//Separate Module States
import appStore from './modules/app/store'

export default new Vuex.Store({
    strict: true,
    modules: {
        app: appStore
    }
})
