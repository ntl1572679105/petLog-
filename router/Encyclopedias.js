//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
const Joi = require("joi");
// 查询科普
router.get('/list/', (req, res, next) => {
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
      pool.query('select * from science limit ?,?', [startIndex, size] ,(err, r) => {
          if (err) {
            return next(err)
          }
          res.send({ code: 200, msg: 'ok',data:r })
        });
  })
  // 科普的删除接口
  router.post('/del/',(req,res,next)=>{
      let science_id = req.body.science_id // post请求参数在req.body中
      let schema = Joi.object({
        science_id: Joi.string().required(), // 必填
      });
      let { error, value } = schema.validate(req.body);
      if (error) {
        res.send(Response.error(400, error));
        return; // 结束
      }
      // 表单验证通过，执行添加操作
      let sql = "delete from science where  science_id=?";
      pool.query(sql, [science_id], (err, r) => {
        if(err){
          return next(err)
        }
        res.send({code: 200, msg: '删除成功',data:r})
      });
  })
  // 新增科普
  router.post('/add/',(req,res,next)=>{
      let{science_title,science_img,science_content} = req.body
      // 表单验证
      let schema = Joi.object({
        science_title: Joi.string().required(), // 必填
        science_img: Joi.string().required(), // 必填
        science_content: Joi.string().required()
      });
      let { error, value } = schema.validate(req.body);
      if (error) {
        res.send(Response.error(400, error));
        return; // 结束
      }
      let sql = "insert into science(science_title,science_img,science_content) values(?,?,?)";
      pool.query(sql, [science_title,science_img,science_content], (err, r) => {
        if(err){
          return next(err)
        }
        res.send({code: 200, msg: '新增成功'})
      });
  })
  // 修改科普
  router.post('/update/',(req,res,next)=>{
      let{science_title,science_img,science_content,science_id} = req.body
      let schema = Joi.object({
        science_title: Joi.string().required(), // 必填
        science_img: Joi.string().required(), // 必填
        science_content: Joi.string().required(), // 必填
        science_id: Joi.string().required() // 必填
      });
      let { error, value } = schema.validate(req.body);
      if (error) {
        res.send(Response.error(400, error));
        return; // 结束
      }
      let sql = "update science set science_title=?, science_img=?,science_content=?where science_id = ?";
      pool.query(sql, [science_title,science_img,science_content,science_id], (err, r) => {
        if(err){
          return next(err)
        }
        if(r.affectedRows == 0){
            res.send({code: 400, msg: '没有这条数据'}) 
        }
        res.send({code: 200, msg: '修改成功',data:r})
      });
  })
  module.exports = router