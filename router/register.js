//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
const Joi = require("joi");
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
router.post("/user/query/phone", (req, res, next) => {
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

module.exports = router