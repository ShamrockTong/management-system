const express = require('express');
const { type } = require('express/lib/response');
const { find } = require('../model/goodslist');

const  router = express.Router();

const OrdersList = require("../model/orderslist");
 

// 获取订单列表
router.post('/getAllorders', async (req,res)=>{
    let { page,limit} = req.body;
     page = page || 1; // 当前第几页
     limit = limit || 10; // 单页返回的条数限制

      // 初始化 查询条件      
      // let where = {  }
      // 按名字查找
      // if(title)  where.title = title
      let where = {  }
    // 
      const skip =  (page - 1) * limit; // 查询的起点（偏移量）
      try {
        // let goodsList = await GoodsList.find(where,{},{skip,limit}).sort({_id:-1}) // 分页查询
        let orderslist = await OrdersList.find({}).skip((page - 1)*parseInt(limit)).limit(parseInt(limit)).sort({_id:-1})
        let count = await OrdersList.count(where) // 获取符合条件的总数
         // 分页查询
        // let count = await News.count(where) // 获取符合条件的总数
        res.send({success:true,info:'查询成功',data:orderslist,count});
      }catch(e){
          console.log(e)
        res.send({success:false,info:'获取失败'})
      }

})

// 添加订单
router.post('/addOrder', async (req,res)=>{
    let lastone = await OrdersList.find().sort({_id:-1}).limit(1)
    let lastID = lastone[0].id * 1+ 1 
    // console.log(lastID);
    // const {id=lastID,name1,category,mallPcPrice,marketPrice,addTime} = req.body;
    const {id=lastID,totalPrice,customer,courier,courierNumber,orderstatus,addTime,goodsDetails,recipient,address,phonenum,zipCode,ordersTime} = req.body;
      // // 数据过滤
    //   if(!totalPrice||!customer||!courier||!courierNumber||!orderstatus||!addTime||!goodsDetails||!recipient||!address||!phonenum||!zipCode||!ordersTime) return res.send( {success:false,info:'请填写必要参数'});
  
      // 添加入库
      try{
          await OrdersList.create({id,totalPrice,customer,courier,courierNumber,orderstatus,addTime,goodsDetails,recipient,address,phonenum,zipCode,ordersTime})
          res.send({success:true,info:'添加成功'})
  
      } catch(e) {
          res.send( {success:false,info:'未知错误 请于网站管理员联系'});
      }
  
  })


  // 修改订单详情

  router.post('/updateOrder', async(req,res)=>{


    const {id,totalPrice,customer,courier,courierNumber,orderstatus,goodsDetails,recipient,address,phonenum,zipCode,ordersTime} = req.body;
    // console.log('req.body',req.body);
    // console.log(id,name1,category,mallPcPrice,marketPrice);
    // // if(!id ) return res.send({success:false,info:'请输入正确的用户名'});
  
    const order = await OrdersList.findOne({ id })
    // // if(!user)  return res.send({success:false,info:'该用户不存在'});
    console.log('order',order);
    let updateData = {};
  
    // // 如果用户传入手机 那么updateData添加一个phone的属性
    // // if(updateData) =; 
    // // 如果用户传入密码  那么updateData添加一个password的属性 遵循 password的加密规则
    // id,totalPrice,customer,courier,courierNumber,orderstatus,goodsDetails,recipient,address,phonenum,zipCode,ordersTime
    // // 如果用户传入sex 那么updateData添加一个sex的属性
    if(totalPrice) updateData.totalPrice = totalPrice;
    if(customer) updateData.customer = customer;
    if(courier) updateData.courier = courier;
    if(courierNumber) updateData.courierNumber = courierNumber;
    if(orderstatus) updateData.orderstatus = orderstatus;
    if(goodsDetails) updateData.goodsDetails = goodsDetails;
    if(recipient) updateData.recipient = recipient;
    if(address) updateData.address = address;
    if(phonenum) updateData.phonenum = phonenum;
    if(zipCode) updateData.zipCode = zipCode;
    if(ordersTime) updateData.ordersTime = ordersTime;
  
    try{
        await OrdersList.updateOne(order,updateData)
        res.send({success:true,info:'更新成功'});
        
  
    }catch(e){
        res.send({success:false,info:'更新失败'});
    }
  })

  // 搜索订单
  router.post('/searchOrders', async (req,res)=>{
    let { page,limit,name } = req.body;
    // console.log(name);
     page = page || 1; // 当前第几页
     limit = limit || 10; // 单页返回的条数限制
    //   初始化 查询条件      
      // let where = { name1:name1}
    // //   按名字查找
    //   if(name1)  where.title = title
    
    // 
      // const skip =  (page - 1) * limit; // 查询的起点（偏移量）
      let filter = {
        $or: [  // 多字段同时匹配
          {totalPrice: {$regex: name,$options: '$i'}},
          {customer: {$regex: name,$options: '$i'}},
          {courier: {$regex: name,$options: '$i'}},
          {courierNumber: {$regex: name,$options: '$i'}},
          {orderstatus: {$regex: name,$options: '$i'}},
          {recipient: {$regex: name,$options: '$i'}},
          {phonenum: {$regex: name,$options: '$i'}},
        ]
      }
      try {
        // let count = await GoodsList.count(filter) // 获取符合条件的总数
        let searchList = await OrdersList.find(filter)
        res.send({success:true,info:'查询成功',data:searchList});
      }catch(e){
          console.log(e)
        res.send({success:false,info:'获取失败'})
      }
  
  })

// 删除订单

router.delete('/removeorder/:id', async (req, res) => {
    const { id } = req.params;
    console.log('id',id);
    const condition = {id:id}
    console.log(condition);
    // let {_id} = await userList.find()
    try{
        await OrdersList.deleteOne(condition,(err)=>{
                console.log('删除成功',err);
        })
        res.send({success:true,info:'删除成功'});
    }catch(e){
            // console.log(e);
        res.send({success:false,info:'删除成功',e})
    }
    
   //  const result = await db.remove(colName,{_id:id})
   //  res.send(formatData({
   //     code: result ? 200 : 400
   // }))
})

module.exports = router;
