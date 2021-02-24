<template>
    <div>
        <v-dialog
            width="350"
            dense
            v-model="newPasswordDialog">
            <v-card>
                <v-card-title>Change password</v-card-title>

                <v-card-actions>
                    <v-form v-model="changePassForm">
                        <v-col>
                            <v-text-field
                            dense
                                outlined
                                v-model="newPassword"
                                label="New Password"
                                hint="At least 8 characters"
                                counter
                                :rules="[rules.required,rules.min]"
                                :append-icon="showPass ? 'mdi-eye':'mdi-eye-off'"
                                :type="showPass ? 'text':'password'"
                                @keyup.enter="changePassword"
                                @click:append="showPass = !showPass"
                                prepend-inner-icon="mdi-lock-outline"
                                />
                            <v-btn
                                fab
                                @click="changePassword"
                                >
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-col>
                    </v-form>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
            v-model="passChangeEvent">
            {{passChangeResult}}
        </v-snackbar>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import { validationMixin } from 'vuelidate'
export default {
    name: 'NewPasswordDialog',
    mixins: [validationMixin],
    data: ()=>({
        passChangeEvent: false,
        passChangeResult: '',
        changePassForm: null,
        newPassword: '',
        showPass: false,
        rules: {
            required:value=>!!value || 'Required',
            min:v=>v.length>=8 || 'Min 8 characters',
        }
    }),
    computed:{
        ...mapState({
            NewPasswordDialog: state => state.newPasswordDialog
        }),
        newPasswordDialog:{
            get(){
                return this.NewPasswordDialog;
            },
            set(boolean){
                this.$store.commit('setNewPasswordDialog',boolean)
            }
        }
    },
    methods:{
        changePassword(){
            let self = this;

            self.$store.dispatch('user/newPassword',{newPassword:self.newPassword} ).then(response=>{
                console.log(response);
                self.passChangeEvent = true;
                if (response.status == 200) {
                    self.passChangeResult = 'Password changed.'
                }
                else{
                    self.passChangeResult = 'Password change failed.'
                }
            })
        }
    }
}
</script>