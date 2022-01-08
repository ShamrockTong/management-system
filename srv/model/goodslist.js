const mongoose = require('mongoose')


// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var goodslistSchema = mongoose.Schema({
    id: String,
    name1: String,
    category: String,
    masterImg:String,
    mallPcPrice:String,
    marketPrice:String,
    commentsNumber:String,
    addtime:String,
    upOrdown:Boolean,
    addTime:String
},{
    timestamps: false // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var GoodsList = mongoose.model('goodslist', goodslistSchema);


module.exports = GoodsList;