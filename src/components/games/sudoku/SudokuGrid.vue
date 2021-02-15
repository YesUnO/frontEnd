<template>
    <div>
        <game-result-dialog @newGame="newGame()"/>
        
        <div v-if="downloaded">
            <v-container>
                <v-row>
                    <v-col style="max-width:600px">
                        <v-row style="height: 100px">
                            <game-header/>
                        </v-row>
                        
                        <v-row>
                            <div :id="containerId"/>
                        </v-row>
                    </v-col>
                    <v-col style="max-width:300px">
                        <v-row style="height: 100px"/>
                        
                        <v-row justify="center">
                            <v-btn 
                                @click="newGame"
                                x-large
                                class="darkShades--text btnInGroup"
                                color = "lightAccent"
                                block
                                >
                                New Game
                            </v-btn>
                        </v-row>
                        <v-row justify="space-between">
                            <v-btn
                                @click="switchNotes"
                                class="darkShades--text btnInGroup"
                                >
                                <v-icon>mdi-pencil-outline</v-icon>
                                <v-chip label
                                        x-small>
                                    {{notesTag}}
                                </v-chip>
                            </v-btn>
                            <v-btn 
                                class="darkShades--text btnInGroup"
                                @click="hint"
                                >
                                <v-icon>mdi-crosshairs-question</v-icon>
                            </v-btn>
                        </v-row>
                        <v-row>
                            <v-switch
                                class="darkShades--text btnInGroup"
                                v-if="Credentials.isAuthorized"
                                v-model="ranked"
                                @click="newGame()"
                                label="Ranked"
                                />
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <div class="text" v-else>
            Downloading...
        </div>
    </div>
</template>

<script>
/* eslint-disable */
  import emitter from '../../helpers/eventDispatcher.js'
  import nameRandomizer from '../../helpers/nameRandomizer'
  import gameHeader from '../../gameHeader.vue'
  import gameResultDialog from '../../GameResultDialog'
  import {mapState} from 'vuex'
  export default {
    name: "SudokuGrid",
    mixins:[nameRandomizer],
    components:{
        gameHeader,
        gameResultDialog
    },
    data() {
      return {
        downloaded: false,
        gameInstance: null,
        emitter: null,
        containerId: 'sudoku',
        notes: false,
        notesTag: 'OFF',
      }
    },
    computed:{
        ...mapState({
            User: state=>state.userInfo,
            Credentials: state=>state.credentials,
            CurrentGame: state=>state.currentGame,
            Ranked: state=>state.ranked
        }),
        ranked:{
            get (){
                return this.Ranked
            },
            set(){
                this.$store.commit('switchRankedState');
            }
        }
    },
    async mounted() {
        let self = this;

        self.emitter = emitter.getInstance();

        const game = await import('./sudoku.js');
        self.downloaded = true;
        self.$nextTick(() => {
            self.gameInstance = game.launch(self.containerId)
        });
    },
    destroyed() {
        let self = this;

        self.gameInstance.destroy(false)
    },
        methods: {
            //eslint config
            /*eslint-disable no-console*/
            /*eslint-disable no-unused-vars*/
            newGame() { 
                let self = this;

                if (self.ranked) {
                    let newGame = self.$store.getters.getNextGameAvailable
                    if (!newGame) {
                        let gameName = self.getRandomName();
                        self.$store.commit('setGameName',gameName);
                    }
                    else{
                        self.$store.commit('setNewGameFromUnsolved');
                    }
                }
                self.emitter.emit('newGame');
                
            },

            switchNotes() {
                let self = this;

                self.emitter.emit('switchNotes');
                self.notes = !self.notes;
                self.notesTag = self.notes? 'ON' : 'OFF'
            },

            hint() {
                let self = this;

                self.emitter.emit('hint')
            }
        }
  }
</script>

<style scoped>
  .header {
    font: Grizzly;
    font-size: 64px;
    color: #BF4EA3;
    font-weight: normal;
  }

  .text {
    font: Avenir;
  }
</style>
