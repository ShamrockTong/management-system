<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text" id="username">你好 {{username}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data(){
    return{
      // username:''
    }
  },
  created(){
     const data = JSON.parse(localStorage.getItem('userInfo'))
      if (data && data.name){
          this.$store.dispatch('setName',data.name)
      }
      // this.getName()
      // this.$nextTick(function(){
      //   console.log(this.$store.getters.getName);
        // this.username = this.$store.getters.getName
      // })
  }
  ,
  destroyed(){
    this.clearName()
  }
  ,
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    username:function(){
      return this.$store.getters.getName
    }
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    // getName(){
    //   const data = JSON.parse(localStorage.getItem('userInfo'))
    //   if (data && data.name){
    //     this.$nextTick(function(){
    //       this.username = data.name
    //       console.log('nexttick');
    //     })
    //   }
    //   // console.log(data);
    //   // document.querySelector('#username').innerHTML = data.name
    // },
    clearName(){
      localStorage.removeItem('userInfo')
    }
  }
}
</script>
