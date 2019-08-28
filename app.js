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
const userModule=mongoose.model('user',{admin:0,phone:String,name:'',breakfast:[{title:String,number:String,}],dinner:[{title:String,number:String}]})
//早餐模型
const breakfastModule=mongoose.model('breakfast',{title:String,price:String})
//晚餐模型
dinnerSchema=new mongoose.Schema({title:String,price:String})
const dinnerModule=mongoose.model('dinner',dinnerSchema)
app.use(bodyParser())
//查找相同
const find= async(ctx,next)=>{
  let {breakfast,dinner}=ctx.request.body
  let breakfastData=[],dinnerData=[];
  await Promise.all( breakfast.map(async (item)=>{
    await breakfastModule.find({title:item.title},(err,doc)=>{
      if(doc.length!==0){
        breakfastData.push(doc)
      }
    })
  }))
  await Promise.all( dinner.map(async (item)=>{
    await dinnerModule.find({title:item.title},(err,doc)=>{
      if(doc.length!==0){
        dinnerData.push(doc)
      }
    })
  }))
  if(breakfastData.length===0&&dinnerData.length===0){
    await next()
  }else{
    let breakfastTitle=[];
    breakfastData.length!==0&&breakfastData.map((item)=>{
      if(item[0]&&breakfastTitle.indexOf(item[0].title)===-1){
        breakfastTitle.push(item[0].title)
      }
    })
    let dinnerTitle=[];
    dinner.length!==0&&dinnerData.map((item)=>{
      if(item[0]&&dinnerTitle.indexOf(item[0].title)===-1){
        dinnerTitle.push(item[0].title)
      }
    })
    ctx.response.body={
      code:1,
      data:{
        breakfastTitle,
        dinnerTitle
      }
    }
  }
}

//保存提交的种类
router.post('/submitKind',find,async (ctx,next)=>{
  let {breakfast,dinner}=ctx.request.body
  await breakfastModule.insertMany(breakfast)
  await dinnerModule.insertMany(dinner)
  ctx.response.body={
    code:0,
    mesage:'保存成功'
  }
})
//更改提交的种类
router.post('/updateKind',async (ctx,next)=>{
  let breakfastData=[],dinnerData=[];
  const {breakfast,dinner}=ctx.request.body
  await Promise.all( breakfast.map(async (item)=>{
    await breakfastModule.update({title:item.title},{price:item.price},(err,doc)=>{
        breakfastData.push(doc)
      
    })
  }))
  await Promise.all( dinner.map(async (item)=>{
    await dinnerModule.update({title:item.title},{price:item.price},(err,doc)=>{
        dinnerData.push(doc)
    })
  }))
  let errorData=breakfastData.filter((item)=>item.ok!==1).concat(dinnerData.filter((item)=>item.ok!==1))
  if(!errorData.length){
    ctx.response.body={
      code:0,
      data:''
    }
  }else{
    ctx.response.body={
      code:2,
      data:errorData
    }
  }
  
})
//删除提交的种类
router.post('/deleteKind',async (ctx,next)=>{
  let breakfastData=[],dinnerData=[];
  const {breakfast,dinner}=ctx.request.body
  await Promise.all( breakfast.map(async (item)=>{
    await breakfastModule.remove({title:item.title},(err,doc)=>{
        breakfastData.push(doc)
      
    })
  }))
  await Promise.all( dinner.map(async (item)=>{
    await dinnerModule.remove({title:item.title},(err,doc)=>{
        dinnerData.push(doc)
    })
  }))
  let errorData=breakfastData.filter((item)=>item.ok!==1).concat(dinnerData.filter((item)=>item.ok!==1))
  if(!errorData.length){
    ctx.response.body={
      code:0,
      data:''
    }
  }else{
    ctx.response.body={
      code:2,
      data:errorData
    }
  }
})
//保存用户提交
router.post('/submitUser',async (ctx,next)=>{
  let {breakfast,dinner,name,phone}=ctx.request.body;
  let docs=[]
  //查找是否存在该用户
  await userModule.find({phone},(err,doc)=>{
    docs=doc
  })
  if(docs.length!==0){
    await userModule.update({phone},{breakfast,dinner})
  }else{
    const User=new userModule({admin:0,phone,name,breakfast,dinner})
    await User.save()
  }
  ctx.response.body={
    code:0,
    data:''
  }
})
//查找用户
router.get('/person',async (ctx,next)=>{
  let docs=[]
  await userModule.find((err,doc)=>{
    docs=doc
  })
  docs=docs.map((item)=>{
    const {phone,name,dinner,breakfast}=item
    return {id:item._id,phone,name,dinner,breakfast}
  })
  ctx.response.body={
    code:0,
    data:docs
  }
})
//获取菜单
router.get('/breakfast',async (ctx,next)=>{
  let baseData=[]
  await breakfastModule.find((err,docs)=>{
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
  let baseData=''
  const res=await dinnerModule.find((err,docs)=>{
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
//登录
router.get('/login',async (ctx,next)=>{
  const {phone}=ctx.request.query
  ctx.response.body={
    code:0,
    admin:["18328069571","15108294327"].includes(phone)?1:0
  }
})
//清空订单
router.get('/deleteOrders',async (ctx,next)=>{
  await userModule.remove((err,doc)=>{
    if(doc.ok===1){
      ctx.response.body={
        code:0,
        data:''
      }
    }else{
      ctx.response.body={
        code:2,
        data:''
      }
    }
  })
  
})
app.use(router.routes()).listen(8000,()=>[
      console.log('running')
    ])


