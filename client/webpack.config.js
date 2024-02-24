const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// Added and configured workbox plugins for a service worker and manifest file.
// Added CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    //Entry point for files
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
      database: './src/js/database.js',
      editor: './src/js/editor.js'
    },
    //Output for bundles
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      //Webpack plugin that generates html file and injects bundles 
      new HtmlWebpackPlugin({
        title: 'Just Another Text Editor',
        template: './index.html',
        filename: 'index.html',
      }),

      //Injects custom service worker
      new InjectManifest({
        swSrc: './src-sw.js', 
        swDest: 'service-worker.js', // Output service worker file name
      }),

      //Creates a manifest.json file
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Just Another Text Editor',
        short_name: 'JATE',
        description: 'Text editor to record and edit jottings offline',
        background_color: '#ffffff',
        theme_color: '#000000',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
        
    ],

    module: {
      // CSS loaders
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          //babel-loader enables use of ES6
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime']
            },
          },
        },
        //image-related webpack configuration to handle the logo image
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images',
              },
            },
          ],
        }, 
      ],
    },
  };
};
