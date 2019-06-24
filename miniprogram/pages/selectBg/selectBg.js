// miniprogram/pages/selectBg/selectBg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bcgImgList:[],
    bcgImgSrc: '',
  },
  onLoad(){
    this.getBcg()
  },
  getBcg(callback) {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'getBcg',
      data: {},
    }).then(res => {
      let data = res.result.data
      if (data) {
        this.setData({
          bcgImgList: data
        })
        wx.hideLoading()
      }
    })
  },
  //上传图片
  upload(){
    let _this=this
    const name = 'dfairy' + (new Date()).getTime() + Math.ceil((Math.random() + 1)) + '.png'
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '上传中。。。',
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        // console.log(name)
        wx.cloud.uploadFile({
          cloudPath: name,
          filePath: tempFilePaths[0],
          success(res) {
            //上传成功后会返回永久地址
            wx.hideLoading()
            wx.showToast({
              title: '上传图片成功',
            })
            if (res.fileID){
              wx.cloud.callFunction({
                name: 'addBcg',
                data: {
                  url:res.fileID
                },
              }).then(data => {
                _this.getBcg()
              })
            }
          }
        })
      }
    })
  },
  chooseBcg(e){
    let dataset = e.currentTarget.dataset
    let src=dataset.src
    wx.setStorage({
      key: 'bcgImgSrc',
      data: src,
    })
    //返回并刷新页面
    let pages = getCurrentPages()
    let len = pages.length
    let indexPage = pages[len - 2]
    indexPage.getBcg()
    wx.navigateBack({})
  },
})