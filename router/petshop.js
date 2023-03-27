const express = require('express');
//引入连接池
const pool = require('../pool')
const Response = require("../utils/Response.js");
const router = express.Router()
const Joi = require("joi");
const response = require('../utils/Response.js');

//宠物店新增商品接口
router.post('/addcommodity',(req,resp,next)=>{
    let { commondity_name,commondity_description,commondity_img,commondity_price,petshop_id} = req.body
    let schema = Joi.object({
        commondity_name: Joi.string().required(), // 必填
        commondity_description: Joi.string().required(), // 必填
        commondity_img: Joi.string().required(),
        commondity_price:Joi.string().required(),
        petshop_id:Joi.number().required()
     });
     let { error, value } = schema.validate(req.body);
     if (error) {
       resp.send(Response.error(400, error));
       return; // 结束
     }
     let sql = "insert into commondity(commondity_name,commondity_description,commondity_img,commondity_price,petshop_id) values(?,?,?,?,?)";
     pool.query(sql, [commondity_name,commondity_description,commondity_img,commondity_price,petshop_id], (err, r) => {
        if(err){
          return next(err)
        }
        resp.send({code: 200, msg: '新增成功'})
      });
})

//管理员修改商品状态
router.post('/updatestate',(req,resp,next)=>{
    let {state,commondity_id} = req.body
    console.log(req.body)
    let sql = "update commondity set commondity_state=? where commondity_id=?";
    pool.query(sql, [state,commondity_id], (err, r) => {
        if(err){
          return next(err)
        }
        resp.send({code: 200, msg: '更新状态成功'})
      });
})

//宠物店查询商品接口
router.get('/getcommondity',(req,resp,next)=>{
    let {petshop_id} = req.query
    let sql = "select * from commondity where petshop_id = ?";
    pool.query(sql, [petshop_id], (err, r) => {
        if(err){
          return next(err)
        }
        console.log(r)
        resp.send({code: 200, msg: '查询成功',data:r})
      });
})
//宠物店修改商品接口
router.post('/updatecommondity',(req,resp,next)=>{
    let {commondity_name,commondity_description,commondity_img,commondity_price,commondity_id} = req.body
    console.log(req.body)
    let sql = "update commondity set commondity_name=?,commondity_description=?,commondity_img=?,commondity_price=? where commondity_id=?";
    pool.query(sql, [commondity_name,commondity_description,commondity_img,commondity_price,commondity_id], (err, r) => {
        if(err){
          return next(err)
        }
        resp.send({code: 200, msg: '修改商品成功'})
      });
})

//宠物店删除商品接口
router.post('/deletecommondity',(req,resp,next)=>{
    let {commondity_id} = req.body
    let sql = "delete from commondity where commondity_id = ?";
    pool.query(sql, [commondity_id], (err, r) => {
        if(err){
          return next(err)
        }
        resp.send({code: 200, msg: '删除商品成功'})
      });
})
// 用户预约洗护接口
router.post('/addwash',(req,resp,next)=>{
    let {type_id,wash_time,user_id,petshop_id} = req.body
    let sql = "insert into wash(type_id,wash_time,user_id,petshop_id) values(?,?,?,?)"
    pool.query(sql, [type_id,wash_time,user_id,petshop_id], (err, r) => {
        if(err){
          return next(err)
        }
        resp.send({code: 200, msg: '新增预约成功'})
      });
})

// 宠物店修改预约状态
router.post('/updatewashstate',(req,resp,next)=>{
    let {wash_id} = req.body
    console.log(wash_id)
    let sql="update wash set wash_resolve=1 where wash_id=?"
    pool.query(sql, [wash_id], (err, r) => {
        if(err){
          return next(err)
        }
        resp.send({code: 200, msg: '修改预约成功'})
      });
})

//用户跟读预约的用户id显示预约信息
router.get('/getwashByUserId',(req,resp,next)=>{
    let {user_id,pno,count} = req.query
    console.log(req.query)
    user_id=parseInt( user_id)
    let sql='select * from wash,petshop where wash.petshop_id= petshop.petshop_id and wash.user_id =? limit ?,? ;select count(*) as pageCount from wash where user_id =?'
    pool.query(sql, [user_id,(pno-1) * count,+ count,user_id], (err, r) => {
        if(err){
          return next(err)
        }
        let {pageCount} = r[1][0]
        pageCount = Math.ceil(pageCount / count)
        resp.send({code:200,msg:'成功',data:{data:r[0],pageCount:pageCount}})
      });
})

//宠物店根据预约宠物店id显示预约
router.get('/getwashByPetshopId',(req,resp,next)=>{
  let {petshop_id,pno,count} = req.query
  console.log(req.query)
  petshop_id=parseInt( petshop_id)
  let sql='select * from wash ,user where wash.user_id=user.user_id and wash.petshop_id =? limit ?,? ;select count(*) as pageCount from wash where petshop_id =?'
  pool.query(sql, [petshop_id,(pno-1) * count,+ count,petshop_id], (err, r) => {
      if(err){
        return next(err)
      }
      let {pageCount} = r[1][0]
      pageCount = Math.ceil(pageCount / count)
      resp.send({code:200,msg:'成功',data:{data:r[0],pageCount:pageCount}})
    });
})
//宠物店上架洗护套餐
router.post('/addwashType',(req,resp,next)=>{
  let {type_name,price,petshop_id}=req.body
  let sql = 'insert into washtype(type_name,price,petshop_id) values(?,?,?)'
  pool.query(sql, [type_name,price,petshop_id], (err, r) => {
    if(err){
      return next(err)
    }
    resp.send({code: 200, msg: '新增套餐成功'})
  });
})


// router.post('/add/',(req,res,next)=>{
//     let{science_title,science_img,science_content} = req.body
//     // 表单验证
//     let schema = Joi.object({
//       science_title: Joi.string().required(), // 必填
//       science_img: Joi.string().required(), // 必填
//       science_content: Joi.string().required()
//     });
//     let { error, value } = schema.validate(req.body);
//     if (error) {
//       res.send(Response.error(400, error));
//       return; // 结束
//     }
//     let sql = "insert into science(science_title,science_img,science_content) values(?,?,?)";
//     pool.query(sql, [science_title,science_img,science_content], (err, r) => {
//       if(err){
//         return next(err)
//       }
//       res.send({code: 200, msg: '新增成功'})
//     });
// })
module.exports = router