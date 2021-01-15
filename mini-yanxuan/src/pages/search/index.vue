<template>
  <div class="search">
        <!-- 搜索栏 -->
        <div class="head">
            <div>
                <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
                <input type="text" confirm-type="search" focus="true" v-model="words" @focus="inputFocus" @input="tipsearch" @confirm="searchWords" placeholder="商品搜索">
                <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
            </div>
            <div @click="cancel">取消</div>
        </div>
        <!-- 搜索关键词联想 -->
        <div class="search-tip" v-if="words">
            <div v-if="tipsData.length!=0" v-for="(item, index) in tipsData" :key="index" @click="searchWords"  :data-keywords="item.name">
                {{item.name}}
            </div>
            <div class="nogoods" v-if="tipsData.length==0">
                数据库暂无此类商品...
            </div>
        </div>
        <!-- 搜索历史纪录 -->
        <div class="history" v-if="historyData.length!=0">
            <div class="t">
                <div>历史记录</div>
                <div @click="clearHistory"></div>
            </div>
            <div class="cont" @click="searchWords" >
                <div v-for="(item, index) in  historyData" :key="index" :data-keywords="item.keyword">
                    {{item.keyword}}
                </div>
            </div>
        </div>
        <!-- 热门搜索 -->
        <div class="history hotsearch">
             <div class="t">
                <div>热门搜索</div>
            </div>
            <div class="cont">
                <div @click="searchWords" v-for="(item,index) in hotData" :key="index" :class="{active:index==0}"  :data-keywords="item.keyword">
                    {{item.keyword}}
                </div>
            </div>
        </div>
        <!-- 商品列表 -->
        <div v-if="listData.length!=0" class="goodsList">
            <div class="nav">
                <!-- <div :class="0 === navIndex ? 'active' : ''" @click="swicthNav(0)">综合</div>
                <div :class="[1 === navIndex ? 'active' : '', priceSort]" @click="swicthNav(1)">价格</div> -->
                <div >综合</div>
                <div >价格</div>
                <div >分类</div>
            </div>
            <div class="sortlist">
                <div v-for="(item, index) in listData" :key="index" class="goods-item" @click="toGoodsDetail(item.id)">
                    <img :src="item.list_pic_url" alt="">
                    <p class="name">{{item.name}}</p>
                    <p class="price">￥{{item.retail_price}}</p>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import { post, get } from "../../utils";

export default {
    data () {
        return {
            openId: "admin",
            words: '',
            openid: '',
            historyData: [],
            hotData: [],
            tipsData: [],
            listData: [],
        }
    },

    mounted(){
        this.openId = wx.getStorageSync('openod') || 'admin';
        this.getHotData();
    },

    methods: {
        //input框聚焦
        inputFocus(){
            this.tipsearch();
        },

        //展示搜索提示信息
        async tipsearch(){
            let str = this.words.replace(/^\s*|\s*$/g,"")//去除字符串头、尾的space
            const resData = await get("/search/helperaction", {
                keyword: str
            })
            this.tipsData = resData.goodsList;
        },

        //搜索
        async searchWords(e){ //e为事件对象
            console.log(e.target.dataset.keywords)
            const resData = await post("/search/addhistoryaction", {
                openId: this.openId,
                keyword: e.target.dataset.keywords || this.words
            })
            //获取历史数据
            this.getHotData();
            //获取商品列表
            this.getlistData(e.target.dataset.keywords || this.words);
            this.words = ''
        },

        //获取历史数据
        async getHotData(){
            const resData = await get("/search/indexaction?openId=" + this.openId)
            this.hotData = resData.hotKeywordList;
            this.historyData = resData.historyData;
        },

        //获取商品列表
        async getlistData(userInputKeyword){
            const resData = await get("/search/helperaction", {
                keyword: userInputKeyword,
                order: this.order
            })
            this.listData = resData.goodsList;
        },

        //取消搜索，返回上一级页面
        cancel(){
            wx.navigateBack({
                delta: 1
            });
        },

        //清空搜索
        clearInput(){
            this.words = "";
            this.tipsData = [];
            this.listData = [];
        },

        //清空历史记录
        async clearHistory(){
            const resData = await post("/search/clearhistoryAction", {
                openId: this.openId
            })
            if(resData){
                console.log(resData)
                this.historyData = []
            }
        },

        //去往商品详情页
        toGoodsDetail(id){
            console.log(id)
            wx.navigateTo({
                url: "/pages/goods/main?id=" + id
            })
        }
    }
}
</script>

<style scoped lang="less">
.search{
    height: 100%;
    position: relative;

    .head {
        height: 91rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        background: #fff;

        div:nth-child(1){
            height: 59rpx;
            display: flex;
            align-items: center;
            background: #f4f4f4;
            margin-left: 20rpx;
            img {
                display: inline-block;
                
                width: 31rpx;
                height: 31rpx;
                padding: 0 20rpx;
            }

            input {
                display: inline-block;
                width: 480rpx;
                height: 59rpx;
                margin-left: 10rpx;
            }
        }

        div:nth-child(2) {
            flex: 1;
            text-align: center;
        }
    }

    .search-tip{
        position: absolute;
        left: 0;
        top: 91rpx;
        background-color: #fff;
        z-index: 11;
        width: 100%;
        box-sizing: border-box;
        padding: 0 24rpx;
        div{
            height: 60rpx;
            padding: 0 12rpx;
            color: #888888;
            line-height: 60rpx;
            border-bottom: 1px solid rgba(136,136,136, .2);
        }

        .nogoods{
            color: #b4282d;
        }
    }

    .history{
        background: #fff;
        padding: 32rpx;
        margin-bottom: 30rpx;
        .t{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30rpx;

            div:nth-child(2){
                width: 55rpx;
                height: 55rpx;
                background: url("http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/del1-93f0a4add4.png") no-repeat;
                background-size: 100% 100%;
            }
        }

        .cont{
            display: flex;
            flex-wrap: wrap;

            div{
                padding: 10rpx 10rpx;
                border: 1rpx solid #999;
                margin: 0 30rpx 20rpx 0;
            }

            .active {
                border: 1rpx solid #b4282d;
                color: #b4282d;
            }
        }
    }

    .goodsList{
        width: 100%;
        position: absolute;
        top: 85rpx;
        bottom: 0;
        background-color: rgb(247, 247, 247);
         z-index: 10;

        .nav {
            width: 100%;
            display: flex;
            background-color: #fff;
            position: absolute;
            height: 80rpx;

            div {
                flex: 1;
                text-align: center;
                font-size: 32rpx;
                line-height: 80rpx;
            }

            div:nth-child(2) {
                background: url(//yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/no-3127092a69.png) 230rpx no-repeat;
                background-size: 15rpx 21rpx;
            }
        }

        .sortlist{
            width: 100%;
            position: absolute;
            top: 90rpx;
            bottom: 0;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: flex-start;

            .goods-item{
                width: 373rpx;
                height: 430rpx;
                background-color: #fff;
                margin-bottom: 4px;

                img{
                    width: 80%;
                    height: 70%;
                    margin-left: 30rpx;
                }

                .name {
                    text-align: center;
                    font-size: 32rpx;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .price {
                    text-align: center;
                    font-size: 30rpx;
                    padding: 16rpx 0;
                    color: rgb(240, 113, 113);
                }
            }
        }
    }
}

</style>
