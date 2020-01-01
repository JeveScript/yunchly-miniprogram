const app = getApp()
import API from '../../global/request/api.js'

Page({
  data: {
    nullData:true,
    topicData:[],
  },
  onShow(){
    let id = app.globalData.user_id;
    let nullData = this.data.nullData;
    wx.request({
      url: API.wxUserFollow + '/' + id,
      success:res=>{
        res.data.data.length ? nullData = false : nullData = true
        this.setData({
          nullData,
          topicData:res.data.data
        })
      }
    })
  },
  handleCancel(e){
    wx.showModal({
      title: '是否确认取消关注',
      success:(res)=>{
        if (res.confirm) {
          let topic_id = e.currentTarget.dataset.id;
          let user_id = app.globalData.user_id;
          wx.request({
            url: API.wxUnFollow,
            method: 'POST',
            data: {topic_id,user_id},
            success:res=>{
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              if(res.data.code===200){
                this.onShow()
              }
            }
          })
        }
      }
    })
  }
})