<template>
    <v-container>
        <v-row justify="start" v-if="ranked && !!currentGame">
            <v-col>
                <p class="gameName">{{currentGame.name}}</p>
            </v-col>
            <v-col>
                <p>Avg time: {{currentGame.avarageTime | time}}</p>
            </v-col>
            <v-col>
                <p>Times solved: {{currentGame.numberOfSuccessfullSolutions}}</p>
            </v-col>
        </v-row>
        <v-row justify="start" v-else>
            <p class="pl-3">Normal game</p>
        </v-row>
    </v-container>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name:'nameHeader',
    computed:{
        ...mapState({
            currentGame:state=>state.currentGame,
            ranked:state=>state.ranked
        })
    }
}
</script>