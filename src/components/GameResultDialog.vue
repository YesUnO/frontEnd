<template>
    <v-dialog
        v-model="ResultDialog"
        persistent
        max-width="600"
        max-height="800"
        >
            <v-img :src="img">
                <v-container fill-height>
                    <v-col fill-height align-self="end">
                        <v-btn align="end" class="darkShades--text btn"
                        @click="GameResult?nextGame():tryAgain()">
                            {{GameResult?'Play one more':'Try again'}}
                        </v-btn>
                    </v-col>
                </v-container>
            </v-img>
    </v-dialog>
</template>
<script>
import {mapState} from 'vuex'
import emitter from './helpers/eventDispatcher'
export default {
    name:'GameResultDialog',
    computed:{
        ...mapState({
            ResultDialog: state=> state.resultDialog,
            GameResult: state => state.gameResult
        }),
        img: {
            get(){
                if (this.GameResult) {
                    return 'assets/victory.gif'
                }
                else{
                    return 'assets/fail.gif'
                }
            }
        },
        resultDialog:{
            get(){
                return this.ResultDialog
            },
            set(){

            }
        }
    },
    mounted (){
        let self = this;

        self.emitter = emitter.getInstance();
    },
    data: ()=>({
        emitter: null
    }),
    methods:{
        tryAgain (){
            let self = this;

            self.emitter.emit('loadLastGoodSolution');
            self.$store.commit('setResultDialog',false)
        },
        nextGame(){
            let self = this;

            self.$emit('newGame');
            self.$store.commit('setResultDialog',false)
        }
    }
}
</script>