<template>
    <v-container>
        <new-password-dialog/>
        <v-card
            width="500px">
            <v-card-title>Profile</v-card-title>
                <v-row>
                    <v-col>
                        <div class="text">
                            Name
                        </div>
                        <div class="text">
                            Elo
                        </div>
                        <v-spacer/>
                        <v-btn
                        @click="setNewPassword">
                            Change password
                        </v-btn>
                    </v-col>
                    <v-col>
                        <div class="text">
                            {{User.name}}
                        </div>
                        <div class="text">
                            {{User.elo}}
                        </div>
                    </v-col>
                </v-row>
        </v-card>
    </v-container>
</template>
<script>
import {mapState} from 'vuex'
import NewPasswordDialog from './NewPasswordDialog.vue';
export default {
    name:'Profile',
    components: { NewPasswordDialog },
    computed:{
        ...mapState({
            User: state=>state.userInfo
        }),
    },
    methods:{
        setNewPassword(){
            let self = this;

            self.$store.commit('setNewPasswordDialog',true);
        }
    }
}
</script>

<style>
    .text {
        margin-left: 25px;
        text-align: left;
    }
</style>