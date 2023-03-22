//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
const Joi = require("joi");
const response = require('../utils/Response.js');
router.post("/user/login", (req, resp) => {
  let { user_phone, user_pwd } = req.body
  // 表单验证
  let schema = Joi.object({
    user_phone: Joi.string().required().regex(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/),
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
      resp.send(Response.ok())
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
module.exports = router