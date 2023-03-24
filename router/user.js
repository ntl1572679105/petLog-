//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
const Joi = require("joi");
const response = require('../utils/Response.js');
const { post } = require('./community');
// 用户登录
router.post("/login", (req, resp) => {
  let { user_phone, user_pwd } = req.body
  // 表单验证
  let schema = Joi.object({
    user_phone: Joi.string().required().regex(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/),
    user_pwd: Joi.string().required().regex(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/), // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }
  // 查询数据库，账号密码是否填写正确
  let sql = "select * from user where user_phone=? and user_pwd=?"
  pool.query(sql, [user_phone, user_pwd], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    if (result.length == 0) {
      resp.send(Response.error(1001, '账号密码输入错误'));
    } else {
      resp.send({code:200,msg:'登录成功'})
      // 获取登录用户对象
      // let user = result[0]
      // // 为该用户颁发一个token字符串，未来该客户端若做发送其他请求，则需要在请求Header中携带token，完成状态管理。
      // let payload = { id: user.id, nickname: user.nickname }
      // let token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
      // // 返回user对象与token字符串
      // user.password = undefined
      // resp.send(Response.ok({ user, token }));

    }
  })
});
// 用户注册
router.post("/register/", (req, res, next) => {
  let { user_name, user_phone, user_pwd, user_email } = req.body // post请求参数在req.body中
  let schema = Joi.object({
    user_name: Joi.string().required().regex(/^[\w-]{4,16}$/),
    user_phone: Joi.string().required().regex(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/),
    user_pwd: Joi.string().required().regex(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/), // 必填
    user_email: Joi.string().required().email()
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return; // 结束
  }
  // 表单验证通过，执行添加操作
  let sql = "insert into user(user_phone,user_pwd,user_name,user_email) values (?,?,?,?)";
  pool.query(sql, [user_phone, user_pwd, user_name, user_email], (err, r) => {
    if (err) {
      return next(err)
    }
    res.send({ code: 200, msg: '添加成功' })
  });
});
// 验证用户手机号是否已经注册
router.post("/query/phone", (req, res, next) => {
  let user_phone = req.body.user_phone // post请求参数在req.body中
  // 表单验证通过，执行添加操作

  let sql = "select * from user where  user_phone=?";
  pool.query(sql, [user_phone], (err, r) => {
    if (r.length == 0) {
      res.send({ code: 200, msg: '该手机号没有注册', r: r })
    } else {
      res.send({ code: 400, msg: '该手机号已经注册' })

    }
  });
});
// 后台登录接口
router.post("/admin/login", (req, resp) => {
  let { admin_phone, admin_pwd } = req.body
  // 表单验证
  let schema = Joi.object({
    admin_phone: Joi.string().required(),
    admin_pwd: Joi.string().required() // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }
  // 查询数据库，账号密码是否填写正确
  let sql = "select * from admin_a where admin_phone=? and admin_pwd=?"
  pool.query(sql, [admin_phone, admin_pwd], (error, r) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    if (r.length == 0) {
      resp.send(Response.error(1001, '账号密码输入错误'));
    } else {
      resp.send({code:200,msg:'登录成功',data:r})
      // 获取登录用户对象
      // let user = result[0]
      // // 为该用户颁发一个token字符串，未来该客户端若做发送其他请求，则需要在请求Header中携带token，完成状态管理。
      // let payload = { id: user.id, nickname: user.nickname }
      // let token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
      // // 返回user对象与token字符串
      // user.password = undefined
      // resp.send(Response.ok({ user, token }));

    }
  })
});
// 宠物店添加
router.post('/petshop/add',(req,res,next) => {
  let {petshop_name ,petshop_address,petshop_phone} =req.body
  let schema = Joi.object({
    petshop_name: Joi.string().required().regex(/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/),
    petshop_address: Joi.string().required(), // 必填
    petshop_phone: Joi.string().required().regex(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/),

  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return; // 结束
  }
  let sql = 'insert into petshop(petshop_name,petshop_address,petshop_phone) values(?,?,?)'
  pool.query(sql,[petshop_name,petshop_address,petshop_phone],(error,r) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send({code:200,msg:'添加成功'})
  })
})
module.exports = router