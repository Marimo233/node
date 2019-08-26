const Koa=require('koa')
const Router=require('koa-router')
const Querystring=require('querystring')
const Http=require("http")
const router=new Router()
const app=new Koa()
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Order',{useNewUrlParser:true})
//用户模型
const userModule=mongoose.model('user',{admin:0,phone:String,name:'',breakfast:[{kind:String,price:Number}],dinner:[{kind:String,price:Number}]})
//早餐模型
const breakfastModule=mongoose.model('breakfast',{title:String,price:String})
//晚餐模型
dinnerSchema=new mongoose.Schema({title:String,price:String})
const DinnerModule=mongoose.model('dinner',dinnerSchema)
app.use(bodyParser())
//保存提交的种类
router.post('/submitKind',async (ctx,next)=>{
  let {breakfast,dinner}=ctx.request.body
  // 保存早餐
  const breRes=await breakfastModule.insertMany(breakfast)
  // 保存晚餐
  const dinRes=await DinnerModule.insertMany(dinner)
  ctx.response.body={
    code:'0',
    mesage:'保存成功'
  }
})
//保存或更新用户提交
router.post('/submitUser',async (ctx,next)=>{
  let {breakfast,dinner,name,phone}=ctx.request.body
  const User=new userModule('user',{admin:0,phone,name,breakfast,dinner})
  const UserRes=await User.save()
  ctx.response.body=UserRes
})
//用户登录
router.post('/login',async (ctx,next)=>{
  let {name,phone}=ctx.request.body
  
})
//获取菜单
router.get('/breakfast',async (ctx,next)=>{
  let baseData=''
  const res=await breakfastModule.find((err,docs)=>{
    console.log(err)
    baseData=docs
  })
  let data=baseData.map((item)=>{
    return {id:item._id,title:item.title,price:item.price}
  })
  ctx.response.body={
    code:0,
    data
  }
})
router.get('/dinner',async (ctx,next)=>{
  let data=''
  const res=await DinnerModule.find((err,docs)=>{
    console.log(err)
    data=docs
  })
  ctx.response.body={
    code:0,
    data
  }
  
})
app.use(router.routes()).listen(8000,()=>[
      console.log('running')
    ])


