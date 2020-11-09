<template>
<div class="home">
    <v-container v-if="posts">
        <v-list-item-title class="headline layout align-center justify-center" v-if="user">
            Welcome {{ user.name }}...!
        </v-list-item-title>
        <Card class="mx-auto my-3" v-for="(post, i) in posts" :key="i" :likedUser="post.likedUser" :getPost="getPost"  :id="post._id" :userid="post.userId" :time="post.createdAt" :content="post.content" :username="post.userName" :likes="post.likes" :comments="post.comments"></Card>
    </v-container>
</div>
</template>

<script>
import axios from 'axios'
import Card from './Card'
export default {
    name: 'Home',
    components: {
        Card
    },
    data: () => ({
        posts: null,
        timer: "",
        user: null
    }),
    created() {
        if (JSON.parse(localStorage.getItem('user'))) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem(
                'jwt'
            )
            this.user = JSON.parse(localStorage.getItem('user'))
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.getPost()
        }, 30000);
        this.getPost();
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = 0;
        console.log("destroyed");
    },
    methods: {
        
        getPost() {
            console.log("getting post");
            axios.get(this.$hostname + "/post/").then(res => {
                if (res.data.status) {
                    this.posts = res.data.posts
                } else {
                    this.$vToastify.error(res.data.message)
                }
            }).catch(err => {
                this.$vToastify.error("unable to get post",err);
            })
        }
    }
}
</script>
