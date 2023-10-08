const gulp = require('gulp');
const ts = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const  fs = require('fs');

const config = {
  dest: './docs',
  public: './public',
  sassFiles: './src/**/*.scss',
  htmlFiles: './src/**/*.html',
  assersFiles: './src/asserts/**/*',
  tsFiles: './src/**/*.ts',

  astroFiles: './docs/**/*.html',
  astroFilesDest: './public/**/*.html',
  baseUrl: '/exam-test/',
}

// gulp.task('clear', () => {
//   return (gulp.src(config.dest, {read: true, allowEmpty: true})
//     .pipe(clean()));
// });

gulp.task('styles', () => {
  return gulp.src(config.sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(config.public));
});

gulp.task("scripts", () => {
  var tsconfig = require('./tsconfig.json');
  return gulp.src(config.tsFiles)
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(gulp.dest(config.public));
});

gulp.task('watchers-dev', () => {
  gulp.watch([config.sassFiles], gulp.series('styles'));
  gulp.watch([config.tsFiles], gulp.series('scripts'));
  return;
});

gulp.task('rename-folders', (done) => {
  fs.rename('./docs/_astro', './docs/styles', (err) => {
    if (err) {
      throw err;
    }
    done();
  });
});

gulp.task('update-references-styles', () => {
  return gulp.src('./docs/**/*.html', {base: './'})
    .pipe(replace('href="/_astro/', 'href="/styles/'))
    .pipe(gulp.dest('./'));
});

gulp.task('update-references-css', () => {
  return gulp.src('./docs/**/*.html', {base: './'})
    .pipe(replace(/href="\/exam-test\/(styles|_astro)\/[\S]*.css"/g, 'href="/exam-test/main.css"'))
    .pipe(gulp.dest('./'));
});

gulp.task('update-references-scrpts', () => {
  return gulp.src('./docs/**/*.html', {base: './'})
    .pipe(replace(/src="\/exam-test\/(styles|_astro)\/"/g, 'src="/exam-test/styles/"'))
    .pipe(gulp.dest('./'));
});

gulp.task('prepare-deploy', 
  gulp.series('rename-folders', 'update-references-css', 'update-references-styles'));

gulp.task('build', 
  gulp.series('styles'));

gulp.task('dev', 
  gulp.series('build', 'watchers-dev' ));
