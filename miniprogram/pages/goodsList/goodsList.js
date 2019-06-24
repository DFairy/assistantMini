let globalData = getApp().globalData
const key = globalData.cookKey
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    goodsList:[],
    id:1,
    pn:0,
    rn:10,
    name:'',
    startX:'',//起始位置的x坐标
    width:130,//收藏的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    let _this=this
    // 动态设置标题栏
    wx.setNavigationBarTitle({
      title: options.name
    })
    _this.setData({
      id: options.id,
      name: options.name
    })
    _this.getCollect()
    
  },
  getCollect() {
    let _this = this
    if (_this.data.name=='我的收藏'){
      wx.cloud.callFunction({
        name: 'getMenu',
        data: {}
      }).then(res => {
        let goodsList=[]
        res.result.data.forEach(item=>{
          if(item.collected){
            goodsList.push(item)
          }
        })
        _this.setData({
          list: goodsList
        })
      })
    }else{
      _this.getList(_this.data.id)
    }
  },
  getList(id) {
    wx.showLoading({
      title: '',
    })
    let _this=this
    let pn = _this.data.pn
    let rn = _this.data.rn
    wx.request({
      url: `${globalData.requestUrl.index}`,
      data: {
        classid:id,
        appkey:key,
        start:pn,
        num:rn
      },
      success: (res) => {
        let data = res.data
        if (data.status == 0) {
            wx.cloud.callFunction({
              name: 'getMenu',
              data: {}
            }).then(res => {
              pn += 10
              rn += 10
              this.setData({
                pn: pn,
                rn: rn
              })
              let list = _this.data.list
              let collected = null
              data.result.list.forEach(item => {
                item.collected = false
                res.result.data.forEach(val=>{
                  if(val.id==item.id && val.collected){
                    item.collected=true
                  }
                })
                list.push(item)
              })
              _this.setData({
                list: list
              })
              wx.hideLoading()
            })
        } else if (data.status == 205){
            wx.showToast({
              title: '已经到底啦',
              icon: 'none',
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
  //触底加载
  onReachBottom: function () {
    let _this=this
    _this.getCollect()
  },
  skipUrl(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `../goodsDetail/goodsDetail?id=${id}&name=${name}`
    })
  },
  //左滑
  touchS(e){
    let _this=this
    if(e.touches.length==1){
      _this.setData({
        startX: e.touches[0].clientX
      })
    }
  },
  touchM(e) {
    let _this=this
    if (e.touches.length == 1){
      //记录触摸点的x位置
      let movex = e.touches[0].clientX
      //计算手指触摸与当前触摸的差值
      let value = _this.data.startX - movex
      //宽度
      let style=''
      let width=_this.data.width
      if (value<=0){
        style='left:0rpx'
      }else{
        style=`left:-${value}rpx`
        // if (value >= width){
        //   style = `left:-${width}rpx`
        // }
      }
      //获取手指的index
      let index = e.currentTarget.dataset.index;
      let list=_this.data.list
      list[index].txtStyle = style
      _this.setData({
        list:list
      })
    
    }
  },
  touchE(e) {
    let _this=this
    if (e.changedTouches.length==1){
      let endX = e.changedTouches[0].clientX
      // 触摸开始与结束，手指移动的距离
      let value = _this.data.startX - endX;
      let width = _this.data.width
      let style = value > width / 2 ? `left:-${width}rpx` : `left:0rpx`;
      let index = e.currentTarget.dataset.index;
      let list = _this.data.list
      list[index].txtStyle = style
      _this.setData({
        list: list
      })
    }
  },
  //收藏
  collect(e){
    let dataset = e.currentTarget.dataset
    let _this=this
    let list = _this.data.list
    let index = dataset.index
    if (dataset.collected){
      wx.cloud.callFunction({
        name: 'changeMenu',
        data: {
          id: dataset.id,
          collected: !dataset.collected
        },
      }).then(data => {
        list[index].collected = !dataset.collected
        _this.setData({
          list: list
        })
        _this.getCollect()
      })
    }else{
      wx.cloud.callFunction({
        name: 'addMenu',
        data: {
          id: dataset.id,
          content: dataset.content,
          name: dataset.name,
          img: dataset.img,
          length: dataset.process.length,
          collected: !dataset.collected
        },
      }).then(data => {
        list[index].collected = !dataset.collected
        _this.setData({
          list: list
        })
      })
    }

  },
  

})