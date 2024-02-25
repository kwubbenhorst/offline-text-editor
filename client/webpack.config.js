// This webpack configuration file bundles and optimizes the client-side code in the application.
// It specifies entry points, output configurations, plugins for HTML generation, PWA manifest creation, and Workbox service worker injection, and includes loaders for CSS and Babel to enhance the build process.
// There was source-code given for this file, but the workbox plugin configurations for a service worker and manifest file were added by me.
// The service worker is what allows for offline functionality. Entry points for database and editor are what allow for compiling of these files into the distribution bundle. The webmanifest is also injected here -- satisfying one of the three criteria making this a PWA application.
// I also did the addition of the CSS loaders and babel to webpack. Babel is what allows for the use of next-gen JavaScript. 

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

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
