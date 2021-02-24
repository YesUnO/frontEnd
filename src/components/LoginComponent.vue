<template>
    <div v-if="!Credentials.isAuthorized">
        <v-dialog
            v-model="drawer"
            width="350"
            >

            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="darkShades--text btn"
                    color="lightAccent"
                    dark
                    v-bind="attrs"
                    v-on="on"
                >
                Login
                </v-btn>
            </template>

            <v-card>
                <v-tabs>
                    <v-tab @click="resetInput" class="btn">Log in</v-tab>
                    <v-tab @click="resetInput" class="btn">Sign up</v-tab>

                    <v-tab-item>
                        <v-form v-model="logingFormValidity">
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-text-field
                                            v-model="loginName"
                                            dense
                                            outlined
                                            @input="resetEvaluation()"
                                            label="Name"
                                            prepend-inner-icon="mdi-account-outline"
                                        ></v-text-field>
 
                                        <v-text-field
                                            v-model="loginPass"
                                            dense
                                            outlined
                                            label="Password"
                                            :append-icon="showLoginPass ? 'mdi-eye':'mdi-eye-off'"
                                            :type="showLoginPass ? 'text':'password'"
                                            @input="resetEvaluation()"
                                            @keyup.enter="loginWithPassword"
                                            @click:append="showLoginPass = !showLoginPass"
                                            prepend-inner-icon="mdi-lock-outline"
                                        ></v-text-field>

                                        <p class="errorWhiteSpace" v-if="submitStatus[0] == null && submitStatus[3] == null && submitStatus[4] == null" />
                                        <p class="errorMsg" v-if="submitStatus[0] === 'error'"><v-icon class="errorMsgIcon">mdi-alert-circle-outline</v-icon>Fill out all fields.</p>
                                        <p class="errorMsg" v-if="submitStatus[3] === 'unauthorized'"><v-icon class="errorMsgIcon">mdi-alert-circle-outline</v-icon>Wrong login and/or password.</p>
                                        <p class="errorMsg" v-if="submitStatus[4] === '404'"><v-icon class="errorMsgIcon">mdi-alert-circle-outline</v-icon>Server side error.</p>
                                        
                                        <v-btn
                                            :disabled="!logingFormValidity"
                                            fab
                                            @click="loginWithPassword">
                                            <v-icon>mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </v-col> 
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-tab-item>

                    <v-tab-item>
                        <v-form v-model="signinFormValidity">
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-text-field
                                            v-model="signinName"
                                            outlined
                                            label="Name"
                                            dense
                                            :error="signinNameError"
                                            :error-messages="signinNameErrorMsg"
                                            @input="resetEvaluation();checkNameAvailability()"
                                            prepend-inner-icon="mdi-account-outline"
                                            :append-icon="nameTaken ? 'mdi-close':'mdi-check'"
                                        ></v-text-field>

                                        <v-text-field
                                            v-model="signinPass"
                                            outlined
                                            dense
                                            label="Password"
                                            hint="At least 8 characters"
                                            counter
                                            @input="resetEvaluation()"
                                            :rules="[rules.required,rules.min]"
                                            :append-icon="showSigninPass ? 'mdi-eye':'mdi-eye-off'"
                                            :type="showSigninPass ? 'text':'password'"
                                            @keyup.enter="signinWithPassword"
                                            @click:append="showSigninPass = !showSigninPass"
                                            prepend-inner-icon="mdi-lock-outline"
                                        ></v-text-field>

                                        <p class="errorWhiteSpace" v-if="submitStatus[1] == null && submitStatus[3] == null && submitStatus[4] == null" />

                                        <p class="errorMsg" v-if="submitStatus[1] === 'error'"><v-icon left class="errorMsgIcon">mdi-alert-circle-outline</v-icon>Fill out all fields.</p>
                                        <p class="errorMsg" v-if="submitStatus[3] === 'unauthorized'"><v-icon class="errorMsgIcon">mdi-alert-circle-outline</v-icon>Wrong login and/or password.</p>
                                        <p class="errorMsg" v-if="submitStatus[4] === '404'"><v-icon class="errorMsgIcon">mdi-alert-circle-outline</v-icon>Server side error.</p>

                                        <v-btn
                                            fab
                                            @click="signinWithPassword"
                                            >
                                            <v-icon>mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </v-col> 
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-tab-item>
                </v-tabs>
    
                <v-divider/>

                <v-card-actions>
                    <v-container>
                        <v-row justify="center">
                            <v-btn class="btn"
                                @click="singInWithGoogle">
                                Sign in with Google
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import {mapState} from 'vuex'

