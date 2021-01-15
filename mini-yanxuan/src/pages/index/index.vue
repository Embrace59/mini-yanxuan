<template>
  <div class="index-wrap">

    <!-- 搜索框 -->
    <div class="search">
      <div @click="toMappage">{{cityname}}</div>
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品">
        <span class="search-icon"></span>
      </div>
    </div>
    <!-- 轮播图 -->
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
        <block v-for="(item, index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image class="slide-image" :src="item.image_url" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- channel -->
    <div class="channel">
      <block v-for="(item, index) in channel" :key="index">
        <div class="channel-item" >
          <img :src="item.icon_url" alt="">
          <p>{{item.name}}</p>
        </div>
      </block>
    </div>
    <!-- 品牌 -->
    <div class="brand">
      <div>
        <div class="brand-head">品牌制造商提供</div>
        <div class="brand-content" >
          <div class="brand-item" v-for="(item, index) in brandList" :key="index">
            <div class="brand-desc">
              <p>{{item.name}}</p>
              <p>{{item.floor_price}}元起</p>
            </div>
            <img :src="item.new_pic_url" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 首发新品 -->
    <div class="newGoods">
      <div class="head">
        <div>新品首发</div>
        <div>查看全部</div>
      </div>
      <div class="goodsList">
        <div class="content">
          <div class="goods-item" v-for="(item, index) in newGoods" :key="index" @click="toGoodsDetail(item.id)">
            <img :src="item.list_pic_url" alt="">
            <div class="name">{{item.name}}</div>
            <div class="desc">{{item.goods_brief}}</div>
            <div class="price">￥{{item.retail_price}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 人气推荐 -->
    <div class="newGoods hotGoods">
      <div class="head">
        <div>人气推荐 <span></span> 好物精选</div>
        <div>查看全部</div>
      </div>
      <div class="goodsList">
        <div class="content">
          <div class="goods-item" v-for="(item, index) in hotGoodsList" :key="index" @click="toGoodsDetail(item.id)" >
            <img :src="item.list_pic_url" alt="">
            <div class="name">{{item.name}}</div>
            <div class="desc">{{item.goods_brief}}</div>
            <div class="price">￥{{item.retail_price}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 专题精选 -->
    <div class="special">
      <div class="head">
        <span>专题精选</span>
        <span class="icon"></span>
      </div>
      <div class="specialList">
        <div class="content">
          <div class="special-item" v-for="(item, index) in specialList" :key="index">
            <img :src="item.item_pic_url" alt="">
            <div class="desc">
              <div>{{item.title}}</div>
              <div>{{item.subtitle}}</div>
              <div>{{item.price_info}}元起</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 好物 -->
    <div class="category">
      <div class="categoryList" v-for="(item, index) in categoryList" :key="index">
        <div class="category-head">{{item.name}}好物</div>
        <div class="category-goods">
          <div class="category-goods-item" v-for="(goodsitem, goodsindex) in item.goodsList" :key="goodsindex">
            <img :src="goodsitem.list_pic_url" alt="">
            <div>{{goodsitem.name}}</div>
            <div>￥{{goodsitem.retail_price}}</div>
          </div>
          <div class="category-more">
            <div>{{item.name}}好物</div>
            <span class="icon"></span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import amapFile from '../../utils/amap-wx.js'
import { get } from "../../utils/index.js";

export default {
  data () {
    return {
      banner: [],//轮播图
      channel:[],
      brandList:[],
      newGoods :[],
      hotGoodsList:[],
      specialList: [],
      categoryList: []
    }
  },

  computed:{
    cityname(){
      return this.$store.state.cityname;
    }
  },

  mounted(){
    this.getData();
  },

  methods: {
    //跳转到定位选择页面
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

    //得到用户的位置
    getCityName(){
      var _this = this;
      let myAmapFun = new amapFile.AMapWX({key:'abe0866dd616029979d49b0022570d60'});
      myAmapFun.getRegeo({
        success: function(data){
          //成功回调
          console.log("pages/index.getCityName()成功");
        },
        fail: function(info){
          //失败回调
          console.log(info)
          //如果用户拒绝授权
          // 默认为北京
          _this.cityName = "北京市";
        }
    })
    },

    //to搜索页面
    toSearch(){
      wx.navigateTo({
        url: "/pages/search/main"
      });
    },
    
    //请求index页面所需要的所有data
    async getData(){
      const data = await get("/index/index");
      console.log(data)
      this.banner = data.banner;
      this.channel = data.channel;
      this.brandList = data.brandList;
      this.newGoods  = data.newGoods ;
      this.hotGoodsList = data.hotGoodsList;
      this.specialList = data.specialList;
      this.categoryList = data.categoryList;
    }
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
  .swiper{
    //display: none;
    width: 100%;
    height: 435rpx;
    margin-top: 80rpx;

    .swiper-container{
      width: 100%;
      height: 100%;
      
      .swiper-item{
        width: 100%;
        height: 100%;

        .slide-image {
          width: 100%;
          height: 100%;
        }
      }
      
    }
  }

  .channel{
    display: flex;
    padding: 20rpx 0;
    background: #ffffff;

    .channel-item {
      width: 20%;
      text-align: center;

      img {
        height: 58rpx;
        width: 58rpx;
        display: inline-block;
      }
      p{
        font-size: 12px;
      }
    }
   
  }

  .brand{
    width: 100%;
    margin-top: 20rpx;
    background: #ffffff;

    .brand-head{
      text-align: center;
      padding: 40rpx 0;
    }

    .brand-content{
      width: 730rpx;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;//各行之间留空
      flex-wrap: wrap;

      .brand-item{
        width: 360rpx;
        height: 235rpx;
        position: relative;

        .brand-desc{
          position: absolute;
          top: 0;
          left: 0;
          p:nth-child(1){
            font-size: 16px;
            color: rgb(103, 114, 116);
          }
          p:nth-child(2){
            font-size: 14px;
            color: rgb(151, 151, 151);
          }
        }

        img{
          width: 100%;
          height: 100%;
        }
      }
      
    }

  }
  //发新品
  .newGoods{
    width: 100%;
    margin-top: 20rpx;
    background: #ffffff;

    .head{
      margin-top: 2px;
      width: 100%;
      height: 260rpx;
      text-align: center;
      background: url('../../../static/images/bgnew.png') no-repeat;
      background-size: 100%;
      overflow: hidden;
      //>新品首发文字
      div:nth-child(1){
        margin-top: 30px;
        font-size: 22px;
        color: rgb(136, 150, 150);
      }
      //查看全部文字
      div:nth-child(2) {
        font-size: 16px;
        color: rgb(136, 150, 150);
        width: 174rpx;
        height: 70rpx;
        background: #d0ddeb;
        line-height: 70rpx;
        margin: 0 auto;
        margin-top: 10px;
      }
    }

    .goodsList{
      width: 100%;
      overflow-x: scroll;

      .content{
        white-space: nowrap;//段落中的文本不进行换行：

        .goods-item{
          width: 280rpx;
          height: 416rpx;
          display: inline-block;
          img {
            width: 280rpx;
            height: 280rpx;
          }
          div{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
          }
          .name {
            font-size: 28rpx;
            font-weight: 600;
          }
          .desc {
            font-size: 24rpx;
          }
          .price {
            font-size: 28rpx;
            margin-bottom: 0;
            color: rgb(177, 95, 95);
          }
        }
      }
    }
  }
  //人气推荐 
  .hotGoods {
    .head {
      background: url('../../../static/images/bgtopic.png') no-repeat;
      background-size: 100%;
      div:nth-child(1) {
        color: #b1a279;
        span {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #b1a279;
          margin-bottom: 10rpx;
        }
      }
      div:nth-child(2) {
        background: #f4e9cb;
      }
    }
  }
  //专题精选
  .special {
    background-color: #fff;
    width: 100%;
    margin-top: 20rpx;
    overflow: hidden;
    .head {
      width: 100%;
      text-align: center;
      span:nth-child(1) {
        font-size: 30rpx;
        letter-spacing: 1rpx;
        height: 100rpx;
        line-height: 100rpx;
      }
      span:nth-child(2) {
        display: inline-block;
        width: 32rpx;
        height: 32rpx;
        background: url('../../../static/images/right.png') no-repeat;
        background-size: 100%;
        vertical-align: middle;
        margin-top: -3rpx;
        margin-left: 10rpx;
      }
    }
    .specialList {
      width: 100%;
      overflow-y: scroll;
      .content {
        white-space: nowrap;
        .special-item:nth-child(1) {
          margin-left: 16px;
        }
        .special-item {
          display: inline-block;
          width: 575rpx;
          margin-right: 16rpx;
          img {
            width: 100%;
            height: 325rpx;
            border-radius: 15rpx;
          }
          .desc {
            position: relative;
            margin-top: 10rpx;
            div:nth-child(1) {
              font-size: 28rpx;
              font-weight: 600;
              margin-bottom: 6rpx;
            }
            div:nth-child(2) {
              font-size: 22rpx;
              overflow: hidden;
              color: rgb(126, 126, 126);
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            div:nth-child(3) {
              position: absolute;
              right: 10rpx;
              top: 0;
              font-size: 24rpx;
              color: rgb(221, 96, 96);
            }
          }
        }
      }
    }
  }
  //xx好物
  .category{
    box-sizing: border-box;
    padding: 0 10rpx;
    
    .categoryList{
      width: 100%;

      .category-head{
        font-size: 30rpx;
        text-align: center;
        padding: 30rpx 0;
      }

      .category-goods{
        display: flex;
        justify-content: space-between;//平分剩余空间
        flex-wrap: wrap;

        .category-goods-item{
          width: 360rpx;
          height: 360rpx;
          background-color: #fff;
          margin-bottom: 10rpx;

          img {
            width: 70%;
            height: 70%;
            margin-left: 50rpx;
            // margin: 0 auto;
            margin-bottom: 10rpx;
          }

          div:nth-child(2){
            width: 90%;
            margin: 0 auto;
            font-size: 26rpx;
            white-space: nowrap;//段落中的文本不进行换行
            overflow: hidden;
            text-overflow: ellipsis;
          }

          div:nth-child(3) {
            width: 90%;
            margin: 0 auto;
            font-size: 24rpx;
            color: rgb(233, 78, 78);
            margin-bottom: 6rpx;
          }
        }

        .category-more{
          width: 360rpx;
          background-color: #fff;
          margin-bottom: 10rpx;
          display: flex;
          flex-direction: column;//从上到下flex
          align-items: center;//株洲居中对齐

          div {
            font-size: 34rpx;
            position: relative;
          }

          .icon {
            display: inline-block;
            width: 65rpx;
            height: 65rpx;
            background: url('../../../static/images/rightbig.png') no-repeat;
            background-size: 100%;
            margin-top: 30rpx;
          }
        }
      }
    }
  }
}

</style>
