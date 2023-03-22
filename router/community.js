//获取当前页评论
//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
// 用户发布信息
router.post('/addInvite/', (req, res, next) => {
  let {invitation_title,invitation_content,invitation_time,user_id,invitation_state} = req.body
  pool.query('insert into invitation(invitation_title,invitation_content,invitation_time,user_id,invitation_state) values(?,?,?,?,?)', [invitation_title,invitation_content,invitation_time,user_id,invitation_state], (err, r) => {
      if (err) {
          return next(err)
      }
      res.send({ code: 200, msg: '添加成功' })
  })
})

module.exports = router