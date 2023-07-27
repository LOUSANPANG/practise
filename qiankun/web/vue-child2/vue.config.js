module.exports = {
  publicPath: '//localhost:3002',
  devServer: {
    port: 3002,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },

  configureWebpack:  {
      output: {
        library: 'vue2',
      libraryTarget: 'umd'
      }
  }
}
