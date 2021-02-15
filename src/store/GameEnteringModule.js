import Vue from 'vue'
import Config from '../configuration'

let path = Config.api + '/GameEnterings'
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
            return new Promise(function (resolve, reject) {
                Vue.axios.post(path, { id: payload.id, entering: payload.entering, solution: payload.solution, difficulitySettings: payload.difficulitySettings }).then(function (response) {
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

        put(payload) {
            return new Promise(function (resolve, reject) {
                Vue.axios.put(path + '/' + payload.id, { id: payload.id, entering: payload.entering, solution: payload.solution, difficulitySettings: payload.difficulitySettings }).then(function (response) {
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