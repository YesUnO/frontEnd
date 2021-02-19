import Vue from 'vue'
import Config from '../configuration'

let path = Config.api + '/Users'
export default {
    namespaced: true,
    actions: {
        get() {
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

        postGoogleAuth(context,payload) {
            return new Promise(function (resolve, reject) {
                Vue.axios.post(path + '/CreateGoogle',{token:payload.token}).then(function (response) {
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

        getLeaderboard() {
            return new Promise(function (resolve, reject) {
                Vue.axios.get(path + '/LeaderBoard').then(function (response) {
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

        post(context, payload) {
            return new Promise(function (resolve, reject) {
                Vue.axios.post(path, { username: payload.name,  password: payload.password }).then(function (response) {
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

        exist(context, payload) {
            return new Promise(function (resolve, reject) {
                Vue.axios.get(path + '?name=' + payload.name ).then(function (response) {
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

        authenticate(context, payload) {
            return new Promise(function (resolve, reject) {
                Vue.axios.post(path +'/authenticate', { username: payload.name,  password: payload.password }).then(function (response) {
                    if (response.data == null) {
                        reject(new Error('no results'));
                    }
                    else {
                        resolve(response);
                    }
                }, error => {
                    reject(error.response.data);
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
                Vue.axios.put(path + '/' + payload.id, { id: payload.id, name: payload.name, resolvedgameEnterings: payload.resolvedgameEnterings, elo: payload.elo }).then(function (response) {
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