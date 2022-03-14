// webpack.config.js
const Encore                    = require('@symfony/webpack-encore');
const path                      = require('path');

// define project to build
let _project = {
    type: 'typo3',
    template: 'sf_seolighthouse'
};

// require config file
let _config = require('./webpack/config');
let plugins = require('./webpack/plugins');

//Plugins
const TerserPlugin              = require('terser-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin   = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin        = require('css-minimizer-webpack-plugin');
const PurgeCssPlugin            = require('purgecss-webpack-plugin');
const GoogleFontsPlugin         = require('@beyonk/google-fonts-webpack-plugin');
const { merge }                 = require('webpack-merge');
const CircularDependencyPlugin  = require('circular-dependency-plugin');
const CopyPlugin                = require("copy-webpack-plugin");

// replacing parts of config.json
if (_project.type === 'typo3') {
  _config.typo3.webpack.paths.public = '/typo3conf/ext/' + _project.template + '/Resources/Public';
}

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}


Encore

  .addEntry('request', './Assets/Scripts/request.js')
  .addEntry('list', './Assets/Scripts/list.js')
  .addEntry('charts', './Assets/Scripts/charts.js')

  .splitEntryChunks()

  // .addEntry('blogPosts', './resources/assets/js/entries/blogPosts.ts')
  // .addEntry('profile', './resources/assets/js/entries/profile.ts')
  .enableSingleRuntimeChunk()
  .enableVersioning(Encore.isProduction())
  .enableIntegrityHashes(Encore.isProduction())
  .configureSplitChunks(() => ({
    name: 'vendor_app',
    chunks: 'all',
    minChunks: 2,
    chunks: 'async',
  }))

  // Directory where compiled assets will be stored.
  .setOutputPath(_config[_project.type].webpack.paths.output)

  // Public path used by the web server to access the output path.
  .setPublicPath(_config[_project.type].webpack.paths.public)

  .setManifestKeyPrefix(_config[_project.type].webpack.paths.manifest)
  
  // add hash to generated files
  .configureFilenames({
    js: _config[_project.type].paths.public.javascripts + '[name].js',
    css: _config[_project.type].paths.public.stylesheets + '[name].css',
  })

  .configureImageRule({
    filename: _config[_project.type].paths.public.images + '[name][ext]'
  })

  .configureFontRule({
    filename: _config[_project.type].paths.public.fonts + '[name][ext]'
  })

  .configureFriendlyErrorsPlugin()
  // uncomment if you use TypeScript
  //.enableTypeScriptLoader()
  //.enableHandlebarsLoader()
  //.enableForkedTypeScriptTypesChecking()

  //.addStyleEntry('styles', _config[_project.type].paths.public.stylesheets + 'app.css')

  //.enableVersioning()
  //.configureWatchOptions((watchOptions) => {
  //    watchOptions.poll = 250; 
  //})

  .configureTerserPlugin((options) => { 
    options.cache = true; 
    options.terserOptions = { 
    output: { 
      comments: false 
      } 
    } 
  }) 

  .enableSassLoader()
  //.autoProvidejQuery()
  // will require an extra script tag for runtime.js
  // but, you probably want this, unless you're building a single-page app

  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())

  // enables hashed filenames (e.g. app.abc123.css)
  .enableVersioning(Encore.isProduction())

  //enable postcss loader
  .enablePostCssLoader((options) => {
    options.postcssOptions = {
      options: {
        sourceMap: 'inline',
      },
      plugins: {
        // include whatever plugins you want
        // but make sure you install these via yarn or npm!
        // add browserslist config to package.json (see below)
        autoprefixer: {},

        // inline-svg
        'postcss-inline-svg': {},

        // svgo
        'postcss-svgo': {},

        // preset-env
        'postcss-preset-env': {},

        // pxtorem
        'postcss-pxtorem': {
          rootValue: 16,
          propList: ['*'],
        },
      },
    };
  })

  .addAliases({
      '@style': path.resolve('./packages/' + _project.template + '/Resources/Public/')
  })

  /*.addPlugin(new GoogleFontsPlugin({
      formats: ['woff2'],
      fonts: [
          { family: 'Roboto', variants: ['regular', '700', '300']  },
      ]
  }))*/

  .addPlugin(plugins.StyleLintPlugin)
  
  .copyFiles(_config[_project.type].copyFiles)
  .copyFiles({
    from: './Assets/Images/',
    
    //optional target path, relative to the output dir
    to: 'Images/[path][name].[ext]',
    
    // if versioning is enabled, add the file hash too
    //to: 'images/[path][name].[hash:8].[ext]',
    
    // only copy files matching this pattern
    pattern: /\.(png|jpg|jpeg|svg|webp|gif)$/
    }
  );

