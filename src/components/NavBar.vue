<template>
<v-container>
    <v-row>
        <v-col>
            <v-list-item>
                <v-list-item-avatar tile>
                    <v-img src="assets\1 sudoku.png/"/>
                </v-list-item-avatar>
                <v-list-item-content>
                    
                </v-list-item-content>
            </v-list-item>
            
        </v-col>
        <v-col>
            <v-btn @click.stop="drawer = !drawer">
                Log in
            </v-btn>
            <profile-dropdown v-if="Credentials.isAuthorized"/>
            <!-- <v-btn v-if="!isAuthenticated"
                    @click="login">
                        Login
                    </v-btn> 
                <div id="my-signin2"></div> -->
        </v-col>
    </v-row>
</v-container>
</template>
<script>
import {mapState} from 'vuex'
export default {
    name: 'NavBar',
    components:{
    },
    data: ()=> ({
        googleSignInParams:{
            client_id: '13632970223-nj6m374a6p61r8so6i9spuhen2oal5s6.apps.googleusercontent.com'
        }
    }),
    mounted(){
    //     gapi.signin2.render('my-signin2', {
    //     'scope': 'profile email',
    //     'width': 240,
    //     'height': 50,
    //     'longtitle': true,
    //     'theme': 'dark',
    //     'onsuccess': this.onSuccess,
    //     'onfailure': this.onFailure
    //   });
    },
    watch: {
        // isAuthenticated: function(){
        //     let self = this;
            
        //     self.$nextTick(async ()=>{
        //         if (self.isAuthenticated){
        //         let authId = self.$auth.user.sub;
        //         let name = self.$auth.user.name;
        //         let token = await self.$auth.auth0Client.getTokenSilently();
        //         console.log(token)
        //         self.$store.commit('setToken',token);
        //         self.$store.dispatch('user/post', { id: 0, name: name, resolvedgameEnterings: [], authId: authId, elo: 0 }).then(response =>{
        //             //success
        //         }, ()=>{
        //             //error
        //         });
        //     }
        //     })
            
        // }
    },
    computed: {
        ...mapState({
            User: state => state.userInfo,
            Credentials: state => state.credentials 
        })
        // isAuthenticated: function (){
        //     return vue.prototype.$auth.isAuthenticated
        //     }
    },
    methods: {
        // login (){
        //     let self = this;

        //     let login = self.$auth.loginWithRedirect();
        // },
        // onSuccess(googleUser) {
        //     let gUser = googleUser.getBasicProfile()
        //     console.log(gUser);
        // },
        // onFailure(error) {
        //     console.log(error);
        // }
    }
}
</script>
<style>
</style>