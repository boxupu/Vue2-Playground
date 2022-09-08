const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const htmlPlugin = new HtmlWebpackPlugin({
  template:'./index.html',
  filename:'index.html'
})

module.exports = {
  mode:'development',
  entry:path.join(__dirname,'./src/main.js'),
  output:{
    path:path.join(__dirname,'./lib'),
    filename:'lucid-playground.js',
    clean: true,
    library: {
      name: 'LucidPlayground', // library name
      type: 'umd' // umd, var, this, commonjs, commonjs2, amd, system
    },
    libraryExport: 'default'
  },
  stats: 'errors-only',
  module:{
    rules:[
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.s[ac]ss$|\.css/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$|jsx/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'app')],
    extensions: ['.js', '.json', '.jsx', '.css', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./public/index.html',
      filename:'index.html'
    }),
    new VueLoaderPlugin()
  ]
}