Encore.addLoader({
  test: /\.ts$/,
  enforce: 'pre',
  loader: 'eslint-loader',
  exclude: path.resolve(__dirname, 'node_modules/'),
  options: {
    fix: true,
  },
});

// if (!Encore.isProduction()) {
//   Encore.addLoader({
//       test: [/\.ts$/],
//       enforce: 'pre',
//       loader: 'prettier-loader',
//       exclude: path.resolve(__dirname, 'node_modules/'),
//       options: {
//           parser: 'prettierx-typescript',
//           semi: true,
//           trailingComma: 'all',
//           singleQuote: true,
//           printWidth: 120,
//           tabWidth: 4,
//           spaceBeforeFunctionParen: true,
//       },
//   });
//   Encore.addLoader({
//       test: [/\.js$/],
//       enforce: 'pre',
//       loader: 'prettier-loader',
//       exclude: path.resolve(__dirname, 'node_modules/'),
//       options: {
//           parser: 'prettierx-babel',
//           semi: true,
//           trailingComma: 'all',
//           singleQuote: true,
//           printWidth: 120,
//           tabWidth: 4,
//           spaceBeforeFunctionParen: true,
//       },
//   });
// }

/*if (!Encore.isProduction()) {
  Encore.addLoader({
      test: /\.(scss|css)$/,
      use: [
          MiniCssExtractPlugin.loader,
          {
              loader: 'css-loader',
              options: {
                  sourceMap: !Encore.isProduction(),
              },
          },
          {
              loader: 'sass-loader',
              options: {
                  sourceMap: !Encore.isProduction(),
              },
          },
      ],
  });
} else {
  const postcssLoaderOptions = {
      autoprefixer: {
          browsers: ['last 2 versions'],
      },
      plugins: () => [autoprefixer],
      sourceMap: !Encore.isProduction,
  };
  Encore.addLoader({
      test: /\.(scss|css)$/,
      use: [
          MiniCssExtractPlugin.loader,
          {
              loader: 'css-loader',
              options: {
                  sourceMap: !Encore.isProduction(),
              },
          },
          {
              loader: 'postcss-loader',
              options: postcssLoaderOptions,
          },
          {
              loader: 'sass-loader',
              options: {
                  sourceMap: !Encore.isProduction(),
              },
          },
      ],
  });
  // Encore.enablePostCssLoader();
}*/

/*if (!Encore.isProduction()) {
  Encore.addPlugin(
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  );
}*/

// Uncomment only when generating static site for above the fold CSS (critical CSS).
// if (!Encore.isProduction()) {
//     Encore.addPlugin(
//         new HtmlCriticalWebpackPlugin({
//             base: path.resolve(__dirname, 'public'),
//             src: 'static_home.html',
//             dest: 'optimized_home.html',
//             inline: true,
//             minify: true,
//             extract: true,
//             width: 375,
//             height: 565,
//             penthouse: {
//                 blockJSRequests: false,
//                 timeout: 99999,
//             },
//         }),
//     );
// }

if (Encore.isProduction()) {
  Encore.cleanupOutputBeforeBuild();
}

Encore.copyFiles({
  from: './Assets/Images',
  to: 'Images/[path][name].[ext]',
  pattern: /\.(png|jpg|jpeg|gif|svg)/,
});

if (Encore.isProduction()) {
  Encore.addPlugin(
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.(c|s[ac])ss$/,
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
                removeAll: true, // remove any comments?
            },
          },
        ],
      },
      canPrint: true,
    }),
  );
}

Encore.addPlugin(
  new TerserPlugin({
    extractComments: "all",
    terserOptions: {
      sourceMap: !Encore.isProduction(),
      //cache: !Encore.isProduction(),
      //parallel: true,
      output: {
        comments: false,
      },
    },
  }),
);

