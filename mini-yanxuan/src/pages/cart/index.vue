<template>
  <div class="cart">
    <div class="top">
      <div>30天无忧退货</div>
      <div>48小时快速退款</div>
      <div>满88元免邮费</div>
    </div>
    <div class="cartlist">
      <!--  -->
      <div class="item" v-for="(item,index) in listData" @touchstart="startMove" @touchmove="deleteGoods" @touchend="endMove" :data-index="index" :key="index">
        <div class="con" :style="item.textStyle">
          <div class="left">
            <div class="icon" @click="changeColor(index, item.goods_id)" :class="[ Listids[index] ? 'active' : '',{active:allcheck}]"></div>
            <div class="img">
              <img :src="item.list_pic_url" alt="">
            </div>
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>￥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
              x{{item.number}}
            </div>
          </div>
        </div>

        <div @click="delGoods(item.id,index)" class="delete" :style="item.textStyle1">
          <div>
            删除
          </div>
        </div>
      </div>
    </div>

    <div v-if="false" class="nogoods">
      <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" alt="">
    </div>

    <div class="fixed">
      <div @click="allCheck" :class="{active:allcheck}" class="left">
        全选({{isCheckedNumber}})
      </div>
      <div class="right">
        <div>
          ￥{{allPrise}}
        </div>
        <div @click="orderDown">下单</div>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    get,
    post,
    login,
    getStorageOpenid
  } from "../../utils";
  export default {
    onShow() {
      this.getListData();
    },
    created() {},
    data() {
      return {
        openId: "admin",
        allcheck: false,
        listData: [],
        Listids: [],
        userInfo: {},
        tranX: 0,
        tranX1: 0,
        startX: "",
        startY: "",
        moveX: "",
        moveY: "",
        moveEndX: "",
        moveEndY: "",
        X: 0,
        Y: ""
      };
    },
    components: {},
    methods: {

        initTextStyle() {
        //滑动之前先初始化数据
            for (let i = 0; i < this.listData.length; i++) {
                this.listData[i].textStyle = "";
                this.listData[i].textStyle1 = "";
            }
        },

        startMove(e) {
            this.initTextStyle();
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
        },

        deleteGoods(e) {
            //滑动之前先初始化样式数据
            this.initTextStyle();
            var index = e.currentTarget.dataset.index;
            console.log(index);
            if (this.X <= -100) {
                this.flag = true;
            }
            if (!this.flag) {
                this.moveX = e.touches[0].pageX;
                this.moveY = e.touches[0].pageY;
                this.X = this.moveX - this.startX;
                this.Y = this.moveX - this.startY;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                if (this.X >= 100) {
                this.X = 0;
                }
                this.tranX = this.X;
                if (this.X <= -100) {
                this.X = -100;
                }
                this.tranX1 = this.X;
                this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
            } 
            else {
                this.moveX = e.touches[0].pageX;
                this.moveY = e.touches[0].pageY;
                this.X = this.moveX - this.startX;
                this.Y = this.moveX - this.startY;

                this.tranX = this.X - 100;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                // transform:'translateX(' + tranX + 'rpx)'
                console.log("heyushuo");

                console.log(this.listData[index].textStyle);

                if (this.X + -100 > -100) {
                this.flag = false;
                }
                this.tranX1 = -100;
                this.listData[index].textStyle1 = `transform:translateX(-100rpx);`;
                console.log(this.listData[index].textStyle1);
                
            }
        },

        endMove(e) {
            let index = e.currentTarget.dataset.index;
            if (this.X > -50) {
                this.tranX1 = 0;
                this.tranX = 0;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
            } 
            else if (this.X <= -50) {
                this.tranX1 = -100;
                this.tranX = -100;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
            }
        },

        async orderDown() {
            if (this.Listids.length == 0) {
                wx.showToast({
                title: "请选择商品",
                icon: "none",
                duration: 1500
                });
                return false;
            }
            // 去掉数组中空的false的
            let newgoodsid = [];
            for (let i = 0; i < this.Listids.length; i++) {
                const element = this.Listids[i];
                if (element) {
                newgoodsid.push(element);
                }
            }
            let goodsId = newgoodsid.join(",");
            const data = await post("/order/submitAction", {
                goodsId: goodsId,
                openId: this.openId,
                allPrise: this.allPrise
            });
            if (data) {
                wx.navigateTo({
                url: "/pages/order/main"
                });
            }
        },

        async delGoods(id, index) {
            let _this = this;
            wx.showModal({
                title: "",
                content: "是否要删除该商品",
                success: function (res) {
                if (res.confirm) {

                    _this.Listids.splice(index, 1);
                    const data = get("/cart/deleteAction", {
                    id: id
                    }).then(() => {
                    _this.getListData();
                    });
                } else if (res.cancel) {
                    console.log("用户点击取消");
                    //滑动之前先初始化样式数据
                    _this.initTextStyle();
                }
                }
            })
        },

        async getListData() {
            const data = await get("/cart/cartList", {
                openId: this.openId
            })
            for (let i = 0; i < data.data.length; i++) {
                data.data[i].textStyle = ""
                data.data[i].textStyle1 = ""
            }
            this.listData = data.data
        },

        //商品全选
        allCheck() {
            //先清空
            this.Listids = [];
            if (this.allcheck) {
              this.allcheck = false;
            } 
            else {
                console.log("选择全部");
                this.allcheck = true;
                //循环遍历所有的商品id
                for (let i = 0; i < this.listData.length; i++) {
                    const element = this.listData[i];
                    this.Listids.push(element.goods_id);
                }
            }
        },

        //商品item是否被选中
        changeColor(index, goodsId) {
            //当生成vue实例后，当再次给数据赋值时，有时候并不会自动更新到视图上去
            //vue文档：如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
            //所以要用this.$set
            if (this.Listids[index]) {
                this.$set(this.Listids, index, false);
            } 
            else {
                this.$set(this.Listids, index, goodsId);
            }
        }
    },

    computed: {
      isCheckedNumber() {
        let number = 0;
        for (let i = 0; i < this.Listids.length; i++) {
          if (this.Listids[i]) {
            number++;
          }
        }
        if (number == this.listData.length && number != 0) {
          this.allcheck = true;
        } else {
          this.allcheck = false;
        }
        return number;
      },
      allPrise() {
        var Prise = 0;
        for (let i = 0; i < this.Listids.length; i++) {
          if (this.Listids[i]) {
            Prise = Prise + this.listData[i].retail_price * this.listData[i].number;
          }
        }
        return Prise;
      }
    }
  };

