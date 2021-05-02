module.exports = {
  lintOnSave: false,
  css: {
    sourceMap: true,
    loaderOptions: {
      scss: {
        webpackImporter: false,
        sassOptions: {
          includePaths: ['node_modules'],
        },
      },
    },
  },
}
