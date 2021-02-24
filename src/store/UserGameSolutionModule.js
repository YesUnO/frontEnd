import Vue from 'vue'
import Config from '../configuration'

let path = Config.api + '/UserGameSolutions'
export default {
    namespaced: true,
    actions: {
        getAll() {
            return new Promise(function (resolve, reject) {
                Vue.axios.get(path).then(function (response) {
                    if (response.data == null) {
                        reject(new Error('no results'));
                    }
                    else {
                        resolve(response);
                    }
                }, () => {
                    reject(new Error('no results'));
                });
            });
        },

        post(context,payload) {
            console.log(payload );
            return new Promise(function (resolve, reject) {
                Vue.axios.post(path, { game: payload.game, elapsedTime:parseFloat(payload.elapsedTime)}).then(function (response) {
                    if (response.data == null) {
                        reject(new Error('no results'));
                    }
                    else {
                        resolve(response);
                    }
                }, () => {
                    reject(new Error('no results'));
                });
            });
        },

        getById(payload) {
            return new Promise(function (resolve, reject) {
                Vue.axios.get(path + '/' + payload.id).then(function (response) {
                    if (response.data == null) {
                        reject(new Error('no results'));
                    }
                    else {
                        resolve(response);
                    }
                }, () => {
                    reject(new Error('no results'));
                });
            });
        },

        delete(payload) {
            return new Promise(function (resolve, reject) {
                Vue.axios.delete(+ '/' + payload.id).then(function (response) {
                    if (response.data == null) {
                        reject(new Error('no results'));
                    }
                    else {
                        resolve(response);
                    }
                }, () => {
                    reject(new Error('no results'));
                });
            });
        },
    }
}