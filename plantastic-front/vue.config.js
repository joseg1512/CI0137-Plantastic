const { defineConfig } = require('@vue/cli-service')

const API_URL = process.env.VUE_APP_API_URL || 'https://ci0137-plantastic-production.up.railway.app'

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Plantastic'
      return args
    })
  }
})
