'use strict';

const gulp = require('gulp'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  svgmin = require('gulp-svgmin'),
  pngquant = require('imagemin-pngquant'),
  browserSync = require("browser-sync"),
  del = require('del'),
  concat = require('gulp-concat'),
  minify = require('gulp-minify'),
  reload = browserSync.reload;

const path = {
  build: {
    html: './build/',
    css: './build/css/',
    img: './build/img/',
    fonts: './build/fonts/',
    js: './build/js/'
  },
  src: {
    html: './src/index.html',
    style: './src/styles/**/*.scss',
    img: './src/img/**/*.png',
    svg: './src/img/**/*.svg',
    fonts: './src/fonts/**/*.*',
    js: './src/js/**/*.*'
  },
  watch: {
    html: './src/**/*.html',
    style: './src/styles/**/*.scss',
    img: './src/img/**/*.*',
    fonts: './src/fonts/**/*.*',
    js: './src/js/**/*.*'
  },
  clean: './build'
};


const clean = ()=> {
  return del([ 'build' ]);
};

const buildHtml = ()=> {
  return gulp.src(path.src.html) //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
};

const buildStyle = ()=> {
  return gulp.src(path.src.style) //Выберем наш main.scss
    .pipe(sourcemaps.init()) //То же самое что и с js
    .pipe(sass()) //Скомпилируем
    .pipe(prefixer()) //Добавим вендорные префиксы
    .pipe(concat('bundle.css'))
    .pipe(cssmin()) //Сожмем
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css)) //И в build
    .pipe(reload({stream: true}));
};

const buildImg = () => {
  return gulp.src(path.src.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img)) //И бросим в build
    .pipe(reload({stream: true}));
};

const buildSvg = () => {
  return gulp.src(path.src.svg)
    .pipe(svgmin())
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
};

const buildJs = () => {
  return gulp.src(path.src.js)
    .pipe(minify())
    .pipe(gulp.dest(path.build.js));
};

const watcher = ()=> {
  gulp.watch(path.watch.html, buildHtml );
  gulp.watch(path.watch.style, buildStyle);
  gulp.watch(path.watch.img, buildImg);
  gulp.watch(path.watch.js, buildJs);
  return Promise.resolve();
};


const webserver = ()=> {
  browserSync(
     {
      server: {
        baseDir: "./build"
      },
      host: 'localhost',
      port: 3000
    }
  );
  return Promise.resolve();
};


const build = gulp.series(clean, gulp.parallel(buildHtml, buildImg, buildSvg, buildStyle, buildJs), webserver, watcher);
module.exports.default = build;