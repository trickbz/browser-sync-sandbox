let gulp = require('gulp');
let del = require('del');
let eslint = require('gulp-eslint');
let debug = require('gulp-debug');
let rename = require('gulp-rename');
let browserify = require('gulp-browserify');
let sequence = require('run-sequence');
let browserSync = require('browser-sync').create();

gulp.task('lint', () => {
	return gulp.src('src/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('clear', ['lint'], () => {
	return del('dest')
		.then(files => {
			files.length && console.log(files.join('\n'));
		});
});

gulp.task('assets', () => {
	return gulp.src('src/assets/**/*.*')
		.pipe(debug({
			title: 'assets:src:'
		}))
		.pipe(gulp.dest('dest'));
});

gulp.task('browserify', () => {
	return gulp.src('src/js/**/*.js')
		.pipe(browserify({
			insertGlobals: true
		}))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dest'));
});

gulp.task('build', ['assets', 'browserify']);

gulp.task('watch', () => {
	gulp.watch('src/js/**/*.js', ['browserify']);
	gulp.watch('src/assets/**/*', ['assets']);
});

gulp.task('serve', () => {
	browserSync.init({
		server: 'dest'
	});

	browserSync.watch('dest/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', () => {

	return sequence('clear', 'build', ['watch', 'serve']);
});

gulp.task('default', ['dev']);