import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
    name:'LoginComponent',
    mixins: [validationMixin],
    components:{
    },
    data: ()=>({
        drawer: null,
        signinFormValidity:null,
        logingFormValidity:null,
        showLoginPass: false,
        showSigninPass: false,
        loginPass: null,
        loginName: null,
        signinPass: null,
        signinName: null,
        signinNameError:null,
        signinNameErrorMsg:null,
        nameTaken: false,
        userExistLoading: null,
        rules: {
            required:value=>!!value || 'Required',
            min:v=>v.length>=8 || 'Min 8 characters',
        },
        submitStatus:{
            0: null,
            1: null,
            3: null,
            4: null
        }
    }),

    validations: {
        loginPass: {
            required
        },
        loginName: {
            required
        },
        signinPass: {
            required
        },
        signinName: {
            required
        }
    },
    mounted(){


    },
    computed:{
        ...mapState({
            User: state => state.userInfo,
            Credentials: state => state.credentials 
        })
    },
    methods:{
        loginWithPassword(){
            let self = this;

            if  (!self.evaluateUserInput(0,self.$v.loginName.$invalid,self.$v.loginPass.$invalid)){
                return;
            };

            let requestPayload = {name:self.loginName,password:self.loginPass};
            self.$store.dispatch('user/authenticate',requestPayload).then(response=>{
                let payload = {
                    payloadUser:{
                        name:response.data.username,
                        elo:response.data.elo,
                    },
                        
                    token:response.data.token};
                    self.processSuccesfullLogin(payload);
                }, (error)=>{
                    self.processFailedLogin(error);
                }
            );
        },
        processFailedLogin(error){
            let self = this;

            if (error.status == 401) {
                self.submitStatus[3] = 'unauthorized'
            }
            else if(error.status == 500){
                self.submitStatus[4] = '404'
            }
        },
        signinWithPassword(){
            let self = this;

            if  (!self.evaluateUserInput(1,self.$v.signinName.$invalid,self.$v.signinPass.$invalid)){
                return;
            };

            let requestPayload = {name:self.signinName,password:self.signinPass};
            self.$store.dispatch('user/post',requestPayload).then(response=>{
                let payload = {
                    payloadUser:{
                        name:response.data.username,
                        elo:response.data.elo,
                    },
                        
                    token:response.data.token};
                    self.processSuccesfullLogin(payload);
                }, (error)=>{
                    self.processFailedSignin(error)
                }
            );
        },
        checkNameAvailability(){
            let self = this;

            self.userExistLoading = true;
            self.$store.dispatch('user/exist',{name:self.signinName}).then(response=>{
                
                self.nameTaken = response.data.exist;
                self.signinNameError = response.data.exist;
                if (response.data.exist) {
                    self.signinNameErrorMsg ='Name already taken'
                }
                else{
                    self.signinNameErrorMsg = null
                }
                
                
            });
            self.userExistLoading = true;
        },
        async singInWithGoogle(){
            let self = this;

            const googleUser = await self.$gAuth.signIn();
            if  (!googleUser){
                return null;
            }

            let googleProfile = googleUser.getBasicProfile();
            let googleAuth = googleUser.getAuthResponse();
            let user = {
                name: googleProfile.sd,
                picture: googleProfile.wI,
                mail:  googleProfile.kt
            };

            let idToken = googleAuth.id_token;
            self.$store.dispatch('user/postGoogleAuth',{token:idToken}).then(response=>{
                let payload = {
                    payloadUser:{
                        name:user.name,
                        picture:user.picture,
                        mail:user.picture,
                        elo:response.elo,
                    },
                        
                    token:response.data.token};
                    self.processSuccesfullLogin(payload);
            });
        },

        evaluateUserInput(i,name,pass){
            let self = this;

            // self.$v.name.$touch();
            if (name || pass) {
                self.submitStatus[i] = 'error';
                return false;
            }
            return true;
        },

        resetEvaluation(){
            let self = this;

            self.submitStatus[0]=null;
            self.submitStatus[1]=null;
            self.submitStatus[3]=null;
            self.submitStatus[4]=null;
        },

        resetInput(){
            let self = this;

            self.loginPass = '';
            self.loginName = '';
            self.signinPass = '';
            self.signinName = '';
            self.submitStatus[0]=null;
            self.submitStatus[1]=null;
            self.submitStatus[3]=null;
            self.submitStatus[4]=null;
            self.$v.$reset();
        },

        processSuccesfullLogin(payload){
            let self = this;
            
            self.$store.commit('setAuthorized',payload.token);
            self.$store.commit('setUser',payload.payloadUser);
            self.$store.dispatch('gameEntering/getAll').then(response=>{
                self.$store.commit('setUnsolvedGames',response.data);
            })
            self.drawer = false;
        },

    }
}
</script>

<style scoped>
    .errorMsg{
       background:#ee7575c0;
        color:red;
        line-height: 25px;
        border-color: red;
        border-bottom: 1px solid;
        border-top: 1px solid;
    }
    .errorWhiteSpace{
        height: 27px;
    }
    .errorMsgIcon{
        color:red;
        float:left;
        padding-left:10px;
    }
</style>