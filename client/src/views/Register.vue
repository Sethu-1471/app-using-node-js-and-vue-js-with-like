<template>
<div>
    <v-container fill-height fluid>
        <v-row align="center" justify="center">
            <v-col>
                <v-card max-width="400px" class="mx-auto pa-5">
                    <v-text-field v-model="name" label="Name" color="deep-purple accent-4"></v-text-field>
                    <v-text-field v-model="phone" label="Phone no" color="deep-purple accent-4"></v-text-field>
                    <v-text-field v-model="email" label="Email" color="deep-purple accent-4"></v-text-field>
                    <v-text-field v-model="password" label="Password" color="deep-purple accent-4" :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (value = !value)" :type="value ? 'password' : 'text'"></v-text-field>
                    <v-btn class="deep-purple accent-4 white--text" @click="doRegister">
                        Register
                    </v-btn>
                    <p class="my-3">Already registered? <v-btn small class="deep-purple accent-4 white--text" @click="$router.push('/login')">
                        Login
                    </v-btn></p>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</div>
</template>

<script>
const axios = require('axios');

export default {
    name: 'Register',
    components: {
        
    },
    data: () => ({
        name: null,
        password: null,
        email: null,
        phone: null,
        value: true
    }),
    watch: {
        
    },
    mounted() {

    },
    methods: {
        doRegister() {
            const form = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                password: this.password
            }
            axios.post(this.$hostname + "/auth/register", form).then(response => {
                if (response.data.status) {
                    this.$vToastify.success(response.data.message);
                    this.$router.push('/login');
                } else {
                    this.$vToastify.error(response.data.message);
                }
            })
        }
    }
}
</script>

<style>

</style>
