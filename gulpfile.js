var gulp = require('gulp')
var eslint = require('gulp-eslint')

var jsFiles = ['src/**/*.js', 'test/**/*.js', '!test/lib/**/*.js']

gulp.task('lint', function() {
  gulp.src(jsFiles).pipe(eslint('.eslintrc')).pipe(eslint.format())
})

gulp.task('watch', function() {
  gulp.watch(jsFiles, ['lint'])
})
