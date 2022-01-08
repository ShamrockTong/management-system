const express = require('express');
const { type } = require('express/lib/response');
const { find } = require('../model/goodslist');

const  router = express.Router();

const GoodsList = require("../model/goodslist");
 
// 添加商品
router.post('/addGoods', async (req,res)=>{
  let lastone = await GoodsList.find().sort({_id:-1}).limit(1)
  let lastID = lastone[0].id * 1+ 1 
  console.log(lastID);
  const {id=lastID,name1,category,mallPcPrice,marketPrice} = req.body;
    // // 数据过滤
    if(!name1||!category||!mallPcPrice||!marketPrice) return res.send( {success:false,info:'请填写必要参数'});

    // 添加入库
    try{
        await GoodsList.create({id,name1,category,mallPcPrice,marketPrice})
        res.send({success:true,info:'添加成功'})

    } catch(e) {
        res.send( {success:false,info:'未知错误 请于网站管理员联系'});
    }


})

// 获取商品列表
router.post('/getAllgoods', async (req,res)=>{
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
        let goodsList = await GoodsList.find({}).skip((page - 1)*parseInt(limit)).limit(parseInt(limit)).sort({_id:-1})
        let count = await GoodsList.count(where) // 获取符合条件的总数
         // 分页查询
        // let count = await News.count(where) // 获取符合条件的总数
        res.send({success:true,info:'查询成功',data:goodsList,count});
      }catch(e){
          console.log(e)
        res.send({success:false,info:'获取失败'})
      }

})

router.delete('/removeGood/:id', async (req, res) => {
    const { id } = req.params;
    console.log('id',id);
    const condition = {id:id}
    console.log(condition);
    // let {_id} = await GoodsList.find()
    try{
        await GoodsList.deleteOne(condition,(err)=>{
                console.log('删除成功');
        })
        res.send({success:true,info:'删除成功'});
    }catch(e){
            // console.log(e);
            res.send({success:false,info:'删除成功'})
    }
    
   //  const result = await db.remove(colName,{_id:id})
   //  res.send(formatData({
   //     code: result ? 200 : 400
   // }))
})

router.post('/updateGood', async(req,res)=>{


  const { id,name1,category,mallPcPrice,marketPrice} = req.body;
  console.log('req.body',req.body);
  console.log(id,name1,category,mallPcPrice,marketPrice);
  // // if(!username ) return res.send({success:false,info:'请输入正确的用户名'});

  const goods = await GoodsList.findOne({ id })
  // // if(!user)  return res.send({success:false,info:'该用户不存在'});
  console.log('goods',goods);
  let updateData = {};

  // // 如果用户传入手机 那么updateData添加一个phone的属性
  // // if(updateData) =; 
  // // 如果用户传入密码  那么updateData添加一个password的属性 遵循 password的加密规则
  if(name1){
      updateData.name1 =  name1
  }
  // // 如果用户传入sex 那么updateData添加一个sex的属性
  if(category) updateData.category = category;
  if(mallPcPrice) updateData.mallPcPrice = mallPcPrice;
  if(category) updateData.marketPrice = marketPrice;

  try{

      await GoodsList.updateOne(goods,updateData)
      res.send({success:true,info:'更新成功'});
      

  }catch(e){
      res.send({success:false,info:'更新失败'});
  }
})

router.post('/searchGoods', async (req,res)=>{
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
        {name1: {$regex: name,$options: '$i'}},
        {category: {$regex: name}}, //  $options: '$i' 忽略大小写
        {id: {$regex: name, $options: '$i'}}
      ]
    }
    try {
      // let count = await GoodsList.count(filter) // 获取符合条件的总数
      let searchList = await GoodsList.find(filter)
      res.send({success:true,info:'查询成功',data:searchList});
    }catch(e){
        console.log(e)
      res.send({success:false,info:'获取失败'})
    }

})

// 更改上下架状态
router.post('/upordown', async(req,res)=>{


  const { id,upOrdown} = req.body;
  console.log(id,upOrdown);
  // // if(!username ) return res.send({success:false,info:'请输入正确的用户名'});

  const goods = await GoodsList.findOne({ id })
  // // if(!user)  return res.send({success:false,info:'该用户不存在'});
  console.log('goods',goods);
  let updateData = {upOrdown:upOrdown};

  // // 如果用户传入手机 那么updateData添加一个phone的属性
  // // if(updateData) =; 
  // // 如果用户传入密码  那么updateData添加一个password的属性 遵循 password的加密规则


  try{

      await GoodsList.updateOne(goods,updateData)
      res.send({success:true,info:'上下架成功'});
      

  }catch(e){
      res.send({success:false,info:'上下架失败'});
  }
})
// 上架全部
router.post('/upAllGoods', async(req,res)=>{


  // const { id,upOrdown} = req.body;
  // console.log(id,upOrdown);
  // // if(!username ) return res.send({success:false,info:'请输入正确的用户名'});

  // const goods = await GoodsList.find()
  // // if(!user)  return res.send({success:false,info:'该用户不存在'});
  // console.log('goods',goods);
  let updateData = {upOrdown:true};

  // // 如果用户传入手机 那么updateData添加一个phone的属性
  // // if(updateData) =; 
  // // 如果用户传入密码  那么updateData添加一个password的属性 遵循 password的加密规则


  try{

      await GoodsList.updateMany({},updateData)
      res.send({success:true,info:'上下架成功'});
      

  }catch(e){
      res.send({success:false,info:'上下架失败'});
  }
})

// 下架全部
router.post('/downAllGoods', async(req,res)=>{
  let updateData = {upOrdown:false};
  try{
      await GoodsList.updateMany({},updateData)
      res.send({success:true,info:'上下架成功'});
  }catch(e){
      res.send({success:false,info:'上下架失败'});
  }
})


// 获取已上架商品列表
router.post('/getAllUpGoods', async (req,res)=>{
  let { page,limit} = req.body;
   page = page || 1; // 当前第几页
   limit = limit || 10; // 单页返回的条数限制

    // 初始化 查询条件      
    // let where = {  }
    // 按名字查找
    // if(title)  where.title = title
    let where = { upOrdown:true }
  // 
    const skip =  (page - 1) * limit; // 查询的起点（偏移量）
    try {
      // let goodsList = await GoodsList.find(where,{},{skip,limit}).sort({_id:-1}) // 分页查询
      let goodsList = await GoodsList.find(where).skip((page - 1)*parseInt(limit)).limit(parseInt(limit)).sort({_id:-1})
      let count = await GoodsList.count(where) // 获取符合条件的总数
       // 分页查询
      // let count = await News.count(where) // 获取符合条件的总数
      res.send({success:true,info:'查询成功',data:goodsList,count});
    }catch(e){
        console.log(e)
      res.send({success:false,info:'获取失败'})
    }

})

router.post('/searchUpGoods', async (req,res)=>{
  let { page,limit,name,upOrdown=true } = req.body;
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
        {name1: {$regex: name,$options: '$i'}},
        {category: {$regex: name}}, //  $options: '$i' 忽略大小写
        {id: {$regex: name, $options: '$i'}},
        // {upOrdown:{$regex: upOrdown, $options: '$i'}}
      ],
      upOrdown:true
    }
    try {
      // let count = await GoodsList.count(filter) // 获取符合条件的总数
      let searchList = await GoodsList.find(filter).sort({_id:-1})
      res.send({success:true,info:'查询成功',data:searchList});
    }catch(e){
        console.log(e)
      res.send({success:false,info:'获取失败'})
    }

})
module.exports = router;