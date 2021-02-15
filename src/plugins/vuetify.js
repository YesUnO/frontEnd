import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme:{
        themes:{
            light:{
                primary:'#7C9FC7',
                darkShades: '#2D4186',
                darkAccent: '#BF4EA3',
                lightShades: '#F6F6F1',
                lightAccent: '#D58C79'

            }
        }
    }
})



export default vuetify;
