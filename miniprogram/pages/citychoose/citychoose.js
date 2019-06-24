let cityData=require('../../data/staticData.js')
let util=require('../../utils/util.js')

Page({
  data: {
    cities: [],
    showItems: null,//城市数据
    hotCities: [],//猜你想找
    inputText:'',//输入框内容
    alternative: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotCities()
    let cities = this.getSortedAreaObj(cityData.cities || [])
    this.setData({
      cities,
      showItems: cities
    })
  },
  // 按照字母顺序生成需要的数据格式
  getSortedAreaObj(areas) {
    // let areas = staticData.areas
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj
  },
  //选择城市
  chooseCity(e){
    let name=e.target.dataset.name
    let pages = getCurrentPages()
    let len = pages.length
    let indexPage = pages[len - 2]
    if (name) {
      indexPage.search(name, () => {
        wx.navigateBack({})
      })
    } else {
      indexPage.init()
      wx.navigateBack({})
    }
  },
  //猜你想找
  getHotCities(callback){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'getHotCities',
      data: {},
    }).then(res => {
      let data = res.result.data
      if (data) {
        this.setData({
          hotCities: data
        })
        wx.hideLoading()
      }
    })
  },
  //清空
  cancel(){
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },
  inputFilter(e){
    let alternative={}
    let cities=this.data.cities
    let value=e.detail.value.replace(/\s+/g,'')
    if(value.length){
      for(let i in cities){
        let items=cities[i]
        for(let j=0,len=items.length;j<len;j++){
          let item=items[j]
          if(item.name.indexOf(value)!==-1){
            if (util.isEmptyObject(alternative[i])){
              alternative[i]=[]
            }
            alternative[i].push(item)
          }
        }
      }
      if(util.isEmptyObject(alternative)){
        alternative=null
      }
      this.setData({
        alternative,
        showItems:alternative
      })
    }else{
      this.setData({
        alternative:null,
        showItems:cities
      })
    }
  }

  
})