if(Encore.isProduction()) {
  Encore.addPlugin(
    new PurgeCssPlugin({
      // folders: ['resources/views/**/*', 'resources/assets/scss/'],
      paths: glob.sync([path.join(__dirname, 'resources/views/**/*/*.blade.php')]),
      whitelist: cssWhitelist,
      // This is a tough task - any classes that aren't present in the view files (eg. added by JS) need to be whitelisted here
      // It's not an easy or quick thing to do  - requires THOROUGH testing for any missing CSS classes.
      // I recommend to turn it off and only use it manually after major updates are done in styling 
      whitelistPatterns: [
        /icon$/,
        /primary$/,
        /info$/,
        /success$/,
        /danger$/,
        /swiper\-w+/,
        /slide$/,
        /popover\-\w+/,
        /tooltip\-\w+/,
        /lb\-\w+/,
        /ui\-\w+/,
      ],
    }),
  );
}
//Encore.configureOptimizeCssPlugin().enableSourceMaps(!Encore.isProduction());
Encore.enableSourceMaps(true);

Encore.configureBabel(
  babelConfig => {
    // add additional presets (preset-env is added by default)
    //babelConfig.presets.push('@babel/preset-flow');
    // IE11/Edge requires below plugins
    //babelConfig.plugins.push('@babel/plugin-transform-object-assign');
    babelConfig.plugins.push('@babel/plugin-transform-spread');
    babelConfig.plugins.push('@babel/plugin-transform-exponentiation-operator');
    babelConfig.plugins.push('@babel/plugin-transform-arrow-functions');
    babelConfig.plugins.push('@babel/plugin-proposal-object-rest-spread');
    babelConfig.plugins.push('@babel/plugin-proposal-class-properties');
    // no plugins are added by default, but you can add some
    // babelConfig.plugins.push('styled-jsx/babel');
    // if (Encore.isProduction()) {
    //     babelConfig.plugins.push('transform-remove-console');
    // }
  },
  {
    // node_modules is not processed through Babel by default
    // but you can whitelist specific modules to process
    //includeNodeModules: includedNodeModules,
    useBuiltIns: 'usage',
    corejs: {
        version: 3.2,
        proposals: true,
    },
    // or completely control the exclude rule (note that you
    // can't use both 'include_node_modules' and 'exclude' at
    // the same time)
    // exclude: /bower_components/
  },
);

// Retrieve the config
const config = Encore.getWebpackConfig();

if (Encore.isProduction()) {
  config.devtool = 'source-map';
} else {
  Encore.addLoader({
    test: [/\.ts$/, /\.scss/],
    use: ['cache-loader', 'babel-loader'],
    include: [path.resolve('Assets/**/*'), path.resolve('node_modules')],
  });
  // Change the kind of source map generated in development mode
  config.devtool = 'inline-source-map';
  // USE cheap for Debugging in Chrome - awesome feature - you can put breakpoint in your PhpStorm/Vscode/whatever and browser will stop executing on it! Just like in PHP
  // config.devtool = 'cheap-module-eval-source-map';
  //
  config.optimization.minimize = false;

  //Use below options when you need to debug webpack build
  config.stats = {
    // assets: true,
    // builtAt: true,
    cachedAssets: true,
    errors: true,
    errorDetails: true,
    // reasons: true,
    timings: true,
    // warnings: true,
  };

//   config.devServer = {
//       host: 'app.local',
//       port: 9000,
//       hot: true,
//       index: 'public/index.php',
//       liveReload: true,
//       historyApiFallback: true,
//       disableHostCheck: true,
//       public: 'app.local',
//       allowedHosts: ['app.local'],
//       contentBase: path.join(__dirname, 'public'),
//       watchContentBase: true,
//       watchOptions: {
//           aggregateTimeout: 3500,
//       },
//       proxy: {
//           '*': {
//               target: 'http://app.local:80',
//           },
//       },
//   };
  
//   config.node = {
//       global: true,
//       fs: 'empty',
//       // Fix: "Uncaught ReferenceError: global is not defined", and "Can't resolve 'fs'".
//       // output: {
//       //     libraryTarget: 'umd', // Fix: "Uncaught ReferenceError: exports is not defined".
//       // },
//   };
}

module.exports = Encore.getWebpackConfig();