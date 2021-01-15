<template>
    <div class="order">
        <!-- 收货地址 -->
        <div class="address" v-if="address.name" @click="toAddressList">
            <div class="address-box">
                <div class="name">
                    <span>{{address.name}}</span>
                    <div v-if="address.is_default" class="moren">
                        默认
                    </div>
                </div>
                <div class="info">
                    <p>{{address.mobile}}</p>
                    <p>{{address.address+address.address_detail}}</p>
                </div>
                <div class="icon"></div>
            </div>
        </div>

        <!-- 用户从未设置过地址时，显示这个 -->
        <div @click="addAddress" v-else class="addAddress">
            请选择收货地址
        </div>

        <!-- 商品合计 运费 优惠券 -->
        <div class="content">
            <div class="content-item">
                <div>商品合计</div>
                <div>¥{{allprice}}</div>
            </div>
            <div class="content-item">
                <div>运费</div>
                <div>免运费</div>
            </div>
            <div class="content-item">
                <div>优惠券</div>
                <div>暂无</div>
            </div>
        </div>

        <!-- 订单中的所有商品 -->
        <div class="goodsList">
            <div class="goods-item" v-for="(item,index) in listData" :key="index">
                <div class="left">
                    <div class="img">
                        <img :src="item.list_pic_url" alt="">
                    </div>
                    <div class="info">
                        <div>{{item.goods_name}}</div>
                        <div>￥{{item.retail_price}}</div>
                    </div>
                </div>
                <div class="right">
                    <div class="count">x{{item.number}}</div>
                </div>
            </div>
        </div>

        <!-- 底部支付按钮 -->
        <div class="footer">
            <div>实付：¥ {{allprice}}</div>
            <div class="pay" @click="pay">支付</div>
        </div>
    </div>
</template>

<script>
import { post, get, login } from "../../utils";

export default {
    data () {
        return {
            picurl: "http://yanxuan.nosdn.127.net/18327e601ce72fce5295c3e8a4e5edb8.jpg",
            addressId: "",
            address: {},
            allprice: "",
            openId: "admin",
            listData: []
        }
    },

    onShow() {
        if (wx.getStorageSync("addressId")) {
            this.addressId = wx.getStorageSync("addressId");
        }
        this.getOrderDetail()
    },

    methods: {
        async getOrderDetail(){
            const resData = await get("/order/detailAction", {
                openId: "admin",
                addressId: this.addressId
            })

            if(resData){
                this.allprice = resData.allPrice;
                this.address = resData.address;
                this.listData = resData.goodsList;
            }
        },

        //用户从未设置过地址，前往地址设置页面
        addAddress() {
            wx.navigateTo({
                url: "/pages/addAddress/main"
            });
        },

        //前往地址列表
        toAddressList() {
            wx.navigateTo({
            url: "/pages/addressSelect/main"
            });
        },
    }
}
</script>

<style scoped lang="less">
.order{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    background-color: #f1eded;

    .address{
        // margin-top: 100rpx;
        width: 100%;
        background: url('http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-bg-bd30f2bfeb.png') 0 0 repeat-x #fff;
        background-size: 80rpx 20rpx;
        height: 200rpx;
        background-color: #fff;

        .address-box{
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            padding: 0 20rpx;
            height: 100%;

            .name{
                text-align: center;
                width: 120rpx;
                box-sizing: border-box;
                padding: 0 25rpx;
                height: 120rpx;

                span {
                    font-size: 28rpx;
                }

                div{
                    margin-top: 10rpx;
                    font-size: 28rpx;
                    border: 1rpx solid rgb(160, 37, 37);
                    color: rgb(160, 37, 37);
                    padding: 1rpx 3rpx;
                    line-height: 36rpx;
                }
            }

            .info{
                flex:1;
                height: 120rpx;

                .tel {
                    font-size: 30rpx;
                }
                .address-desc {
                    margin-top: 5rpx;
                    font-size: 30rpx;
                }
            }

            .icon {
                width: 60rpx;
                height: 60rpx;
                margin-left: 20rpx;
                background: url('http://yanxuan-static.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-right-596d39df1e.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }

    .addAddress {
        width: 100%;
        min-height: 166rpx;
        background: url('http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-bg-bd30f2bfeb.png') 0 0 repeat-x #fff;
        background-size: 62rpx 10rpx;
        margin-bottom: 20rpx;
        padding-top: 10rpx;
        text-align: center;
        line-height: 166rpx;
    }

    .content{
        width: 100%;
        background-color: #fff;
        margin-top: 26rpx;

        .content-item{
            border-bottom: 1rpx solid rgb(190, 189, 189);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 20rpx;

            div{
                font-size: 30rpx;
                padding: 30rpx 0;
            }
        }
    }

    .goodsList{
        position: absolute;
        top: 530rpx;
        bottom: 90rpx;
         width: 100%;
        background-color: #fff;
        
        .goods-item{
            display: flex;
            align-items: center;
            margin-top: 12rpx;
            margin-left: 12rpx;
            margin-right: 12rpx;
            .left{
                display: flex;
                flex: 1;
                height: 140rpx;
                align-items: center;

                .img {
                    width: 140rpx;
                    height: 140rpx;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .info {
                    font-size: 30rpx;
                    flex: 1;

                    div:nth-child(2) {
                        margin-top: 10rpx;
                        color: rgb(199, 39, 39);
                    }
                }
            }

            .right{
                width: 50rpx;
                font-size: 30rpx;
                text-align: center;
                padding: 0 20rpx;
            }
        }
        
    }

    .footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 90rpx;
        background-color: #fff;
        display: flex;

        div:nth-child(1) {
            font-size: 32rpx;
            flex: 1;
            line-height: 90rpx;
            padding-left: 50rpx;
        }

        .pay {
            text-align: center;
            line-height: 90rpx;
            font-size: 32rpx;
            background-color: rgb(170, 45, 45);
            width: 200rpx;
            color: #fff;
        }
    }

}

</style>
