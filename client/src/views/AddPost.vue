<template>
<div>
    <v-container fill-height fluid>
        <v-row align="center" justify="center">
            <v-col>
                <v-card max-width="400px" class="mx-auto pa-5">
                    <!-- <v-textarea v-model="content" label="Type Something..." color="deep-purple accent-4"></v-textarea> -->
                    <ckeditor :editor="editor" v-model="content" :config="editorConfig"></ckeditor>
                    <v-select v-model="status" :items="items" label="Status"></v-select>
                    <v-btn class="deep-purple accent-4 white--text" @click.once="doPost">
                        Post
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
    name: 'AddPost',
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
                'undo',
                'redo',
                
            ]
        },
        content: null,
        status: 'public',
        user: null,
        items: ['private', 'public'],
    }),
    created() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem(
            'jwt'
        );
        this.user = JSON.parse(localStorage.getItem('user'));
    },
    methods: {
        doPost() {
            let body = {
                content: this.content,
                username: this.user.name,
                email: this.user.email,
                userId: this.user._id,
                status: this.status,
                createdAt: new Date()
            }
            axios.post(this.$hostname + "/post/add", body, {}).then(response => {
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
