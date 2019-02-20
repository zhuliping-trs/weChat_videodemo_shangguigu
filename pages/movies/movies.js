// pages/movies/movies.js
const MOVIE_URL = 'http://t.yushu.im/v2/movie/top250';
let appDatas = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   moviesArr:[],
   pageindex:10,//默认加载10条数据
   start:50, //从第十条数据开始
   loading:false,
   loaded:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    let start = this.data.start
    this.setData({
      start:start>=10?start-=10:0
    })
    this.requestData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   console.log("上啦加载更多");
   let pageindex = this.data.pageindex;
   this.setData({
     pageindex:pageindex+=10,
   })
   this.requestData()
  },

  requestData:function (){
    let page = this.data.pageindex;
    let start = this.data.start;
    wx.request({
      url: "http://t.yushu.im/v2/movie/top250?start=" + start +"&count="+page,
      success: (data) => {
        wx.stopPullDownRefresh(); // 数据请求成功后，停止刷新 下拉空白消失
        console.log(data)
        if (page <= data.data.total-start){
          this.setData({
            loading:true,
            loaded:false,
            moviesArr: data.data.subjects
          })
          appDatas.data.moviesArr = data.data.subjects
        }else{
          this.setData({
            loading:false,
            loaded: true
          })
        }
      }
    })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})