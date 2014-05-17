var gulp = require('gulp')
var mochaPhantomJS = require('gulp-mocha-phantomjs')

gulp.task('test', function() {
  return gulp.src('test/index.html').pipe(mochaPhantomJS({
    reporter: 'tap'
  }))
})

gulp.task('watch-test', function() {
  gulp.watch(['lib/**', 'test/**'], ['test'])
})
