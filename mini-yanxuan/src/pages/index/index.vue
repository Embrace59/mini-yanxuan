<template>
  <div class="index-wrap">
    <!-- 搜索框 -->
    <div class="search">
      <div @click="toMappage">{{cityname}}</div>
      <div>
        <input type="text" placeholder="搜索商品">
        <span class="search-icon"></span>
      </div>
    </div>
    <!-- 轮播图 -->
    <!-- <div class="swiper">
      <swiper>
        <block>
          <swiper-item>

          </swiper-item>
        </block>
      </swiper>
    </div> -->
    <!-- channel -->
    <!-- <div class="channel">
    </div> -->
    <!-- 品牌 -->
    <!-- <div class="brand">
    </div> -->



  </div>
</template>

<script>

import amapFile from '../../utils/amap-wx.js'

export default {
  data () {
    return {
      cityname: '广州市白云区'
    }
  },

  components: {},

  methods: {
    //toMappage
    toMappage (){
      let _this = this;
      // 通过 wx.getSetting 先查询一下用户是否授权 “scoped.record”
      wx.getSetting({
        success(res){
          if(!res.authSetting['scope.userLocation']){//没有授权位置信息,打开设置
            wx.openSetting({
              success: res => {
                // 获取授权位置信息
                _this.getCityName()
              }
            });
          }
          else{
            wx.navigateTo({
              url: '/pages/mappage/main',
            });
          }
        }
      });
    },
    //getCityName
    getCityName(){
      var _this = this;
      let myAmapFun = new amapFile.AMapWX({key:'abe0866dd616029979d49b0022570d60'});
      myAmapFun.getRegeo({
        success: function(data){
          //成功回调
          console.log(data);
        },
        fail: function(info){
          //失败回调
          console.log(info)
          //如果用户拒绝授权
          // 默认为北京
          _this.cityName = "北京市";
        }
    })
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped lang="less">
.index-wrap{
  width: 100%;
  position: relative;
  .search{
    width: 100%;
    position: fixed;
    top: 0;
    height: 80rpx;
    display: flex;
    align-items: center;
    background: #fff;

    div:nth-child(1){
      width: 115rpx;
      text-align: center;
      overflow: hidden;
      white-space: nowrap; //文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
      text-overflow: ellipsis;//当文本溢出包含元素时,显示省略符号来代表被修剪的文本。
      font-size: 20rpx;
      padding-right: 15rpx;
    }

    div:nth-child(2){
      flex: 1;
      position: relative;

      input{
        width: 100%;
        height: 56rpx;
        border-radius: 8rpx;
        background: #ededed;
        box-sizing: border-box;
        padding-left: 48rpx;
      }

      .search-icon{
        position: absolute;
        top: 15rpx;
        left: 10rpx;
        background: url('http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/search2-2fb94833aa.png') center no-repeat;
        background-size: 100%; //指定背景图像的大小, 不加这个不会显示icon
        width: 28rpx;
        height: 28rpx;
        margin-right: 10rpx;
        // background-color: pink;
      }
    }
  }
}

</style>
