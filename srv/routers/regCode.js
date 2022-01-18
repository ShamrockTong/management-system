const express = require('express');
const { type } = require('express/lib/response');
const { find, update } = require('../model/goodslist');

const router = express.Router();

const regCode = require('../model/regCode');

// 获取注册码
router.post('/getAllregCode', async (req, res) => {
    let { page, limit } = req.body;
    page = page || 1; // 当前第几页
    limit = limit || 10; // 单页返回的条数限制
    // 初始化 查询条件
    // let where = {  }
    // 按名字查找
    // if(title)  where.title = title
    let where = {};
    //
    const skip = (page - 1) * limit; // 查询的起点（偏移量）
    try {
        // let goodsList = await GoodsList.find(where,{},{skip,limit}).sort({_id:-1}) // 分页查询
        let regCodeList = await regCode
            .find({})
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ _id: -1 });
        let count = await regCode.count(where); // 获取符合条件的总数
        // 分页查询
        // let count = await News.count(where) // 获取符合条件的总数
        res.send({ success: true, info: '查询成功', data: regCodeList, count });
    } catch (e) {
        console.log(e);
        res.send({ success: false, info: '获取失败' });
    }
});

// 添加订单
router.post('/addregCode', async (req, res) => {
    let lastone = await regCode.find().sort({ _id: -1 }).limit(1);
    let lastID = lastone[0].id * 1 + 1;
    // console.log(lastID);
    // const {id=lastID,name1,category,mallPcPrice,marketPrice,addTime} = req.body;
    const { id = lastID, code, uuid, addTime,status } = req.body;
    // // 数据过滤
    if (!code || !uuid) return res.send({ success: false, info: '请填写必要参数' });
    // 添加入库
    try {
        const _code = await regCode.findOne({ code });
        if (_code) return res.send({ success: false, info: '该注册码已重复' });
        await regCode.create({ id, code, uuid, addTime,status });
        res.send({ success: true, info: '添加成功' });
    } catch (e) {
        res.send({ success: false, info: '未知错误 请于网站管理员联系' });
    }
});

// 搜索订单
router.post('/searchregCode', async (req, res) => {
    let { page, limit, name } = req.body;
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
        $or: [
            // 多字段同时匹配
            { code: { $regex: name, $options: '$i' } },
            { uuid: { $regex: name, $options: '$i' } },
            { user: { $regex: name, $options: '$i' } },
            { status: { $regex: name, $options: '$i' } },
        ],
    };
    try {
        // let count = await GoodsList.count(filter) // 获取符合条件的总数
        let searchList = await regCode.find(filter);
        res.send({ success: true, info: '查询成功', data: searchList });
    } catch (e) {
        console.log(e);
        res.send({ success: false, info: '获取失败' });
    }
});

// 查询是否被使用
router.post('/checkregCode', async (req, res) => {
    const { _regCode } = req.body;
    console.log('_regCode', _regCode);
    let where = {
        code: _regCode,
    };
    try {
        // let goodsList = await GoodsList.find(where,{},{skip,limit}).sort({_id:-1}) // 分页查询
        let checkRes = await regCode.findOne(where);
        // if (checkRes) return res.send({ success: false, info: '该注册码已被使用！' });
        console.log('checkRes', checkRes);
        res.send({ success: true, info: '查询成功', data: checkRes });
    } catch (e) {
        console.log(e);
        res.send({ success: false, info: '获取失败' });
    }
});

// 修改注册码详情

router.post('/updateregCode', async (req, res) => {
    const { status, _regCode, user,regTime } = req.body;
    // console.log('updateregCode',updateregCode);
    console.log(status, _regCode, user);
    // console.log('req.body',req.body);
    // console.log(id,name1,category,mallPcPrice,marketPrice);
    // // if(!id ) return res.send({success:false,info:'请输入正确的用户名'});

    const regCodeRes = await regCode.findOne({ code: _regCode });
    // // if(!user)  return res.send({success:false,info:'该用户不存在'});
    console.log('regCodeRes', regCodeRes);
    let updateData = {};
    updateData.status = status;
    updateData.user = user;
    updateData.regTime = regTime

    try {
        await regCode.updateOne(regCodeRes, updateData);
        res.send({ success: true, info: '更新成功' });
    } catch (e) {
        res.send({ success: false, info: '更新失败' });
    }
});

module.exports = router;
