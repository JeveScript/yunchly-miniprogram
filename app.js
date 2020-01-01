import API from './global/request/api.js'

App({
  onLaunch: function () {
    // 展示本地存储能力
    let user_id = wx.getStorageSync('user_id');
    let userInfo = wx.getStorageSync('userInfo');
    if (user_id && userInfo){
      this.globalData.userInfo = userInfo;
      this.globalData.user_id = user_id;
      return
    }
    // this.login()
  },
  login: function(){
    return new Promise((resolve, reject)=>{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                let userInfo = res.userInfo
                this.globalData.userInfo = userInfo
                wx.setStorageSync('userInfo', userInfo);
                wx.login({
                  success: res => {
                    if (res.code) {
                      wx.request({
                        url: API.login,
                        method: 'POST',
                        data: {
                          code: res.code,
                          userInfo: userInfo
                        },
                        success: res => {
                          if (res.data.code !== 200) {
                            console.log(res.data.message)
                            return
                          }
                          this.globalData.user_id = res.data.data
                          wx.setStorageSync('user_id', res.data.data);
                          resolve('success')
                        }
                      })
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })
              }
            })
          } else {
            wx.showModal({
              content: '您暂未授权，是否授权',
              confirmColor: '#72bd4a',
              success: res => {              
                if (res.confirm) {
                  wx.openSetting({
                    success(res){
                      console.log(!!res.authSetting['scope.userInfo'] ? '设置成功' : '设置失败');
                    },
                  });
                }
              }
            });
          }
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    user_id: null
  }
})