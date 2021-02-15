import Vue from 'vue';
import Router from 'vue-router';
import Sudoku from '../components/games/sudoku/SudokuGrid.vue';
import Profile from '../components/Profile.vue';
import Leaderbord from '../components/LeaderBordChart.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'sudoku',
            component: Sudoku
        },
        {
            path: "/profile",
            name: "profile",
            component: Profile,
        },
        {
            path: "/leaderbord",
            name: "leaderbord",
            component: Leaderbord,
        }
    ]
});