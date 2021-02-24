<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-avatar size="36px" tile>
          <v-img src="./assets/logo.png"/>
      </v-avatar>
      <v-app-bar-title class="header">Sarah's Sudoku</v-app-bar-title>
      <v-spacer class="headerSpace"/>
      <v-tabs v-model="activeTab">
        <v-tab key="profile" class="pa-0 ma-0" style="min-width:0px">
        </v-tab>
        <v-tab key="sudoku" to="/">
          Home
        </v-tab>
        <v-tab key="leaderboard" to="/leaderbord">
          Leaderboard
        </v-tab>
      </v-tabs>
      <v-spacer/>
      <login-component v-if="!Credentials.isAuthorized"/>
      <profile-dropdown v-if="Credentials.isAuthorized"/>       
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable */
import {mapState} from 'vuex';
import ProfileDropdown from './components/ProfileDropdown.vue';
import SudokuGrid from './components/games/sudoku/SudokuGrid.vue';
import LoginComponent from './components/LoginComponent.vue';
import LeaderBordChart from './components/LeaderBordChart.vue';

export default {
  name: 'App',
  components: {
    SudokuGrid,
    ProfileDropdown,
    LoginComponent,
    LeaderBordChart
  },

  data: () => ({
        }),
        mounted(){
        },
    computed: {
        ...mapState({
            User: state => state.userInfo,
            Credentials: state => state.credentials,
            ActiveTab: state => state.activeTab
        }),
        activeTab:{
          get(){
            return this.ActiveTab
          },
          set(tab){
            this.$store.commit('setActiveTab',tab)
          }
        }
        // isAuthenticated: function (){
        //     return vue.prototype.$auth.isAuthenticated
        //     }
    },
    methods: {
        
    }
};
</script>

<style>
    @font-face {
        font-family: 'Grizzly';
        src: local('Grizzly'), url('./assets/Grizzly.ttf') format('truetype');
    }

    .headerSpace{
      min-width: 100px;
    }

    .header{
      font-family: 'Grizzly';
      font-size: xx-large !important;
      padding-left:1.5rem !important;
      color:#BF4EA3;
      font-weight: 500;
      white-space: nowrap;
    }

    .btnInGroup{
      margin-bottom: 2em;
    }
    .btn, .btnInGroup{
      font-weight: 600;
    }
    .app-bar{
      max-width: 1000px;
    }
    .tableItems{
      font-family: 'Source Sans Pro', sans-serif;
      color: #2D4186;
    }

    .profile-drpdwn{
      padding-right: .5rem;
    }
    .gameName{
      font-family: 'Grizzly';
      color: #D58C79;
      font-weight: 500;
      font-size: large;
    }

    #app {
        font-family: 'Source Sans Pro', sans-serif;
        /* -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; */
        text-align: center;
        font-weight: 600;
        color: #2D4186;
        padding-left: 10px;
        /*margin-top: 60px;*/
        width: 100%;
        height: 100%;
        background: #F6F6F1;
        overflow-x: hidden;
        /*overflow-y: scroll;*/
    }
</style>
