// generated on 2016-10-19 using generator-webapp 2.2.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const webpackStream = require('webpack-stream');
const runSequence = require('run-sequence');
const ip = require('ip');
const fs = require('fs');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const server = {
  host: ip.address(),
  port: 9000
}

console.log(ip.address());

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
     .pipe(webpackStream({
      devtool: 'source-map',
      module: {
        loaders: [{
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['es2015','stage-2']
          }
        },{
          test: /\.json$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'json'
        }]
      },
      output: {
        path: __dirname + "/",
        filename: "main.js"
      }
    }))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});
function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec'));
});

function nunjucksEnvironment(environment){

   const data = {
    "environments":{
      "dev": `http://${server.host}:${server.port}` ,
      "staging": "",
      "production": ""
    }
  };

  environment.addGlobal('siteUrl', data.environments.dev);

  environment.addFilter('objFromArray', function(arrayOfObjects, key, value){
    return arrayOfObjects.filter( function(item){ if(item[key] == value) return item;})[0];
  });

}

/**
 * Read and parse nunjucks data
 */
function getNunjucksData(file){
  return JSON.parse(fs.readFileSync('./app/data/data.json'));
}


gulp.task('data', () => {
  return gulp.src('./app/data/resources/*.json')
  .pipe($.mergeJson('data.json'))
  .pipe(gulp.dest('./app/data'));
});

gulp.task('templates', ['data'], () => {

  return gulp.src('./app/pages/**/*.+(html|njk)')
    .pipe($.data(getNunjucksData))
    .pipe($.nunjucksRender({
        path: ['./app/templates'],
        manageEnv: nunjucksEnvironment
    }))
    .pipe( gulp.dest('./app/html') );

});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/html/**/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('icons', () =>{
  return gulp.src(['app/svg/icons/**/*.svg'])
    .pipe( $.svgstore())
    .pipe(gulp.dest('app/svg'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    // .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('svg', () => {
  return gulp.src('app/svg/*.svg')
    .pipe(gulp.dest('dist/svg'));
});


gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('json', () => {
  return gulp.src([
    'app/data/**/*.json',
  ], {
    dot: true
  }).pipe(gulp.dest('dist/data'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['templates', 'styles', 'scripts', 'fonts'], () => {
    browserSync({
      notify: false,
      open:'external',
      host: server.address,
      port: server.port,
      server: {
        baseDir: ['.tmp', 'app'],
        middleware: function(req, res, next){
          var file = /([/.\w]+)([.][\w]+)([?][\w./=]+)?/;
          // if not file
          if (! file.test(req.url)){
            if ( req.url === '/' ){
              req.url += 'html/index.html';
            }else{
              if ( req.url[req.url.length-1] === '/' ) req.url = req.url.slice(0,-1)
              req.url = '/html' + req.url + '.html';
            }
          }
          return next();
        },
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/html/**/*',
      'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('app/templates/**/*.+(html|svg|njk)', ['templates']);
    gulp.watch('app/svg/icons/*.svg', ['icons']);
    gulp.watch('app/pages/**/*.njk', ['templates']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    server: {
      baseDir: ['dist'],
      middleware: function(req, res, next){
        var file = /([/.\w]+)([.][\w]+)([?][\w./=]+)?/;
        // if not file
        if (! file.test(req.url)){
          if ( req.url === '/' ){
            req.url += '/index.html';
          }else{
            if ( req.url[req.url.length-1] === '/' ) req.url = req.url.slice(0,-1)
            req.url = '/' + req.url + '.html';
          }
        }
        return next();
      }
    },
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/templates/*.njk')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app/templates'));
});

gulp.task('build', ['templates', 'html', 'images', 'svg', 'fonts', 'extras', 'json'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  runSequence(['clean', 'wiredep'], 'build');
});
