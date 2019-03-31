'use strict';

const gulp = require('gulp'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  browserSync = require("browser-sync"),
  del = require('del'),
  concat = require('gulp-concat'),
  gulpCopy = require('gulp-copy'),
  reload = browserSync.reload;

const path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: './build/',
    css: './build/css/',
    img: './build/img/',
    fonts: './build/fonts/'
  },
  src: { //Пути откуда брать исходники
    html: './src/index.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    style: './src/styles/**/*.scss',
    img: './src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    fonts: './src/fonts/**/*.*'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: './src/**/*.html',
    style: './src/styles/**/*.scss',
    img: './src/img/**/*.*',
    fonts: './src/fonts/**/*.*'
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

const buildImg = ()=> {
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

const copyFonts = () => {
  return gulp.src(path.src.fonts)
    .pipe(gulpCopy('.'))
    .pipe(gulp.dest(path.build.fonts));
};

const watcher = ()=> {
  gulp.watch(path.watch.html, buildHtml );
  gulp.watch(path.watch.style, buildStyle);
  gulp.watch(path.watch.img, buildImg);
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


const build = gulp.series(clean, gulp.parallel(buildHtml, buildImg, buildStyle, copyFonts), webserver, watcher);
module.exports.default = build;