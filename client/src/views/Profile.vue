<template>
<div>
    <v-card class="mx-auto mt-3" max-width="344" outlined v-if="user" elevation="12">
        <v-list-item five-line>
            <v-list-item-content>
                <div class="overline mb-4">
                    MyProfile
                </div>
                <v-list-item-title class="headline mb-1">
                    {{ user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>ID: {{ user._id }}</v-list-item-subtitle>
                <v-list-item-subtitle>Username: {{ user.email }}</v-list-item-subtitle>
                <v-list-item-subtitle>Phone: {{ user.contact }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="posts">Posts: {{ posts.length }}</v-list-item-subtitle> 
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
                <v-img class="elevation-6" alt="" src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-img>
            </v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
            <v-btn outlined rounded text small>
                Change Password
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-container v-if="posts">
        <Card class="mx-auto my-3" v-for="(post, i) in posts" :key="i" :getPost="getPost" :likedUser="post.likedUser" :status="post.status" :id="post._id" :time="post.createdAt" :content="post.content" :username="post.userName" :userid="post.userId" :likes="post.likes" :comments="post.comments"></Card>
    </v-container>
</div>
</template>

<script>
import Axios from "axios";
import Card from './Card'
export default {
    name: 'Profile',
    components: {
        Card
    },
    data: () => ({
        user: null,
        posts: null
    }),
    created() {
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem(
            'jwt'
        )
        this.user = JSON.parse(localStorage.getItem('user'))
    },
    mounted() {
        this.getPost()
    },
    methods: {
        
        getPost() {
            Axios.get(this.$hostname + "/post/getbyid", {
                params: {
                    userId: this.user._id
                }
            }).then(res => {
                if (res.data.status) {
                    this.posts = res.data.posts
                    this.$vToastify.success(res.data.message);
                }else{
                    this.$vToastify.error(res.data.message);
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
