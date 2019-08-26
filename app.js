const Koa=require('koa')
const Router=require('koa-router')
const Querystring=require('querystring')
const Http=require("http")
const router=new Router()
const app=new Koa()
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Order')
const UserModule=mongoose.model('User',{name:String,password:Number})
app.use(bodyParser())
//增加返回表单页面的路由login
router.get ('/user', async (ctx,next)=>{
  
  const data='<form action="/user/login" method="post"><input name="name" type="text" placeholder=""/><br/><input name="password" type="text" placeholder=""/><br/><button>GOOO</button></form>'
  ctx.response.body=data
})

router.post('/user/login',async (ctx,next)=>{
  let {name,password}=ctx.request.body
  const User=new UserModule({name,password})
  const res=await User.save()
  ctx.response.body=res
})
//处理提交的种类
router.post('/submitkind',async (ctx,next)=>{
  let {breakfast,dinner}=ctx.request.body
  // const User=new UserModule({name,password})
  // const res=await User.save()
  ctx.response.body={breakfast,dinner}
})

    app.use(router.routes()).listen(8000,()=>[
      console.log('running')
    ])


