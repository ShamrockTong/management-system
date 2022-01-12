import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    username:''
  }
  ,modules: {
    d2admin
  },
  getters:{
    // 参数列表state指的是state数据
    getName(state){
        return state.username;
    }
  },
  actions:{
    setName({commit,state}, name){
      // 跟后台打交道
      // 调用mutaions里面的方法
      commit("setUsername", name);
  }},
  mutations:{
    setUsername(state, name){
      state.username = name;//将传参设置给state的city
    }
  }
    
})
