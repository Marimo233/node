const Koa=require('koa')
const Router=require('koa-router')
const Querystring=require('querystring')
const Http=require("http")
const router=new Router()
const app=new Koa()
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

//增加返回表单页面的路由
router.get ('/user', async (ctx,next)=>{
  
  const data='<form action="/user/login" method="post"><input name="name" type="text" placeholder=""/><br/><input name="password" type="text" placeholder=""/><br/><button>GOOO</button></form>'
  ctx.response.body=data
})

router.post('/user/login',(ctx,next)=>{
  let {name,password}=ctx.request.body
  if(name==='a'&&password==='1'){
    ctx.response.body='hello'
  }else{
    ctx.response.body='error'
  }
  // console.log(ctx.request.body)
})

    app.use(router.routes()).listen(8000,()=>[
      console.log('running')
    ])
