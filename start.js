require('babel-resister')({
  plugins:['babel-plugin-transform-es2015-modules-commonjs']
})
module.exports=require('./app.js')