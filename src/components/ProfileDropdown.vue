<template>
    <v-menu
        rounded
        offset-y
      >
        <template v-slot:activator="{on}">
            <v-btn
            class="mr-5"
                icon
                v-on="on"
            >
                <v-avatar size="42px">
                    <v-img :src="User.picture" />
                </v-avatar>
            </v-btn>
        </template>

        <v-card>
            <v-list>
                <v-list-item v-for="(item,index) in dropdownItems" :key="index" @click="item.action" offset-y bottom right>
                    <v-list-item-action>
                        <v-list-item-title><v-icon>{{item.icon}}</v-icon>{{item.title}}</v-list-item-title>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>
<script>
/* eslint-disable */
import {mapState} from 'vuex'
import emitter from './helpers/eventDispatcher'
export default {
    name: 'ProfileDropdown',
    data:(e)=>({
        menu:false,
        emitter:null,
        dropdownItems: [{
            icon:'mdi-account',
            title:'Profile',
            action: action => {e.goToProfile() }
        },
        {
            icon:'mdi-logout',
            title:'Log out',
            action: action => {e.logout() }
        }]
    }),
    mounted() {
        let self = this;

        self.emitter = emitter.getInstance();
    },
    computed:{
        ...mapState({
            User:state=>state.userInfo
        })
    },
    created(){
        let self = this;
        
        if (self.User.picture == null || '') {
        self.$store.commit('setUserPicture','assets/BlankProfile.png');
        }
    },
    methods: {
        logout() {
            let self = this;
            
            self.$store.commit('logout');
            if (self.$router.currentRoute.path != '/') {
                self.$router.push({ path: "/" });
            }
            else{
                self.emitter.emit('newGame');
            }
            
        },
        goToProfile(){
            let self = this;
            
            self.$router.push({ path: "/profile" });
            
        }
    }

}
</script>
<style>
</style>