const express = require('express');
const app = express();


// 跨域 cors
const cors = require('cors')
app.use(cors()); // 解除cors跨域限制

// mongodb 连接
const mongoose = require('./db')  // 把刚才配置的mongoose链接导入

const bodyParser = require('body-parser')
// 针对表单格式传递的post body的参数 application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// 针对的是已json形式 body 传参的  application/json
var jsonParser = bodyParser.json()
app.use(jsonParser)
app.use(urlencodedParser)


// 各个路由的导入
const userRouter = require('./routers/user');
const goodsListRouter = require('./routers/goodslist');
const ordersRouter = require('./routers/orderslist')
const regCodeRouter = require('./routers/regCode')

// 前台用户流程
app.use('/api',userRouter);
app.use('/api',goodsListRouter);
app.use('/api',ordersRouter)
app.use('/api',regCodeRouter)

const port = 3000;

app.listen(port,()=>{
    console.log(`srv is running at port ${port}`);
})