<template>
<div>
    <v-container v-if="notify">
        <v-card color="deep-purple accent-4" class="mx-auto" max-width="400" v-for="(i, j) in notify" :key="j">
            <v-card-actions>
                <v-list-item class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" alt="" src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content class="white--text">
                        <!-- <v-list-item-title @click="routeChange(id)" style="cursor: pointer">{{ i.message }}</v-list-item-title> -->
                        <small class="subheading"> {{ i.message }} </small>
                        <small class="subheading "> {{ getHumanDate(i.time) }} </small>
                    </v-list-item-content>

                </v-list-item>
            </v-card-actions>
        </v-card>
    </v-container>
</div>
</template>

<script>
import Axios from "axios";
import moment from 'moment';
export default {
    name: 'Notify',
    components: {

    },
    data: () => ({
        user: null,
        notify: null
    }),
    created() {
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem(
            'jwt'
        )
        this.user = JSON.parse(localStorage.getItem('user'))
    },
    mounted() {
        this.getUser()
    },
    methods: {

        getHumanDate: function (date) {
            return moment(date).fromNow()
        },
        getUser() {
            Axios.get(this.$hostname + "/user/", {
                params: {
                    userId: this.user._id
                }
            }).then(res => {
                if (res.data.status) {
                    localStorage.setItem('user', JSON.stringify(res.data.user[0]));
                    this.user = res.data.user;
                    this.notify = res.data.user[0].notify.reverse()
                    this.$vToastify.success(res.data.message);
                } else {
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
