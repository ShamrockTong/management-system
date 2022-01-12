<template>
  <div class="d2-page-cover">
    <h1 class="d2-page-cover__sub-title">欢迎使用</h1>
    <h1>{{time}}</h1>
  </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
  data(){
    return {
      time: dayjs().format('HH:mm:ss'),
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  methods:{
    refreshTime(){
      this.time = dayjs().format('HH:mm:ss')
    }
  }
}
</script>
<style lang="scss" scoped>
.d2-page-cover {
  @extend %full;
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .d2-page-cover__logo {
    img {
      width: 200px;
    }
  }
  .d2-page-cover__title {
    margin: 0px;
    margin-bottom: 20px;
    font-weight: bold;
    color: $color-text-main;
  }
  .d2-page-cover__sub-title {
    margin: 0px;
    margin-bottom: 5px;
    color: $color-text-normal;
  }
  .d2-page-cover__build-time {
    margin: 0px;
    margin-bottom: 10px;
    font-size: 12px;
    color: $color-text-placehoder;
  }
}
</style>
