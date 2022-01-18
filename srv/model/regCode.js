const mongoose = require('mongoose')


// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var regCodeSchema = mongoose.Schema({
    id: String,
    code: String,
    uuid: String,
    addTime: String,
    user:String,
    status:String,
    regTime:String
},{
    timestamps: false // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var regCode = mongoose.model('regcodes', regCodeSchema);


module.exports = regCode;