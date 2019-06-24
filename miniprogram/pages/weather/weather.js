let util = require('../../utils/util')
let globalData = getApp().globalData
const key = globalData.key
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',//搜索框
    hasPopped: false,//按钮是否弹出
    animationMain: {},
    animationOne: {},
    animationTwo: {},
    animationThree: {},
    cityDatas: {},//天气状况
    hourlyDatas: [],//每3小时天气状况
    weatherIconUrl: globalData.weatherIconUrl,//icon图标
    openSettingButtonShow: false,
    searchCity: '',// 需要查询的城市
    located: true,//是否切换了城市
    bcgImgList: [//背景图
      {
        src: '/img/beach-bird-birds-235787.jpg',
        topColor: '#393836'
      },
      {
        src: '/img/clouds-forest-idyllic-417102.jpg',
        topColor: '#0085e5'
      },
      {
        src: '/img/backlit-dawn-dusk-327466.jpg',
        topColor: '#2d2225'
      },
      {
        src: '/img/accomplishment-adventure-clear-sky-585825.jpg',
        topColor: '#004a89'
      },
      {
        src: '/img/fog-himalayas-landscape-38326.jpg',
        topColor: '#b8bab9'
      },
      {
        src: '/img/asphalt-blue-sky-clouds-490411.jpg',
        topColor: '#009ffe'
      },
      {
        src: '/img/aerial-climate-cold-296559.jpg',
        topColor: '#d6d1e6'
      },
      {
        src: '/img/beautiful-cold-dawn-547115.jpg',
        topColor: '#ffa5bc'
      }
    ],
    detailsDic: {//温度相关的内容
      key: ['tmp', 'fl', 'hum', 'pcpn', 'wind_dir', 'wind_deg', 'wind_sc', 'wind_spd', 'vis', 'pres', 'cloud', ''],
      val: {
        tmp: '温度(℃)',
        fl: '体感温度(℃)',
        hum: '相对湿度(%)',
        pcpn: '降水量(mm)',
        wind_dir: '风向',
        wind_deg: '风向角度(deg)',
        wind_sc: '风力(级)',
        wind_spd: '风速(mk/h)',
        vis: '能见度(km)',
        pres: '气压(mb)',
        cloud: '云量',
      },
    },
    lifestyles: {//生活指数相关的内容
      'comf': '舒适度指数',
      'cw': '洗车指数',
      'drsg': '穿衣指数',
      'flu': '感冒指数',
      'sport': '运动指数',
      'trav': '旅游指数',
      'uv': '紫外线指数',
      'air': '空气污染扩散条件指数',
      'ac': '空调开启指数',
      'ag': '过敏指数',
      'gl': '太阳镜指数',
      'mu': '化妆指数',
      'airc': '晾晒指数',
      'ptfc': '交通指数',
      'fsh': '钓鱼指数',
      'spi': '防晒指数',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reloadPage()
  },
  onshow(){
    this.reloadPage()
  },
  // 下拉
  onPullDownRefresh(res) {
    wx.showLoading({
      title: '加载中',
    })
    let _this = this
    setTimeout(function () {
      wx.hideLoading({
        success: () => {
          _this.reloadPage()
        }
      })
    }, 1500)

  },
  reloadPage() {
    this.getCityDatas()
    this.reloadWeather()
    this.getBcg()
  },
  //查询天气状况
  search(val, callback) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
    if (val) {
      this.setData({
        located: false
      })
      this.getWeather(val)
      this.getHourly(val)
    }
    callback && callback()
  },
  reloadWeather() {
    if (this.data.located) {
      this.init({})
    } else {
      this.search(this.data.searchCity)
      this.setData({
        searchCity: ''
      })
    }
  },
  init() {
    this.setData({
      located: true
    })
    wx.getLocation({
      success: res => {
        this.getWeather(`${res.latitude},${res.longitude}`)
        this.getHourly(`${res.latitude},${res.longitude}`)
      },
      fail: res => {
        this.fail(res)
      }
    })
  },
  toCitychoose() {
    wx.navigateTo({
      url: '/pages/citychoose/citychoose',
    })
  },
  // 悬浮按钮
  menuMain(e) {
    if (!this.data.hasPopped) {
      this.popup()
      this.setData({
        hasPopped: true
      })
    } else {
      this.popout()
      this.setData({
        hasPopped: false
      })
    }

  },
  menuHide() {
    if (this.data.hasPopped) {
      this.popout()
      this.setData({
        hasPopped: false
      })
    }
  },
  popup() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(180).step()
    animationOne.translate(-Math.sqrt(3600 - 400), 30).rotateZ(360).opacity(1).step()
    animationTwo.translate(-Math.sqrt(3600 - 400), -30).rotateZ(360).opacity(1).step()
    animationThree.translate(0, -60).rotateZ(360).opacity(1).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },
  popout() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(0).step()
    animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
    animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
    animationThree.translate(0, 0).rotateZ(0).opacity(0).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },
  location() {
    this.menuMain()
    wx.navigateTo({
      url: '/pages/citychoose/citychoose',
    })
  },
  menuToSetting() {
    this.menuMain()
    wx.navigateTo({
      url: '/pages/selectBg/selectBg',
    })
  },
  // 搜索
  commitSearch(e) {
    let val = ((e.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  },
  //清除搜索框内容
  clearInput() {
    this.setData({
      searchText: '',
    })
  },
  //定位
  getCityDatas() {
    let cityDatas = wx.getStorage({
      key: 'cityDatas',
      success: (res) => {
        this.setData({
          cityDatas: res.data,
        })
      },
    })
  },
  success(data, location) {
    this.setData({
      openSettingButtonShow: false,
      searchCity: location
    })
    wx.stopPullDownRefresh()
    let now = new Date()
    data.updateTime = now.getTime()
    data.updateTimeFormat = util.formatDate(now, "MM-dd hh:mm")
    wx.setStorage({
      key: 'cityDatas',
      data,
    })
    this.setData({
      cityDatas: data
    })
  },
  fail(res) {
    wx.stopPullDownRefresh()
    let errMsg = res.errMsg || ''
    if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
      wx.showToast({
        title: '需要开启地理位置',
        icon: 'none',
        duration: 2000,
        success: res => {
          if (this.canUseOpenSettingApi()) {
            let timer = setTimeout(() => {
              clearTimeout(timer)
              wx.openSetting({})
            }, 2000)
          } else {
            this.setData({
              openSettingButtonShow: true
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '网络不给力，请稍后再试',
        icon: 'none',
      })
    }
  },
  canUseOpenSettingApi() {
    let systeminfo = getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = util.cmpVersion(SDKVersion, '2.0.7')
    if (version < 0) {
      return true
    } else {
      return false
    }
  },
  // 天气
  getWeather(location) {
    wx.request({
      url: `${globalData.requestUrl.weather}`,
      data: {
        location,
        key
      },
      success: (res) => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0]
          if (data.status === 'ok') {
            this.clearInput()
            this.success(data, location)
          } else {
            wx.showToast({
              title: '查询失败',
              icon: 'none',
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      },
    })
  },
  // 每3小时
  getHourly(location) {
    wx.request({
      url: `${globalData.requestUrl.hourly}`,
      data: {
        location,
        key
      },
      success: (res) => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0]
          if (data.status === 'ok') {
            this.setData({
              hourlyDatas: data.hourly || []
            })
          } else {
            wx.showToast({
              title: '查询失败',
              icon: 'none',
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      },
    })
  },
  getBcg(){
    let _this=this
    wx.getStorage({
      key: 'bcgImgSrc',
      success: function(res) {
        if(res.data){
          _this.setData({
            bcgSrc: res.data
          })
        }
      },
      fail:function(){
        _this.setData({
          bcgSrc:'../../img/beach-bird-birds-235787.jpg'
        })
      }
    })
  }

})