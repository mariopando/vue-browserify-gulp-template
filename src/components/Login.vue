<template>
  <h2>Login</h2>
  <input type="text" placeholder="username" v-model="email"></input>
  <input type="password" placeholder="password" v-model="password"></input>

  <button @click="auth">Enter</button>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            paths: {
                loginApiPath: this.$store.state.app.config.apiUrl + this.$store.state.app.config.loginPath
            },
            masterKey: this.$store.state.app.config.masterKey,
            config: this.$store.state.app.config,
            token: null
        }
    },
    components: {},
    methods: {
        auth(e) {
            var self = this;

            this.$http.post(
                    this.paths.loginApiPath, {
                        access_token: self.masterKey
                    }, {
                        headers: self.getAuthHeader()
                    })
                .then(response => {
                    switch (response.status) {
                        case 201:
                            self.token = response.body.token;

                            self.setUserInterface();
                            break;
                    }
                }, error => {
                    switch (error.status) {
                        case 403:
                            alert(error.data.message);
                            break;

                        case 401:
                            alert('User without access');
                            break;

                        default:
                            alert(error.data.message);
                    }
                });
        },
        getAuthHeader() {
            return {
                'Authorization': 'Basic ' + btoa(this.email + ':' + this.password)
            }
        },
        setUserInterface() {
            var self = this;

            /** store **/
            self.$store.dispatch({
                type: 'app/setUser',
                user: {
                    isLogged: true,
                    token: self.token
                }
            });
        }
    }
}
</script>
