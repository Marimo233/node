module.exports=()=>{
  return async (ctx,next)=>{
    if(ctx.state.user.name==='admin'){
      next()
    } else {
      ctx.body={
        code:'-1',
        message:'Not Admin'
      }
    }
}
}