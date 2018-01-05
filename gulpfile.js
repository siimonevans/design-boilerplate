const assemble = require('fabricator-assemble');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const cssnano = require('gulp-cssnano');
const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const notifier = require('node-notifier');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');

const reload = browserSync.reload;

// configuration
const config = {
  templates: {
    src: ['src/templates/**/*', '!src/templates/+(layouts|components)/**'],
    dest: 'dist',
    watch: ['src/templates/**/*', 'src/data/**/*.json'],
    layouts: 'src/templates/layouts/*',
    partials: ['src/templates/components/**/*'],
    data: 'src/data/**/*.{json,yml}',
  },
  scripts: {
    src: './src/assets/scripts/main.js',
    dest: 'dist/assets/scripts',
    watch: 'src/assets/scripts/**/*',
  },
  styles: {
    src: 'src/assets/styles/main.scss',
    dest: 'dist/assets/styles',
    watch: 'src/assets/styles/**/*',
    browsers: ['last 1 version'],
  },
  images: {
    src: 'src/assets/images/**/*',
    dest: 'dist/assets/images',
    watch: 'src/assets/images/**/*',
  },
  fonts: {
    src: 'src/assets/fonts/**/*',
    dest: 'dist/assets/fonts',
    watch: 'src/assets/fonts/**/*',
  },
  dev: gutil.env.dev,
};

// clean
gulp.task('clean', del.bind(null, ['dist']));

// templates
gulp.task('templates', (done) => {
  assemble({
    layouts: config.templates.layouts,
    views: config.templates.src,
    materials: config.templates.partials,
    data: config.templates.data,
    keys: {
      views: 'templates',
      materials: 'components',
    },
    dest: config.templates.dest,
    logErrors: config.dev,
    helpers: {
      // {{ default description "string of content used if description var is undefined" }}
      default: function defaultFn(...args) {
        return args.find(value => !!value);
      },
      // {{ concat str1 "string 2" }}
      concat: function concat(...args) {
        return args.slice(0, args.length - 1).join('');
      },
      // {{> (dynamicPartial name) }} ---- name = 'nameOfComponent'
      dynamicPartial: function dynamicPartial(name) {
        return name;
      },
      eq: function eq(v1, v2) {
        return v1 === v2;
      },
      ne: function ne(v1, v2) {
        return v1 !== v2;
      },
      and: function and(v1, v2) {
        return v1 && v2;
      },
      or: function or(v1, v2) {
        return v1 || v2;
      },
      not: function not(v1) {
        return !v1;
      },
      gte: function gte(a, b) {
        return +a >= +b;
      },
      lte: function lte(a, b) {
        return +a <= +b;
      },
      plus: function plus(a, b) {
        return +a + +b;
      },
      minus: function minus(a, b) {
        return +a - +b;
      },
      divide: function divide(a, b) {
        return +a / +b;
      },
      multiply: function multiply(a, b) {
        return +a * +b;
      },
      abs: function abs(a) {
        return Math.abs(a);
      },
      mod: function mod(a, b) {
        return +a % +b;
      },
    },
  });
  done();
});

// scripts
const webpackConfig = require('./webpack.config')(config);

gulp.task('scripts', (done) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      gutil.log(gutil.colors.red(err()));
    }
    const result = stats.toJson();
    if (result.errors.length) {
      result.errors.forEach((error) => {
        gutil.log(gutil.colors.red(error));
        notifier.notify({
          title: 'JS Build Error',
          message: error,
        });
      });
    }
    done();
  });
});

// SASS styles
gulp.task('styles', () =>
 gulp.src(config.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: './node_modules',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: config.styles.browsers,
    }))
    .pipe(gulpif(!config.dev, cssnano({ autoprefixer: false })))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.styles.dest))
    .pipe(gulpif(config.dev, reload({ stream: true }))));

// images
gulp.task('images', () =>
  gulp.src(config.images.src)
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest(config.images.dest)));

// fonts
gulp.task('fonts', () =>
  gulp.src(config.fonts.src).pipe(gulp.dest(config.fonts.dest)));

// server
gulp.task('serve', () => {
  browserSync({
    server: {
      baseDir: config.templates.dest,
    },
    notify: false,
    logPrefix: 'BrowserSync',
  });

  gulp.task('templates:watch', ['templates'], reload);
  gulp.watch(config.templates.watch, ['templates:watch']);
  gulp.task('styles:watch', ['styles']);
  gulp.watch(config.styles.watch, ['styles:watch']);
  gulp.task('scripts:watch', ['scripts'], reload);
  gulp.watch(config.scripts.watch, ['scripts:watch']);
  gulp.task('images:watch', ['images'], reload);
  gulp.watch(config.images.watch, ['images:watch']);
  gulp.task('fonts:watch', ['fonts'], reload);
  gulp.watch(config.fonts.watch, ['fonts:watch']);
});

// default build task
gulp.task('default', ['clean'], () => {
  const tasks = [
    'templates',
    'scripts',
    'styles',
    'images',
    'fonts',
  ];

  // run build
  runSequence(tasks, () => {
    if (config.dev) {
      gulp.start('serve');
    }
  });
});
