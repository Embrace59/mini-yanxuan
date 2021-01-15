<template>
  <div class="detail">
    <!-- 轮播 -->
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <block v-for="(item, index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.img_url" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
      <!-- 分享按钮 -->
      <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>

    <!-- 售后 -->
    <div class="swiper-b">
      <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满88元免邮费</div>
    </div>

    <!-- 商品信息 -->
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>￥{{info.retail_price}}</p>
      </div>
      <div v-if="brand.name" class="brand">
          <p>{{brand.name}}</p>
        </div>
    </div>

    <!-- 请选择规格数量 -->
    <div class="section-nav">
      <div>请选择规格数量</div>
      <div></div>
    </div>

    <!-- 商品详情图 -->
    <div class="detail" v-if="info.goods_desc">
      <wxParse :content="info.goods_desc"/>
    </div>

    <!-- 商品参数 -->
    <div class="attribute">
      <div class="head">
        商品参数
      </div>
      <div class="item" v-for="(item, index) in attribute" :key="index">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="common-problem">
      <div class="head">
        <text class="title">常见问题</text>
      </div>
      <div class="content">
        <div class="item" v-for="(item, index) in issueList" :key="index">
          <div class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </div>
          <div class="answer">
            {{item.answer}}
          </div>
        </div>
      </div>
    </div>

    <!-- 大家都在看 -->
    <div class="everybody-look">
      <div class="head">
        <text class="title">大家都在看</text>
      </div>
      <div class="sublist">
        <div v-for="(subitem, subindex) in productList" :key="subindex" @click="toGoodsDetail(subitem.id)">
          <img :src="subitem.list_pic_url" alt="">
          <p>{{subitem.name}}</p>
          <p>￥{{subitem.retail_price}}</p>
        </div>
      </div>
    </div>
    
    <!-- 底部购物车 -->
    <div class="bottom-fixed">
      <!-- 收藏五角星按钮 -->
      <div @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' :'']"></div>
      </div>
      <!-- 购物车图标 -->
      <div @click="toCart">
        <div class="car">
          <span>
            {{totalCount}}
          </span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <!-- 立即购买按钮 -->
      <div @click="buyGoods">立即购买</div>
      <!-- 加入购物车按钮 -->
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 阴影 -->
    <div v-show="showpop" class="pop" @click="showType">
    </div>
    <!-- 选择规格部分 -->
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.primary_pic_url" alt="">
        </div>
        <div class="right">
          <div>
            <p>价格￥{{info.retail_price}}</p>
          </div>
        </div>
        <div @click="showType" class="close">
          X
        </div>
      </div>
      <div class="bottom">
        <p>请选择数量：</p>
        <div class="count">
          <div @click="reduceCount" class="reduce">-</div>
          <input class="number" v-model="goodsCount" />
          <div @click="addCount" class="add">+</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { post, get, login } from "../../utils";
