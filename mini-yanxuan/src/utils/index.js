//官方创建的，用来格式化时间
function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

//>>>>>>>>>>>>>> https请求的封装 >>>>>>>>>>>>>>>
const host = "http://localhost:5959/lm"
export { host };

function request(url, method, data, header = {}) {
  wx.showLoading({
    title: "加载中" //数据请求前loading
  });
  return new Promise((resolve, reject) => {
    //wx.request()是官方提供的，发起 HTTPS 网络请求的api
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: {
        "content-type": "application/json" // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        resolve(res.data);
      },
      fail: function (error) {
        wx.hideLoading();
        reject(false);
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  });
}
export function get(url, data) {
  return request(url, "GET", data);
}
export function post(url, data) {
  return request(url, "POST", data);
}

export function toLogin() {
  const userInfo = {
    openId: "oQmbb4sNZdxaUQZ0sfYgvtOP2S7c",
    nickName: "Embrace",
    gender: 1,
    language: "zh_CN",
    city: "Changping",
    province: "Beijing",
    country: "China",
    avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIbWFEIJj8IpGeHM7dGic1aTFZALjWcMm9ltWfFiaQfVRYticWBfgGfzXWMt2EkJWiaicPtftHAlWxUibxQ/132",
    watermark: { timestamp: 1535513485, appid: "wx601ce71bde7b9add" }
  }

  if (!userInfo) {
    wx.navigateTo({
      url: "/pages/login/main"
    });
  } else {
    return true;
  }
}

export function login() {
  const userInfo = {
    openId: "oQmbb4sNZdxaUQZ0sfYgvtOP2S7c",
    nickName: "Embrace",
    gender: 1,
    language: "zh_CN",
    city: "Changping",
    province: "Beijing",
    country: "China",
    avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIbWFEIJj8IpGeHM7dGic1aTFZALjWcMm9ltWfFiaQfVRYticWBfgGfzXWMt2EkJWiaicPtftHAlWxUibxQ/132",
    watermark: { timestamp: 1535513485, appid: "wx601ce71bde7b9add" }
  };
  if (userInfo) {
    return userInfo;
  }
}


// import Vue from 'vue'
// import axios from 'axios'

// // axios 配置
// axios.defaults.timeout = 10000  // 限制最长请求时间
// axios.defaults.baseURL = 'http://localhost:5959/lm'  // 基础API地址

// // 判断返回状态,响应拦截
// axios.interceptors.response.use((res) => {
//   if (res.status !== 200) {
//     console.log('网络异常')
//     return Promise.reject(res)
//   }
//   return res
// }, (error) => {
//   console.log('网络异常')
//   return Promise.reject(error)
// })

// export function get(url, params) {
//   return new Promise((resolve, reject) => {
//     axios.get(url, { params })
//       .then(res => {
//         resolve(res.data);
//       }).catch(err => {
//         reject(err.data)
//       })
//   })
// }

// export function post(url, params) {
//   return new Promise((resolve, reject) => {
//     axios.post(url, params)
//       .then(res => {
//         resolve(res.data);
//       })
//       .catch(err => {
//         reject(err.data)
//       })
//   });
// }

export default {
  formatNumber,
  formatTime
}

