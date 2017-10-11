//Dependencies
import Vue from 'vue'
import VueResource from 'vue-resource'

//Utils
import _ from 'lodash'

// State management (Vuex)
import store from './store/loader'

// Routing
import router from './routes'
import { sync } from 'vuex-router-sync'
sync(store, router); // vuex sync.

// Vue extensions
Vue.use(VueResource); // httpd requests

// Request credentials interceptors
Vue.http.interceptors.push((request, next) => {
	//Filter by by method
	switch (request.method) {
		case 'GET':
			// Auth header injection for GET API calls
			break;

		case 'POST':
			// Auth header injection for POST API calls
			break
	}

	// continue to next interceptor
	// stop and return response
	next(response => {
		// console.log(response)
	});
});

// Vue instance
new Vue({
	el: '#app',
	store,
	router,
	data,
	// Bus services methods (for main methods)
	methods
});