import wxParse from "mpvue-wxparse"
export default {
  
  data () {
      return {
        banner: [], //轮播图
        info: {},   //商品信息
        brand: {},
        attribute: [],//商品参数true
        issueList: [],//常见问题
        productList: [],//大家都爱看
        showpop: false, //展示“选择规格”
        goodsId: "",
        openId: "admin",
        collectFlag: false,//商品是否被收藏,
        goodsCount: 0,//要购买/要加入购物车的商品数量
        totalCount: 0,//购物车中的商品数量，依旧是各个商品的goodsOCount之和
        userInfo:{}
      }
  },

  components:{wxParse},

  mounted() {
    if (login()) {
      this.userInfo = login();
    }
    // this.openId = ??
    this.goodsId = this.$root.$mp.query.id;
    this.getGoodsDetailData();
  },

  //商品share
  onShareAppMessage(){
    return {
      title: this.info.name,
      path: "/pages/goods/main?id=" + this.info.id,
      imageUrl: this.banner[0].img_url //拿第一张商品的图片
    }
  },

  methods:{
    //获取页面初始要展示的数据
    async getGoodsDetailData(){
      const resData = await get("/goods/detailaction",{
        goodsId: this.goodsId,
        openId: this.openId
      })
      this.banner = resData.banner  //轮播图
      this.info = resData.info      //商品信息
      this.allPrice = resData.info.retail_price //商品单价
      this.brand = resData.brand    //品牌
      this.attribute = resData.attribute//商品参数
      this.issueList = resData.issue //常见问题
      this.productList = resData.productList;//大家都爱看
    },

    //收藏
    async collect(){
      this.collectFlag = !this.collectFlag
      const data = await post("/collect/addcollect", {
        openId: this.openId,
        goodsId: this.goodsId
      });
    },

    //购买商品
    async buyGoods(){
      if (login()){
        if(this.showpop){
          //若没有设置购买数量，弹出提示框，结束此函数
          if(this.goodsCount == 0){
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => { }
            });
            return false;
          }
          
          //若设置了购买数量
          const resData = await post("/order/submitAction",{
            goodsId: this.goodsId,
            openId: this.openId,
            allPrice: this.info.retail_price * this.goodsCount
          })
          
          //请求成功，跳转到支付界面
          if(resData){
            wx.navigateTo({
              url: "/pages/order/main"
            })
          }
        }
        else{
          this.showpop = true;
        }
      }
     
    },

    //加入购物车
    async addCart(){
      if(login()){
        if(this.showpop){ //选择数量界面已显示
          if(this.goodsCount == 0){ //加入购物车的数量是0
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
                duration: 2000, //延迟时间,
                icon: "none",
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => { }
            })
            return false
          }
          //向购物车表中加入此商品的
          const resData = await post("/cart/addCart", {
            openId: this.openId,
            goodsId: this.goodsId,
            goodsCount: this.goodsCount
          })
          //添加成功
          if(resData){
            this.totalCount = this.totalCount + this.goodsCount;
            wx.showToast({
              title: "添加购物车成功",
              icon: "success",
              duration: 1500
            })
          }
        }
        else{
          this.showpop = true
        }
      }
      else{
        console.log("bb")
      }
      
    },

    //前往购物车界面
    toCart(){
      wx.switchTab({
        url: "/pages/cart/main"
      });
    },

    //showpop取反
    showType(){
      this.showpop = ! this.showpop
    },

    //前往商品详情页
    toGoodsDetail(id){
      console.log(id)
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id
      })
    },

    //增加购买的商品数量
    addCount(){
      this.goodsCount = this.goodsCount + 1;
    },

    //减少购买的商品数量
    reduceCount(){
      if (this.goodsCount >= 1) {
        this.goodsCount = this.goodsCount - 1;
      } else {
        return false;
      }
    }
  }

};
</script>


<style lang='less' scoped>

