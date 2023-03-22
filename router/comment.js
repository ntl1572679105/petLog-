//获取当前页评论
//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
router.get('/commment/', (req, res, next) => {
  var obj = req.query
  pool.query('select * from com', [obj.aid], (err, r) => {
      if (err) {
          return next(err)
      }
      res.send({ code: 200, msg: '查询', data: r })
  })
})
module.exports = router