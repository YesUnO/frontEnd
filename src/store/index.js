/* eslint-disable */

import Vue from 'vue';
import Vuex from 'vuex';
import UserModule from './UserModule';
import GameEnteringModule from './GameEnteringModule';
import UserGameSolutionModule from './UserGameSolutionModule';


Vue.use(Vuex);

const initialState = {
    gameResult: null,
    newPasswordDialog: false,
    resultDialog: false,
    ranked: false,
    activeTab: 'sudoku',
    userInfo:{

    },
    currentGame:{
        id: '',
        name: '',
        entering: '',
        solution: '',
        avarageTime: '',
        difficulitySettings: '',
        numberOfSuccessfullSolutions: '',
    },
    unsolvedGames:{
        
    },
    solvedGames:{

    },
    lastGoodSolution: {
        value:'',
        length: 0
    },
    credentials:{
        isAuthorized: false,
        token:''
    }
}

export default new Vuex.Store({
    //strict: true,
    modules: {
        user: UserModule,
        gameEntering: GameEnteringModule,
        userGameSolution: UserGameSolutionModule
    },
    state: {
        gameResult: null,
        resultDialog: false,
        newPasswordDialog: false,
        ranked: false,
        activeTab: 'sudoku',
        userInfo:{

        },
        currentGame:{
            id: '',
            name: '',
            entering: '',
            solution: '',
            avarageTime: '',
            difficulitySettings: '',
            numberOfSuccessfullSolutions: '',
        },
        unsolvedGames:{
            
        },
        solvedGames:{

        },
        lastGoodSolution: {
            value:'',
            length: 0
        },
        credentials:{
            isAuthorized: false,
            token:''
        }
    },
    getters:{
        getUserInfo(state){
            return state.userInfo;
        },
        getLastGoodSolution(state){
            return state.lastGoodSolution
        },
        getCredentials(state){
            return state.credentials;
        },
        getRankedState(state){
            return state.credentials.isAuthorized ? state.ranked : false;
        },
        getNextGameAvailable(state){
            return !!state.unsolvedGames[0]
        },
        getCurrentGame(state){
            return state.currentGame;
        },
        getGameName(state){
            return state.currentGame.name
        }

    },
    mutations:{
        login(state, payload) {
            state.credentials = payload.credentials;
            state.userInfo = payload.user;
        },
        logout(state){
            Object.assign(state,initialState);
        },
        setNewGame(state,game){
            state.currentGame.entering = game.entering;
            state.currentGame.solution = game.solution;
        },
        setNewPasswordDialog(state,boolean){
            state.newPasswordDialog = boolean;
        },
        setActiveTab(state,tab){
            state.activeTab = tab;
        },
        setNewGameFromUnsolved(state){
            Object.assign(state.currentGame,state.unsolvedGames[0]);
        },
        setCompletedGame(state){
            Object.assign(state.currentGame,initialState.currentGame);
            state.unsolvedGames.shift();
        },
        switchRankedState(state){
            state.ranked = !state.ranked;
        },
        setUnsolvedGames(state,payload){
            state.unsolvedGames = payload
        },
        setGameName(state, name) {
            state.currentGame.name = name;
        },
        setAuthorized(state, token) {
            state.credentials ={token:  token, isAuthorized: true};
        },
        setUser(state, payload) {
            state.userInfo = payload;
        },
        setUserPicture(state,payload){
            state.userInfo.picture = payload;
        },
        setResultDialog(state,payload){
            state.resultDialog = payload;
        },
        setGameResult (state,payload){
            state.gameResult = payload;
        },
        setLastGoodSolution(state,payload){
            state.lastGoodSolution = payload;
        }

    },
    actions: {

    }
})
