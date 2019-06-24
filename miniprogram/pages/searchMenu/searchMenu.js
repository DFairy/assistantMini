
let globalData = getApp().globalData
const key = globalData.cookKey
Page({
  data: {
    inputText: '',//输入框内容
    list:null,
    historyValue:[],
    common:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage()
  },
  //清空
  cancel() {
    this.setData({
      inputText: '',
      list:null
    })
    this.getStorage()
  },
  getStorage(){
    let _this=this
    wx.getStorage({
      key: 'historyValue',
      success: function (res) {
        _this.setData({
          historyValue:res.data
        })
      },
    })
  },
  delItem(){
    let _this=this
    wx.showModal({
      title: '提示',
      content: '确认要清除',
      cancelText: '取消',
      confirmColor: '#EFB82A',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'historyValue',
            success(res) {
              _this.setData({
                historyValue:[]
              })
            }
          })
        }
      },
    })
  },
  search(e){
    let _this=this
    let name = e.currentTarget.dataset.name
    _this.getList(name)
    _this.setData({
      inputText: name
    })
  },
  inputFilter(e) {
    let value = e.detail.value.replace(/\s+/g, '')
    let _this=this
    if (value.length) {
      _this.getList(value)
      _this.setData({
        inputText:value
      })
      _this.setStorage()
    } else {
      _this.cancel()
    }
  },
  getList(menu) {
    let _this = this
    wx.request({
      url: `${globalData.requestUrl.query}`,
      data: {
        keyword:menu,
        appkey:key,
        num:30
      },
      success: (res) => {
        console.log(res)
          let data = res.data
        if (data.status == 0) {
            _this.setData({
              list: data.result.list
            })

        } else if (data.status == 205){
            wx.showToast({
              title: 'sorry,查找不到这个菜谱',
              icon: 'none',
            })
          } else if (res.data.error_code == 204605) {
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
  skipUrl(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `../goodsDetail/goodsDetail?id=${id}&name=${name}`
    })
  },
  setStorage(){
    let _this=this
    let historyValue = _this.data.historyValue
    let inputText = _this.data.inputText
    if (historyValue.length == 0){
      historyValue.unshift(inputText)
    }else{
      
     historyValue.forEach(item=>{
        if (inputText==item){
          _this.setData({
            common: item
          })
        }
      })
      if(_this.data.common){
       return false
      }else{
        historyValue.unshift(inputText)
      }

    }
    
    _this.setData({
      historyValue: historyValue
    })
    wx.setStorage({
      key: 'historyValue',
      data: historyValue,
    })
  }
})