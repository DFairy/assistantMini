// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: '',
})
const db = cloud.database()
    // 云函数入口函数
exports.main = async(event, context) => {
    console.log(event)
    return await db.collection('bcgList').add({
        data: {
            url: event.url
        }
    })
}