.detail{
  
  .swiper{
    width: 750rpx;
    height: 750rpx;
    position: relative;
    .swiper-container{
      width: 100%;
      height: 100%;

        image{
          width: 100%;
          height: 100%;
        }
    }

    .share{
      position: absolute;
      right: 0;
      top: 50rpx;
      width: 150rpx;
      height: 65rpx;
      line-height: 65rpx;
      text-align: center;
      background: #e0a354;
      color: #fff;
      font-size: 24rpx;
    }
  }

  .swiper-b{
    width: 710rpx;
    height: 73rpx;
    margin: 0 auto;
    background: #f4f4f4;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div{
      background: url('http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/servicePolicyRed-518d32d74b.png') 0 center no-repeat;
      background-size: 10rpx;
      padding-left: 15rpx;
      font-size: 25rpx;
      color: #666;
    }
  }

  .goods-info{
    width: 750rpx;
    height: 210rpx;
    background: #fff;
    border-bottom: 1rpx solid #f4f4f4;
    // margin: 0 auto;

    .c{
      height: 100%;

      p{
        display: block;
        text-align: center;
        margin: 0 auto;
      }

      p:nth-child(1) {
        font-size: 41rpx;
        padding: 20rpx;
      }

      p:nth-child(2) {
        margin-bottom: 25rpx;
        font-size: 24rpx;
        color: #999;
      }

      p:nth-child(3) {
        margin-top: 10rpx;
        font-size: 35rpx;
        color: #b4282d;
      }

      .brand {
        margin-top: 25rpx;
        text-align: center;

        p {
          display: inline-block;
          color: #b1a279;
          font-size: 20rpx;
          padding: 5rpx 30rpx;
          border: 1rpx solid #b1a279;
        }
      }
    }
  }

  .section-nav{
    width: 100%;
    height: 80rpx;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 20rpx;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 20rpx;
    padding-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div:nth-child(2) {
      width: 52rpx;
      height: 52rpx;
      background: url('../../../static/images/address_right.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  .attribute{
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx 30rpx;
    background-color: #fff;
    margin-bottom: 20rpx;

    .head{
      font-size: 38rpx;
      padding: 20rpx 0;
    }

    .item{
      display: flex;
      background: #f7f7f7;
      padding: 20rpx 0;
      margin: 20rpx;

      div:nth-child(1){
        width: 134rpx;
        font-size: 25rpx;
        color: #999;
        box-sizing: border-box;
        padding-left: 20rpx;
      }

      div:nth-child(2){
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }    
  }

  .common-problem{
    margin-bottom: 20rpx;
    background: #fff;

    .head{
      font-size: 38rpx;
      padding: 30rpx 0;
      text-align: center;
      align-items: center;
    }

    .content{
      padding: 0rpx 30rpx;
      background: #fff;
      .item{
        padding-bottom: 25rpx;

        .question-box{
          display: flex;
          
          .spot{
            height: 8rpx;
            width: 8rpx;
            background: #b4282d;
            border-radius: 50%;
            margin-top: 11rpx;
          }

          .question {
            line-height: 30rpx;
            padding-left: 8rpx;
            display: block;
            font-size: 26rpx;
            padding-bottom: 15rpx;
            color: #303030;
          }
        }

        .answer {
          line-height: 40rpx;
          padding-left: 16rpx;
          font-size: 26rpx;
          color: #787878;
        }
      }
    }
  }

  .everybody-look{
    margin-bottom: 20rpx;
    background: #fff;

    .head{
      font-size: 38rpx;
      padding: 30rpx 0;
      text-align: center;
      align-items: center;
    }

    .sublist {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 730rpx;
      margin: 0 auto;

      div {
        width: 360rpx;
        background: #fff;
        margin-bottom: 10rpx;
        padding-bottom: 10rpx;

        img {
          display: block;
          width: 302rpx;
          height: 302rpx;
          margin: 0 auto;
        }

        p {
          margin-bottom: 5rpx;
          text-indent: 1em;
        }

        p:nth-child(2) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 98%;
        }

        p:nth-child(3) {
          color: #9c3232;
        }
      }
    }
  }

  .bottom-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 750rpx;
    height: 100rpx;
    display: flex;
    background: #fff;
    z-index: 10;

    div:nth-child(1) {
      height: 100rpx;
      width: 162rpx;
      border: 1rpx solid #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;

      .collect {
        display: block;
        height: 44rpx;
        width: 44rpx;
        background: url('../../../static/images/icon_collect.png') no-repeat;
        background-size: 100% 100%;
      }

      .collect.active {
        display: block;
        height: 44rpx;
        width: 44rpx;
        background: url('../../../static/images/icon_collect_checked.png') no-repeat;
        background-size: 100% 100%;
      }
    }

    div:nth-child(2) {
      height: 100rpx;
      width: 162rpx;
      border: 1rpx solid #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;

      .car {
        position: relative;
        height: 60rpx;
        width: 60rpx;

        span {
          position: absolute;
          top: 0;
          right: 0;
          height: 28rpx;
          width: 28rpx;
          z-index: 10;
          background: #b4282d;
          text-align: center;
          font-size: 18rpx;
          color: #fff;
          line-height: 28rpx;
          border-radius: 50%;
        }

        img {
          display: block;
          height: 44rpx;
          width: 44rpx;
          position: absolute;
          top: 10rpx;
          left: 0;
        }
      }
    }

    div:nth-child(3) {
      height: 100rpx;
      line-height: 96rpx;
      flex: 1;
      text-align: center;
      color: #333;
      border-top: 1rpx solid #f4f4f4;
      border-bottom: 1rpx solid #f4f4f4;
    }

    div:nth-child(4) {
      border: 1rpx solid #b4282d;
      background: #b4282d;
      float: left;
      height: 100rpx;
      line-height: 96rpx;
      flex: 1;
      text-align: center;
      color: #fff;
    }
  }

  .pop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .attr-pop{
    position: fixed;
    width: 100%;
    height: 500rpx;
    bottom: -500rpx;//让这个div隐藏到看不见的地方，-500是因为height=500
    transition: all 400ms ease;
    box-sizing: border-box;
    padding: 30rpx;
    background: #fff;

    .top{
      display: flex;
      position: relative;
      
      .close {
        position: absolute;
        right: 0;
        top: 0px;
        width: 60rpx;
        height: 60rpx;
        font-size: 30rpx;
        color: #999;
        text-align: center;
      }

      .left{
        height: 190rpx;
        width: 190rpx;
        margin-right: 30rpx;

        img{
          box-sizing: border-box;
          height: 190rpx;
          width: 190rpx;
        }
      }

      .right{
        flex: 1;
        display: flex;
        align-items: flex-end;

        p {
          width: 100%;
          line-height: 45rpx;
        }

        p:nth-child(1) {
          color: #b4282d;
        }
      }
    }

    .bottom{
      margin-top: 30rpx;
      .count {
        width: 322rpx;
        height: 71rpx;
        line-height: 71rpx;
        display: flex;
        border: 1rpx solid #ccc;
        margin-top: 20rpx;

        div {
          width: 90rpx;
          font-size: 24px;
          text-align: center;
        }

        input {
          flex: 1;
          height: 100%;
          text-align: center;
          border-left: 1rpx solid #ccc;
          border-right: 1rpx solid #ccc;
        }
      }
    }
  }

  .fadeup {
    transform: translateY(-500rpx); //向上移动500rpx
  }

}

</style>
