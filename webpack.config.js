/**
 * @file Webpack configuration
 *
 * Written in ES5 since it's interpreted in Node.js
 */

/* Node.js core dependencies */
var path = require('path')

/* Dependencies installed using NPM */
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')

/* Check if we're in a development environment */
var dev = process.env.NODE_ENV !== 'production'

/* The CSS text extractor */
var cssExtractor = new ExtractTextPlugin('[name].css')
var htmlExtractor = new ExtractTextPlugin('[name].html')

/* Later passed to `module.exports` */
var plugins = [ cssExtractor, htmlExtractor ]
/* In a production environment */
if (!dev) {
  /* Add uglify all JS */
  plugins.push(new webpack.optimize.UglifyJsPlugin())
  /* Deduplicate the scripts */
  plugins.push(new webpack.optimize.DedupePlugin())
}

/* Avoid repetition */
var sourcePath = path.resolve(__dirname, 'src')

/*
 * Webpack will require this module by default and expects it to export a module
 * In the following line we can actually see, that NPM actually doesn't use commonJS
 * style, but a sort of super set of it. CommonJS doesn't define a `module` variable
 * that contains the exports, but just an exports object passed to a module. So in
 * commonJS you can't export just an object or a function but you have to define
 * properties of the `exports` variable one by one.
 */
module.exports = {
  /* Entry defines which webpack should load */
  entry: {
    /*
     * The key is the name of the entry point, if you define a directory as an entry
     * point, it will try to load the `index.js` module.
     */
    main: './src'
  },

  /* Output defines where webpack should put the compiled files */
  output: {
    /* The name of the output CSS. [name] is replaced with the key of the entrypoint */
    filename: '[name].js',
    /* Directory to store the output in. Use path.resolve for cross-OS compatibility */
    path: path.resolve(__dirname, 'dist')
  },

  /* Options affecting modules */
  module: {
    /* Modules to pass code through */
    loaders: [
      {
        /* A regexp to match the filepath of required files against */
        test: /\.js$/,
        /* Required files inside this directory may use this loader */
        include: [ sourcePath ],
        /*
         * The loader-string. Quiet an odd construct read more here:
         * http://webpack.github.io/docs/using-loaders.html
         */
        loader: 'babel?presets[]=es2015'
      },

      {
        /* The SCSS loader */
        test: /\.scss$/,
        include: [ sourcePath ],
        /*
         * The loader itself is a bit more complex.
         * Mostly because we are combining serveral differen loaders.
         * Here is where webpack shines the most. Though since we are
         * using the extract-text-plugin, the syntax for combining
         * loaders is a littel different.
         *
         * Ass always with webpack loaders, code is piped through them
         * in reverse order. So here, the `style-loader` will be called
         * last.
         */
        loader: cssExtractor.extract([
          /*
           * The `css-loader` is another loader written by the webpack
           * core team. It has various features:
           *
           * * It compiles assets requested using `url()` directly
           *   into CSS (turned off using `-url`)
           * * Sourcemaps (Controlled globally using the `devtool`
           *   property)
           * * Minification (`minimize`)
           * *
           * * [And more](https://github.com/webpack/css-loader)
           */
          dev
            ? 'css?-minimize&-url'
            : 'css?minimize&-url',
          /*
           * Right after the SCSS has been compiled to CSS, its piped
           * through the `postcss-loader`. PostCSS defines a plugin
           * system, by which simple JS plugins can manipulate CSS
           * as AST-like structures.
           *
           * The actual PostCSS plugins are set near the end of the
           * file with the `postcss` property.
           */
          'postcss',
          /*
           * The Sass loader uses `node-sass` which in turn uses
           * libsass
           */
          'sass'
        ])
      },
      /* Pug compilation */
      {
        test: /\.pug$/,
        include: [ sourcePath ],
        loader: htmlExtractor.extract('pug-html')
      }
    ]
  },

  devtool: dev
    ? '#source-map'
    : '',

  /* Plugins modify to behaviour of webpack itself */
  plugins: plugins,

  /* Set autoprefixer for postcss */
  postcss: function () { return [ autoprefixer ] }
}

