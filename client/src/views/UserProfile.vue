<template>
  <div>
      <v-card
    class="mx-auto mt-3"
    max-width="344"
    outlined
    v-if="user"
    elevation="12"
  >
    <v-list-item five-line>
      <v-list-item-content>
        <div class="overline mb-4">
          {{ user[0].name }} Profile
        </div>
        <v-list-item-title class="headline mb-1">
          {{ user[0].name }}
        </v-list-item-title>
        <v-list-item-subtitle>ID: {{ user[0]._id }}</v-list-item-subtitle>
        <v-list-item-subtitle>Username: {{ user[0].email }}</v-list-item-subtitle>
        <v-list-item-subtitle>Phone: {{ user[0].contact }}</v-list-item-subtitle>     
        <v-list-item-subtitle v-if="posts">Posts: {{ posts.length }}</v-list-item-subtitle> 
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
        
      ><v-img
            class="elevation-6"
            alt=""
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-img></v-list-item-avatar>
    </v-list-item>
  </v-card>
    <v-container v-if="posts">
      <Card class="mx-auto my-3" v-for="(post, i) in posts" :key="i" :getPost="getUser" :id="post._id" :likedUser="post.likedUser"  :time="post.createdAt" :content="post.content" :username="post.userName" :likes="post.likes" :comments="post.comments"></Card>
    </v-container>
  </div>
</template>

<script>
import Axios from "axios";
import Card from './Card'
export default {
    name: 'UserProfile',
    components: {
      Card
    },
    data: () => ({
        user: null,
        posts: null
    }),
    created () {
		Axios.defaults.headers.common['Authorization'] =  'Bearer '+ localStorage.getItem(
			'jwt'
        )
    },
    mounted() {
    this.getUser()
    },
  methods: {
    getUser() {
        Axios.get(this.$hostname + "/user/getUserAndPublicPostById", {
        params: {
          userId: this.$route.params.id
        }
      }).then(res => {
        if (res.data.status) {
                    this.user = res.data.user
                    this.posts = res.data.posts
                    this.$vToastify.success(res.data.message);
                } else{
                    this.$vToastify.error(res.data.message)
                }
      }).catch(err => {
         this.$vToastify.error(err);
      })
    }
  }
}
</script>

<style>

</style>