const { merge } = require('webpack-merge')  
const Common = require('./webpack.config.js')

module.exports = merge(Common, {  
  mode: 'development'
})