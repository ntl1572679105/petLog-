//首页
const express = require('express');
//引入连接池
const pool = require('../pool')
const response = require('../utils/Response.js');
const { get } = require('./user');
const router = express.Router()
// 查询所有新闻列表
router.get('/list/', (req, res, next) => {
    pool.query('select * from news', (err, r) => {
        if (err) {
          return next(err)
        }
        res.send({ code: 200, msg: 'ok',data:r })
      });
})
// 新闻的删除接口
router.post('/del/',(req,res,next)=>{
    let news_id = req.body.news_id // post请求参数在req.body中
    // 表单验证通过，执行添加操作
  
    let sql = "delete from news where  news_id=?";
    pool.query(sql, [news_id], (err, r) => {
      if(err){
        return next(err)
      }
      res.send({code: 200, msg: '删除成功'})
    });
})
// 新增新闻
router.post('/add/',(req,res,next)=>{
    let{news_title,news_img,news_content,news_time} = req.body
    let sql = "insert into news(news_title,news_img,news_content,news_time) values(?,?,?,?)";
    pool.query(sql, [news_title,news_img,news_content,news_time], (err, r) => {
      if(err){
        return next(err)
      }
      res.send({code: 200, msg: '新增成功'})
    });
})
// 修改新闻
router.post('/update/',(req,res,next)=>{
    let{news_title,news_img,news_content,news_time,news_id} = req.body
    let sql = "update news set news_title=?, news_img=?,news_content=?,news_time=? where news_id = ?";
    pool.query(sql, [news_title,news_img,news_content,news_time,news_id], (err, r) => {
      if(err){
        return next(err)
      }
      res.send({code: 200, msg: '修改成功'})
    });
})


module.exports = router