</script>

<style lang='scss' scoped>
 .cart {
  overflow-x: hidden;
  .top {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 20rpx;
    div {
      background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/servicePolicyRed-518d32d74b.png) 0 center no-repeat;
      background-size: 10rpx;
      padding-left: 15rpx;
      display: flex;
      align-items: center;
      font-size: 25rpx;
      color: #666;
    }
  }
  .cartlist {
    background: #fff;
    margin-bottom: 110rpx;
    .item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f4f4f4;
      height: 166rpx;
      position: relative;
      .con {
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 300ms ease;
        .left {
          display: flex;
          align-items: center;
          width: 80%;
          .icon {
            height: 125rpx;
            width: 34rpx;
            background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat center center;
            background-size: 34rpx 34rpx;
            margin: 0 20rpx;
          }
          .icon.active {
            background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat center center;
            background-size: 34rpx 34rpx;
          }
          .img {
            height: 125rpx;
            width: 125rpx;
            display: block;
            background: #f4f4f4;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info {
            width: 50%;
            padding: 20rpx;
            p {
              line-height: 40rpx;
            }
          }
        }
        .right {
          padding-right: 50rpx;
        }
      }
      .delete {
        position: absolute;
        width: 100rpx;
        top: 0;
        right: -100rpx;
        text-align: center;
        height: 100%;
        background: #b4282d;
        color: #fff;
        transition: all 200ms ease;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          color: #fff;
        }
      }
    }
  }
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100rpx;
    line-height: 100rpx;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat;
      background-size: 34rpx 34rpx;
      background-position: 20rpx;
      padding-left: 70rpx;
    }
    .active {
      background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
      background-size: 34rpx 34rpx;
      background-position: 20rpx;
    }
    .right {
      display: flex;
      div:nth-child(1) {
        color: #b4282d;
        padding-right: 40rpx;
      }
      div:nth-child(2) {
        width: 200rpx;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 29rpx;
        background: #b4282d;
        color: #fff;
      }
    }
  }
  .nogoods {
    margin-top: 200rpx;
    img {
      margin: 0 auto;
      display: block;
      width: 258rpx;
      height: 258rpx;
    }
  }
}


</style>
