let globalData = getApp().globalData
const key = globalData.cookKey
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    id:'',
    albums:'',
    title:'',
    imtro:'',
    steps:[],
    ingredients:[],
    burden:[],
    peoplenum:'',
    preparetime:'',
    cookingtime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let _this = this
    // 动态设置标题栏
    wx.setNavigationBarTitle({
      title: options.name
    })
    _this.setData({
      id: options.id
    })
    _this.getList(_this.data.id)
    
  },
  getList(id) {
    let _this = this
    wx.request({
      url: `${globalData.requestUrl.queryid}`,
      data: {
        id,
        appkey:key
      },
      success: (res) => {
          let data = res.data
        if (data.status == 0) {
            let goods = data.result
            _this.setData({
              goods:goods,
              albums: goods.pic,
              title: goods.name,
              imtro: goods.content,
              steps: goods.process,
              ingredients: goods.material,
              peoplenum: goods.peoplenum,
              preparetime: goods.preparetime,
              cookingtime: goods.cookingtime
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
  
})