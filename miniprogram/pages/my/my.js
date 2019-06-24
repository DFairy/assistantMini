// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getsysteminfo(){
    wx.navigateTo({
      url: '/pages/systemInfo/systemInfo',
    })
  },
  about(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  myCollect(){
    wx.navigateTo({
      url: '/pages/goodsList/goodsList?name=我的收藏&id=0',
    })
  },
  clearStorage(){
    wx.showModal({
      title: '提示',
      content: '确认要清除',
      cancelText: '取消',
      confirmColor: '#EFB82A',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '',
          })
          wx.clearStorage({
            success: (res) => {
              wx.showToast({
                title: '数据已清除',
              })
              wx.hideLoading()
            },
          })
        }
      },
    })
  }
})