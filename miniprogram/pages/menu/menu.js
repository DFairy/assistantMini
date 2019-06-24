let globalData = getApp().globalData
const key = globalData.cookKey
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    classifySeleted: 10001,
    typeIndex: 10001
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCook()
  },
  select(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      classifySeleted: id,
      typeIndex: id
    })
  },
  onGoodsScroll(e) {
    let _this = this
    let scrollTop = e.detail.scrollTop
    let h = 0;
    let classifySeleted
    _this.data.goods.forEach((item, index) => {
      let _h = 57 + 32 * _this.length(item['classid'])
      // console.log('scrollTop:'+scrollTop)
      // console.log('h:'+h)
      if (scrollTop >= h) {
        classifySeleted = item.classid
      }
      h += _h
    })
    _this.setData({
      classifySeleted: classifySeleted
    })
  },
  length(e) {
    let _this = this
    let goods = _this.data.goods
    for (let i = 0; i < goods.length; i++) {
      if (goods[i]['classid'] == e) {
        if (goods[i]['list'].length % 2 == 0) {
          return goods[i]['list'].length / 2
        } else {
          return Math.ceil(goods[i]['list'].length / 2)
        }
      }
    }
  },
  //获取数据
  getCook() {
    wx.request({
      url: `${globalData.requestUrl.category}`,
      data: { appkey: key },
      success: (res) => {
        let data = res.data
        if (data.status == 0) {
          this.setData({
            goods: data.result
          })
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none',
          })
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
  skipUrl(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `../goodsList/goodsList?id=${id}&name=${name}`
    })
  },
  search() {
    wx.navigateTo({
      url: `../searchMenu/searchMenu`
    })
  }
})