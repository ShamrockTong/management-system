const mongoose = require('mongoose')


// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var orderslistSchema = mongoose.Schema({
    id: String,
    totalPrice:String,
    customer:String,
    courier:String,
    courierNumber:String,
    orderstatus:String,
    addTime:String,
    goodsDetails:String,
    recipient:String,
    address:String,
    phonenum:String,
    zipCode:String,
    ordersTime:String
},{
    timestamps: false // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var OrdersList = mongoose.model('orderslists', orderslistSchema);


module.exports = OrdersList;