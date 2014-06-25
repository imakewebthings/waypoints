var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync')
var prefix = require('gulp-autoprefixer')
var spawn = require('child_process').spawn

gulp.task('jekyll-build', function (done) {
  browserSync.notify('<b style="color:rebeccapurple">Jekyll Building</b>')
  return spawn('jekyll', ['build'], {
    stdio: 'inherit'
  }).on('close', done)
})

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload()
})

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync.init(null, {
    server: {
      baseDir: '_site'
    },
    host: "localhost"
  })
})

gulp.task('sass', function () {
  gulp.src('_scss/styles.scss')
  .pipe(sass({
    onError: browserSync.notify
  }))
  .pipe(prefix([
    'last 2 versions',
    '> 2%',
    'ie >= 9'
  ], {
    cascade: true
  }))
  .pipe(gulp.dest('_site/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(gulp.dest('css'))
})

gulp.task('watch', function () {
  gulp.watch('_scss/*.scss', ['sass'])
  gulp.watch('**/*.html', ['jekyll-rebuild'])
})

gulp.task('default', ['browser-sync', 'watch'])
