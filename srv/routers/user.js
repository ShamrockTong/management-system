const express = require('express');

const  router = express.Router();
// const utils = require('utility'); //  npm i utility   使用这个模块的md5方法来实现md5加密
const User = require('../model/user')
// 引入token
const jwt = require('jsonwebtoken')

// 添加用户

router.post('/addUser', async (req,res)=>{
    let lastone = await User.find().sort({_id:-1}).limit(1)
    let lastID = lastone[0].id * 1+ 1 

    const { id=lastID,username,password,name,uuid,regTime} = req.body;
   

    if(!username ) return res.send({success:false,info:'请输入正确的账号'});
    if(!password ) return res.send({success:false,info:'请输入正确的密码'});
    if(!name ) return res.send({success:false,info:'请输入正确的用户名'});
    
    try {
        const user = await  User.findOne({ username });
        if(user)  return res.send({success:false,info:'该账号已被使用'});

        // const _d = new Date();
        // const _t = _d.getTime();

        // let finalpassword = utils.md5( `${password}${_t}` ) // 对用户密码进行加密

        await User.create({
            id,
            username,
            password, 
            uuid,
            name,
            regTime
        })

        res.send({success:true,info:'注册成功'})

    }catch(e){

        res.send({success:false,info:'注册失败'})

    }
})


// 用户登录

router.post('/login', async (req,res)=>{

    const { username,password } = req.body;
    console.log(username,password)
    if(!username ) return res.send({success:false,info:'请输入正确的用户名'});
    if(!password ) return res.send({success:false,info:'请输入正确的用户名'});

    try {
        const user = await User.findOne({ username });  
        if(!user)  return res.send({success:false,info:'用户或密码错误'});

        // 密码比对

        // const _d = user.createdAt;
        // const _t = _d.getTime();

        // let finalpassword = utils.md5( `${password}${_t}` ) // 对用户密码进行加密
   

        if( user.password!=password) return res.send({success:false,info:'用户或密码错误'});
        
        // 生成一个token
        // const token = jwt.sign({
        //     uid:user._id,
        // },'123456',{
        //     expiresIn: 60*60*1000
        // })
        
        // req.session.username = user.username;
         res.send({success:true,info:'登录成功'});

    }catch(e){

        res.send({success:false,info:'登录失败'})

    }

})

router.post('/getUserName', async (req,res)=>{
  let {username} = req.body;
  //  page = page || 1; // 当前第几页
  //  limit = limit || 50; // 单页返回的条数限制
    console.log('username',username);
    // 初始化 查询条件      
    let where = { username:username }
    // 按名字查找
    // if(title)  where.title = title
  
  // 
    // const skip =  (page - 1) * limit; // 查询的起点（偏移量）
    try {
      let name = await User.find(where) // 分页查询
      // let count = await User.count()
      // let count = await News.count(where) // 获取符合条件的总数
      console.log('name',name);
      res.send({success:true,info:'查询成功',data:name});
    }catch(e){
        console.log(e)
      res.send({success:false,info:'获取失败'})
    }

})



router.post('/getAllusers', async (req,res)=>{
    let { page,limit } = req.body;
     page = page || 1; // 当前第几页
     limit = limit || 50; // 单页返回的条数限制

      // 初始化 查询条件      
      // let where = {  }
      // 按名字查找
      // if(title)  where.title = title
    
    // 
      // const skip =  (page - 1) * limit; // 查询的起点（偏移量）
      try {
        let usersList = await User.find().skip((page - 1)*parseInt(limit)).limit(parseInt(limit)).sort({_id:-1}) // 分页查询
        let count = await User.count()
        // let count = await News.count(where) // 获取符合条件的总数
        res.send({success:true,info:'查询成功',data:usersList,count});
      }catch(e){
          console.log(e)
        res.send({success:false,info:'获取失败'})
      }

})

router.delete('/removeUser/:username', async (req, res) => {
    const { username } = req.params;
    console.log('username',username);
    const condition = {username:username}
    console.log(condition);
    // let {_id} = await userList.find()
    try{
        await User.deleteOne(condition,(err)=>{
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

router.post('/updateUser', async(req,res)=>{


    const {username,password,name,uuid} = req.body;
    console.log('req.body',req.body);
    console.log(username,password,name,uuid);
    // // if(!username ) return res.send({success:false,info:'请输入正确的用户名'});
  
    const user = await User.findOne({ username })
    // // if(!user)  return res.send({success:false,info:'该用户不存在'});
    console.log('user',user);
    let updateData = {};
  
    // // 如果用户传入手机 那么updateData添加一个phone的属性
    // // if(updateData) =; 
    // // 如果用户传入密码  那么updateData添加一个password的属性 遵循 password的加密规则
    if(password){
        updateData.password =  password
    }
    // // 如果用户传入sex 那么updateData添加一个sex的属性
    if(name) updateData.name = name;
    if(uuid) updateData.uuid = uuid;
  
    try{
  
        await User.updateOne(user,updateData)
        res.send({success:true,info:'更新成功'});
        
  
    }catch(e){
        res.send({success:false,info:'更新失败'});
    }
  })

router.post('/searchUser', async (req,res)=>{
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
          {username: {$regex: name,$options: '$i'}},
          {name: {$regex: name,$options: '$i'}}, //  $options: '$i' 忽略大小写
          {uuid: {$regex: name, $options: '$i'}}
        ]
      }
      try {
        // let count = await GoodsList.count(filter) // 获取符合条件的总数
        let searchList = await User.find(filter)
        res.send({success:true,info:'查询成功',data:searchList});
      }catch(e){
          console.log(e)
        res.send({success:false,info:'获取失败'})
      }
  
  })
  
module.exports = router;

