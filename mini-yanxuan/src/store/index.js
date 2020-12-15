import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        cityName: "定位中.."
    },
    mutations: {
        update(state, config) {

        }
    }
})