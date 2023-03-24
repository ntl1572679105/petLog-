const express = require('express')
//解决跨域问题
const cors = require('cors')
const pool = require('./pool')
const app = express()
app.use(cors({
    origin: '*'
}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ code: 500, msg: '服务器端错误' })
})
// 使用路由
const loginRouter = require('./router/login')
const registerRouter = require('./router/register')
const commentRouter = require('./router/comment')
const petshopRouter = require('./router/petshop')

//解决跨域
app.use(express.urlencoded({
    extended: true
}))
//使用路由器
app.use('/user/login', loginRouter)
app.use('/user/register', registerRouter)
app.use('/admin/comment', commentRouter)
app.use('/petshop',petshopRouter)
app.use(express.static('public'))
//报错问题

// 解决post传参

app.listen(3000, () => {
    console.log('服务器启动成功')
})