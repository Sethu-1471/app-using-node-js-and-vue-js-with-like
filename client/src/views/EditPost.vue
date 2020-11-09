<template>
<div>
    <v-container fill-height fluid>
        <v-row align="center" justify="center">
            <v-col>
                <v-card max-width="400px" class="mx-auto pa-5">
                    <!-- <v-textarea v-model="content" label="Type Something..." color="deep-purple accent-4"></v-textarea> -->
                    <ckeditor :editor="editor" v-model="content" :config="editorConfig"></ckeditor>
                    <v-select
                    v-model="status"
          :items="items"
          label="Status"
        ></v-select>
                    <v-btn class="deep-purple accent-4 white--text" @click.once="doUpdate">
                        Update
                    </v-btn>
                    <v-btn class="red white--text mx-2" @click="$router.go(-1)">
                        Cancel
                    </v-btn>
                    <v-btn class="green white--text " @click="dialog = true">
                        Preview
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
     <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="deep-purple accent-4"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Preview</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container fluid>
            <div v-html="content"></div>
        </v-container>
      </v-card>
        </v-dialog>
</div>
</template>

<script>
const axios = require('axios');
 import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export default {
    name: 'EditPost',
    components: {
  
    },
    data: () => ({
        editor: ClassicEditor,
        dialog: false,
        editorConfig: {
            toolbar: ['heading', '|' ,'bold',
                'italic',
                'link',
                '|',
                'NumberedList',
                'BulletedList',
                '|',
                'undo',
                'redo',
            ]
        },
        content: null,
        status: 'public',
        user: null,
        items: ['private', 'public'],
    }),
    created () {
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem(
			'jwt'
        );
        this.user = JSON.parse(localStorage.getItem('user'));
        
    },
    mounted() {
        this.getPost()
    },
    methods: {
        getPost() {
            axios.get(this.$hostname + "/post/getbypostid", {
                params: {
                    userId: this.user._id,
                    postId: this.$route.params.id
                }
            }).then(res => {
                if (res.data.status) {
                    this.content = res.data.post[0].content;
                    this.status = res.data.post[0].status;
                    this.$vToastify.success(res.data.message);
                } else {
                     this.$vToastify.error(res.data.message);
                }
            }).catch(err => {
                this.$vToastify.error(err);
            })
        },
        doUpdate() {
            let body = {
                content: this.content,
                username: this.user.name,
                email: this.user.email,
                userId: this.user._id,
                status: this.status
            }
            axios.put(this.$hostname + "/post/update", body, {
                params: {
                    userId: this.user._id,
                    postId: this.$route.params.id
                }
            }).then(response => {
                if (response.data.status) {
                    this.$vToastify.success(response.data.message);
                    this.$router.go(-1);
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
