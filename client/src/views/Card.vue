<template>
<div>
<v-card color="deep-purple accent-4" class="mx-auto" max-width="400" id="id">
    <v-card-text class="white--text" v-html="content">
        
    </v-card-text>
    <v-card-actions>
        <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
                <v-img class="elevation-6" alt="" src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-img>
            </v-list-item-avatar>

            <v-list-item-content class="white--text" >
                <v-list-item-title @click="routeChange(userid)" style="cursor: pointer">{{ username }}</v-list-item-title>
                <small class="subheading">{{ getHumanDate(time) }}</small>
                <small class="subheading">{{ status }}</small>
            </v-list-item-content>

            <v-row align="center" justify="end" v-if="isAuth">
                <v-icon class="mr-1" id="id" :disabled="disabled" :color="showLike(likedUser) ? 'red' : 'white'" @click.stop="showLike(likedUser) ? removelike(id) : addlike(id)">
                    mdi-heart
                </v-icon>
                <span class="subheading mr-2 white--text" style="cursor: pointer" id="id" @click.stop="dialog = true"> {{ likedUser.length }} </span>
                <span class="mr-1">·</span>
                <v-icon class="mr-1" id="id" color="white">
                    mdi-comment
                </v-icon>
                <span class="subheading white--text"> {{ comments }} </span>
                <v-icon class="mx-2" color="red" id="id" v-if="userid === user._id" @click.stop="$router.push('/editpost/' + id);" >
                    mdi-pen
                </v-icon>
                <v-icon class="mr-1" color="red" :disabled="disabled" id="id" v-if="$router.currentRoute.path === '/profile'" @click.stop="doDelete(id)">
                    mdi-delete
                </v-icon>
            </v-row>
        </v-list-item>
    </v-card-actions>
</v-card>

<v-dialog
      v-model="dialog"
      scrollable
      max-width="300px"
    >
      <v-card
    class="mx-auto"
    max-width="300"
    tile
  >
    <v-list flat>
      <v-subheader>Liked by</v-subheader>
      <v-list-item-group
        color="primary"
      >
        <v-list-item
          v-for="(item, i) in likedUser"
          :key="i"
        >
          <v-list-item-icon>
            <v-icon color="red">mdi-heart</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-card-actions>
          <v-btn
            color="deep-purple accent-4"
            class="white--text"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
  </v-card>
    </v-dialog>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios'
export default {
    props: ['content', 'likes', 'comments', 'username', 'time', 'id', 'status', 'userid', 'getPost', 'likedUser'],
    data: () => ({
        user: null,
        disabled: false,
        dialog: false
    }),
    created() {
        this.user = JSON.parse(localStorage.getItem('user'));
    },
     methods: {
         doDelete: function (id) {
             this.disabled = true;
            axios.delete(`${this.$hostname}/post/${id}`).then(res => {
                if (res.data.status) {
                    this.$vToastify.success(res.data.message);
                    this.getPost()
                    this.disabled = false;
                }else {
                  this.$vToastify.error(res.data.message);
                  this.disabled = false;
                }
            }).catch(err => {
                this.$vToastify.error(err);
                this.disabled = false;
            })
        },
         addlike(postId) {
            console.log("liked");
            this.disabled = true;
            axios.put(this.$hostname + "/post/likeaction", [], {
                params: {
                    userId: this.user._id,
                    postId: postId
                }
            }).then(response => {
                if (response.data.status) {
                    this.getPost();
                    this.disabled = false;
                } else {
                    this.$vToastify.error(response.data.message);
                    this.disabled = false;
                }
            })
        },
        removelike(postId) {
            console.log("unliked");
            this.disabled = true;
            axios.put(this.$hostname + "/post/unlikeaction", [], {
                params: {
                    userId: this.user._id,
                    postId: postId
                }
            }).then(response => {
                if (response.data.status) {
                    this.getPost();
                    this.disabled = false;
                } else {
                    this.$vToastify.error(response.data.message);
                    this.disabled = false;
                }
            })
        },
        getHumanDate: function (date) {
            return moment(date).fromNow()
        },
        showLike: function (users) {
            if ( users.some((user) => user === this.user._id) ) {
                return true
            }else{
                return false;
            }
        },
        routeChange: function (id) {
          this.$router.push('/profile/' + id);
        },
    },
    mounted(){
    },
    computed: {
        isAuth() {
            return this.$store.state.isAuthenticated;
        }
    },
}
</script>

<style>

</style>
