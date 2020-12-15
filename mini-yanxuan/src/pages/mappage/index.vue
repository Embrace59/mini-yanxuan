<template>
    <div class="mappage">
        <div class="section">
            <input placeholder="搜索" v-model="keywords" focus="true" @input="bindInput">
        </div>
        <scroll-view :scroll-y="true" style="height: 500rpx;" class="addcont">
            <div class="result" v-for="(item, index) in tips" :key="index" @touchstart="bindSearch(item.name)">
                {{item.name}}
            </div>
        </scroll-view>
        <div class="map_container">
            <div class="title">显示当前位置:</div>
            <map class="map" id="map" scale="16" :longitude="longitude" :latitude="latitude" :markers="markers"></map>
        </div>
    </div>

</template>

<script>

import amapFile from "../../utils/amap-wx";

export default {
    name: "MapPage",
    data () {
        return {
            tips:[],
            longitude: "",
            latitude: "",
            keywords: "",
            markers: []
        }
    },
    mounted() {
        this.getMapaddress();
    },

    methods: {
        //在.map-container.<map>下显示地图
        getMapaddress(){
            let _this = this;
            let myAmapFun = new amapFile.AMapWX({key:'abe0866dd616029979d49b0022570d60'});
            myAmapFun.getRegeo({
                iconPath: "/static/images/marker.png",
                iconWidth: 22,
                iconHeight: 32,
                success: function(data){
                    let marker = [{
                        id: data[0].id,
                        latitude: data[0].latitude,
                        longitude: data[0].longitude,
                        iconPath: data[0].iconPath,
                        width: data[0].width,
                        height: data[0].height
                    }];
                    _this.markers = marker;
                    _this.latitude = data[0].latitude;
                    _this.longitude = data[0].longitude;
                },
            });
        },
        //输入框输入关键字keywords，使用高德.getInputtips，自动显示“关键字的联想词”
        bindInput(){
            let _this = this;
            let kw = _this.keywords;
            let myAmapFun = new amapFile.AMapWX({key: "abe0866dd616029979d49b0022570d60"});
            myAmapFun.getInputtips({
                keywords: kw,
                location: "",
                success: function(data){
                    console.log(data)
                    if(data && data.tips){
                        _this.tips = data.tips
                    }
                }
            });
        },
        //触摸“关键字的联想词”，触发touchstart事件，
        bindSearch(cityname){
            console.log(cityname);
            wx.navigateBack({//返回上级页面
                 delta: 1 //delta等于n，就返回上n级页面，直立式返回上一级页面，即首页
            });
        }
    }
}
</script>

<style scoped lang="less">
.mappage{
    height: 100%;
    background: #fff;
    position: relative;
    .section{
        height: 30px;
        width: 100%;
        input{
            width: 90%;
            height: 30px;
            margin: 0 auto;
            border: 1px solid #c3c3c3;
            border-radius: 3px;
            padding: 0 5px;
        }
    }

    .result {
        width: 40%;
        // margin: 0 auto;
        padding: 20rpx 0 20rpx 30rpx;
    }

    .map_container{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        .title{
            font-size: 34rpx;
            font-weight: bold;
            padding: 20rpx;
        }
        .map {
            width: 100%;
            height: 500rpx;
        }
    }
}
</style>
