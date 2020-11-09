<template>
  <v-app id="body">
    <v-app-bar app color="white">
      <div class="d-flex align-center black--text"></div>

      <v-spacer></v-spacer>

      <v-btn @click="$router.push('/')" icon color="#757575">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn
        @click="$router.push('/profile')"
        icon
        color="#757575"
        v-if="isAuth"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-badge color="red" overlap bottom bordered v-if="notifyCount">
        <span slot="badge"> {{ notifyCount }} </span>
        <v-btn @click="notification" icon color="#757575" v-if="isAuth">
          <v-icon>mdi-alarm-light</v-icon>
        </v-btn>
      </v-badge>
      <div v-else>
        <v-btn @click="notification" icon color="#757575" v-if="isAuth">
          <v-icon>mdi-alarm-light</v-icon>
        </v-btn>
      </div>
      <v-btn @click="logout" icon color="#757575" v-if="isAuth">
        <v-icon>mdi-logout</v-icon>
      </v-btn>

      <v-btn
        @click="$router.push('/register')"
        text
        color="#757575"
        v-if="!isAuth"
      >
        <span class="mr-2">Register</span>
      </v-btn>
      <v-btn
        @click="$router.push('/login')"
        text
        color="#757575"
        v-if="!isAuth"
      >
        <span class="mr-2">Login</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
      <v-fab-transition>
        <v-btn
          v-show="isAuth && $router.currentRoute.path === '/profile'"
          color="deep-purple accent-4"
          dark
          fixed
          bottom
          right
          fab
          @click="$router.push('/add/post')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-main>

    <v-footer color="deep-purple accent-4" padless>
      <v-row justify="center" no-gutters class="my-2">
        <v-col
          class="deep-purple accent-4 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().toDateString() }} — <strong>Sethu</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  name: "App",
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    notifyCount: null,
    user: null,
    timer: 0
  }),
  created() {
 
  },
  mounted() {},
  computed: {
    isAuth() {
      return this.$store.state.isAuthenticated;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
  },
  watch: {
    $route() {
      if (JSON.parse(localStorage.getItem("user"))) {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + localStorage.getItem("jwt");
        this.user = JSON.parse(localStorage.getItem("user"));
        this.timer = setInterval(() => {
          this.getUser();
        }, 3000);
      } else {
          clearInterval(this.timer);
          this.timer = 0;
      }
    },
  },
  methods: {
    notification() {
      this.notifyCount = 0;
      this.$router.push("/notification");
    },
    getUser() {
      console.log("getting notification");
      if(this.user){
        axios
        .get(this.$hostname + "/user/", {
          params: {
            userId: this.user._id,
          },
        })
        .then((res) => {
          if (res.data.status && JSON.parse(localStorage.getItem("user"))) {
            const check = JSON.parse(localStorage.getItem("user"));
            this.notifyCount =
              res.data.user[0].notify.length - check.notify.length;
          } else {
            this.$vToastify.error(res.data.message);
          }
        })
        }else {
          clearInterval(this.timer);
          this.timer = 0;
        }
    },
    async logout() {
      clearInterval(this.timer);
      this.timer = 0;
      this.user = null;
      this.notifyCount = 0;
      await localStorage.clear();
      this.$store.state.isAuthenticated = false;
      this.$router.push("/login");
      this.$vToastify.success("Logged Out");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200&display=swap");

.body {
  font-family: "Nunito", sans-serif;
}

.greyColor {
  color: 757575;
}

a {
  color: red !important;
}
</style>
