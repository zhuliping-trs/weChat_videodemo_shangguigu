// pages/detail/detail.js
let datas = require("../../datas/list-data.js")
let appDatas = getApp();
console.log(appDatas)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},
    isCollected:false,
    isMusicPlay:false,
    index:"",
    favoriteTitle:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options) //获取url的参数；
    let index = options.index;
    this.setData({
      detailObj: datas.list_data[index],
      index
    })

    //
    let detailStorage = wx.getStorageSync("isCollected");
    if (!detailStorage){
      wx.setStorageSync("isCollected", {})
    }
    if (detailStorage[index]){
      this.setData({
        isCollected: true
      })
    }

    //监听背景音乐播放
    const BackgroundAudioManager = wx.getBackgroundAudioManager()
    BackgroundAudioManager.onPlay(() => {
      console.log("音乐播放")
      this.setData({
        isMusicPlay:true
      })
      
      //修改appDatas中的数据
      appDatas.data.isPlay = true;
      appDatas.data.pageIndex = index;

    })
 
    //判断当前详情音乐是否在播放、
    if(appDatas.data.isPlay && appDatas.data.pageIndex === index){
      this.setData({
        isMusicPlay:true,
      })
    }


    //监听背景音乐暂停
    BackgroundAudioManager.onPause(() => { 
      console.log("音乐暂停")
      this.setData({
        isMusicPlay: false
      })

      //修改appDatas中的数据
      appDatas.data.isPlay = true;
      // appDatas.data.pageIndex = index;
    })
  },
  handleCollection(){  //改变收藏状态
    //更新状态
    this.setData({
      isCollected:!this.data.isCollected,
      favoriteTitle: !this.data.isCollected?"收藏成功":"取消收藏"
    })
    //提示
    wx.showToast({
      title: this.data.favoriteTitle,
      icon: 'success',
      duration: 1000
    })
    //缓存数据到本地
    
    let {index} = this.data
    
    wx.getStorage({
      key: 'isCollected',
      success: (datas)=> {
        console.log(datas)
        let obj = datas.data;
        obj[index] = this.data.isCollected;
        wx.setStorage({
          key: 'isCollected',
          data: obj,
          success: () => {
            console.log("缓存成功")
          }
        })
      }
    })
    
  },
  handleMusicPlay(){
    //处理音乐播放
    let isMusicPlay = !this.data.isMusicPlay;
    this.setData({
      isMusicPlay
    })

    if(isMusicPlay){
      //播放
      let { dataUrl, title } = this.data.detailObj.music;
      wx.playBackgroundAudio({
        dataUrl,
        title
      })
    }else{
      //暂停
      wx.stopBackgroundAudio()
    }

  },

  handleShare(){
    wx.showActionSheet({
      itemList:[
        '分享到朋友圈','分享到qq空间','分享到微博'
      ]
    })
  },






  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})