// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  lintOnSave: false,
  publicPath: '', // assets relative to index.html - and no html5history router
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
  configureWebpack: {
    plugins: [
      new MonacoEditorPlugin({
        // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        // Include a subset of languages support
        // Some language extensions like typescript are so huge that may impact build performance
        // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
        // Languages are loaded on demand at runtime
        languages: ['json', 'typescript'],
      }),
    ],
  },
}
