//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
const Joi = require("joi");
// 用户发布信息
router.post('/addInvite/', (req, res, next) => {
  let { invitation_title, invitation_content, invitation_time, user_id } = req.body
  // 表单验证
  let schema = Joi.object({
    invitation_title: Joi.string().required(), // 必填
    invitation_content: Joi.string().required(), // 必填
    invitation_time: Joi.string().required(),
    user_id: Joi.string().required(), // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return; // 结束
  }
  le
  pool.query('insert into invitation(invitation_title,invitation_content,invitation_time,user_id) values(?,?,?,?)', [invitation_title, invitation_content, invitation_time, user_id], (err, r) => {
    if (err) {
      return next(err)
    }
    res.send({ code: 200, msg: '添加成功' })
  })
})
// 2.用户根据信息的用户id查询信息接口
router.get('/list/id/', (req, res, next) => {
  let user_id = req.query.user_id
// 表单验证
let schema = Joi.object({
  user_id: Joi.string().required(), // 必填
});
let { error, value } = schema.validate(req.body);
if (error) {
  res.send(Response.error(400, error));
  return; // 结束
}
  pool.query('select * from invitation where `user_id` = ?', [user_id], (err, r) => { 
    if (err) {
      return next(err)
    }
    if (r.length == 0) {
      res.send({ code: 400, msg: '没有该用户的评论'})
    } else {
      res.send({ code: 200, msg: '查询成功', data: r })

    }
  })
})
// 查询所有的信息
router.get('/list',(req,res,next) => {
  let { page, pagesize } = req.query;
  let schema = Joi.object({
    page: Joi.number().required(), // page必须是数字，必填
    pagesize: Joi.number().integer().required(), // pagesize必须是不大于100的数字，必填
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    return; // 结束
  }
  let startIndex = (page - 1) * 10;
  let size = parseInt(pagesize);
  pool.query('select * from invitation limit ?,?',[startIndex, size],(err,r) => {
    if (err) {
      return next(err)
    }
    res.send({ code: 200, msg: '查询成功', data: r })
  })
})
// 修改信息状态
router.post('/state/',(req,res,next) => {
  let {invitation_state,invitation_id} = req.body
  let schema = Joi.object({
    user_id: Joi.string().required(), // 必填
    invitation_state: Joi.string().required() // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return; // 结束
  }
  let sql = 'update invitation set invitation_state = ? where invitation_id = ?'
  pool.query(sql,[invitation_state,invitation_id],(err,r) => {
    if (err) {
      return next(err)
    }
    res.send({ code: 200, msg: '修改成功' })
  })
})
// 修改信息接口
router.post('/update/',(req,res,next) => {
  let {invitation_title,invitation_content,invitation_time,invitation_id} = req.body
  let schema = Joi.object({
    invitation_title: Joi.string().required(), // 必填
    invitation_content: Joi.string().required(), // 必填
    invitation_time: Joi.string().required(),
    invitation_id: Joi.string().required() // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return; // 结束
  }
  let sql = 'update invitation set invitation_title = ?,invitation_content = ?,invitation_time = ? where invitation_id = ?'
  pool.query(sql,[invitation_title,invitation_content,invitation_time,invitation_id],(err,r) => {
    if (err) {
      return next(err)
    }
    res.send({ code: 200, msg: '修改成功' })
  })
})
// 信息的删除接口
router.post('/del/',(req,res,next) => {
    let invitation_id = req.body.invitation_id
    let schema = Joi.object({
      invitation_id: Joi.string().required(), // 必填
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
      res.send(Response.error(400, error));
      return; // 结束
    }
    let sql =  "delete from invitation where invitation_id = ?"
    pool.query(sql,[invitation_id],(err,r) => {
      if (err) {
        return next(err)
      }
      res.send({ code: 200, msg: '删除成功' })
    })
})
// 发表评论
router.post('/add/commenton',(req,res,next) => {
  let{commenton_content,invitation_id,user_id} = req.body
  let schema = Joi.object({
    commenton_content: Joi.string().required(), // 必填
    invitation_id: Joi.string().required(), // 必填
    user_id: Joi.string().required()
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return; // 结束
  }
  let sql = 'insert into commenton(commenton_content,invitation_id,user_id) values(?,?,?)'
  pool.query(sql,[commenton_content,invitation_id,user_id],(err,r) => {
    if (err) {
      return next(err)
    }
    res.send({ code: 200, msg: '添加' })
  })
})
module.exports = router