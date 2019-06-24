import Touches from './utils/Touches.js'
App({
    onLaunch() {

        // if (!wx.cloud) {
        //   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        // } else {
        wx.cloud.init({
            traceUser: true, //追踪用户信息
            env: ''
        })
        wx.getSystemInfo({ //获取设备信息
                success: (res) => {
                    this.globalData.systeminfo = res
                },
            })
            // }
    },
    globalData: {
        systeminfo: {},
        key: '', //和风天气key
        cookKey: '', //菜谱key
        weatherIconUrl: 'https://cdn.heweather.com/cond_icon/',
        requestUrl: {
            weather: 'https://free-api.heweather.com/s6/weather',
            hourly: 'https://free-api.heweather.com/s6/weather/hourly',
            category: 'https://api.jisuapi.com/recipe/class', //分类标签列表
            index: 'https://api.jisuapi.com/recipe/byclass', //按标签检索菜谱
            queryid: 'https://api.jisuapi.com/recipe/detail', //按照菜谱id查看详细
            query: 'https://api.jisuapi.com/recipe/search' //搜索查询
        }
    },
    Touches: new Touches()
})