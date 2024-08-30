const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({

  transpileDependencies: true,
  devServer:{
    port: 5173
  },
  lintOnSave: false,
  chainWebpack: config =>{
    config.plugin('html')
        .tap(args => {
          args[0].title = "Lucky Baby";
          return args;
        })
  }
})
