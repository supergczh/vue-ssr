const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge=require('webpack-merge')
const baseConfig=require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

let config

const devServer={
  port: 8112,
  host: '0.0.0.0',
  overlay: {
     errors:true
  },
  open:true,
  hot: true
}

if(isDev) {  //开发环境
   config=merge(baseConfig,{
     devtool = '#cheap-module-eval-source-map',
     module:{
       rules:[
          {
            test: /\.styl/,
            use:[
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap:true
                    }
                },
                'stylus-loader'
            ]
          }
       ]
     },
     devServer,
     plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
     ]
   })
    
  
}else{
  config.merge(baseConfig,{
        entry :{
          app: path.join(__dirname, 'src/index.js'),
          vendor: ['vue']
      },
      output:{
         filename: '[name].[chunkhash:8].js'
      },
      module:{
        rules:[
          {
            test: /\.styl/,
            use:ExtractPlugin.extract({
                fallback: 'style-loader',
                use:[
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap:true
                        }
                    },
                    'stylus-loader'
                ]
            })
        }
        ]
      },
      plugins:[
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        })
      ]
       
  })  
}

module.exports = config