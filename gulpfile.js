import gulp from 'gulp';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import scsslint from 'gulp-scss-lint';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import istanbul from 'gulp-istanbul';
import babelInstanbul from 'babel-istanbul';
import merge from 'merge-stream';

gulp.task('lint', () => {
    return gulp
        .src(['./src/**/*.js', './test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], (done) => {
    gulp
        .src(['./src/**/*.js'])
        .pipe(istanbul({
            instrumenter: babelInstanbul.Instrumenter
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', () => {
            gulp
                .src([
                    './test/**/*.js',
                    '!./test/utils/*.js',
                    '!./test/**/_*.js'
                ], {
                    read: false
                })
                .pipe(mocha({reported: 'mocha-lcov-reporter'}))
                .pipe(istanbul.writeReports())
                .on('end', done);
        });
});

gulp.task('scss-lint', () => {
    return gulp
        .src('./src/*.scss')
        .pipe(scsslint({
            config: './lint.yml',
            endless: true,
            verbose: false
        }));
});

gulp.task('copy-res', () => {
    let copyScss,
        copyStatic;

    copyScss = gulp
        .src(['./src/*.scss'])
        .pipe(gulp.dest('./dist'));

    copyStatic = gulp
        .src('./src/static/**/*')
        .pipe(gulp.dest('./dist/static'));

    return merge(copyScss, copyStatic);
});

gulp.task('build', ['copy-res'], () => {
    return gulp
        .src('./src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
    gulp.watch(['./src/**/*', './test/**/*'], ['default']);
    gulp.watch(['./**/*.scss'], ['scss']);
});

gulp.task('default', ['test', 'build']);
