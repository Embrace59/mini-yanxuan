import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        cityname: "定位中.."
    },
    mutations: {
        //更新state的数据
        UPDATE(state, data) {
            // Object.keys()详解 ： https://www.cnblogs.com/llcdxh/p/9476347.html
            //map()可以遍历array [Object.keys()返回的就是一个array ]
            Object.keys(data).map((item, key) => {
                state[item] = data[item]
            })
        }
    }
});