var gulp = require('gulp');
var sass = require('gulp-sass');

var sourceFile = ['src/assets/layout/css/*.scss', 'src/assets/theme/*.scss'];

gulp.task('compileSass', function () {
    gulp
        .src(sourceFile)
        .pipe(sass())
        .pipe(gulp.dest(function (f) {
            return f.base;
        }))
});

gulp.task('watchCompileSass', ['compileSass'], function () {
    gulp.watch(['src/assets/layout/css/*.scss', 'src/assets/theme/*.scss', 'src/assets/sass/**/*'], ['compileSass']);
});

gulp.task('default', ['watchCompileSass']);
