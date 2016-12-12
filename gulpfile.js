/**
 * 发布
 * ilex
 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const streamify = require('gulp-streamify');
const del = require('del'); // 清除文件（del）

// 编译并压缩js
gulp.task('convertJS', function(){
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-0'],
      plugins:['transform-runtime','transform-remove-strict-mode']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// 合并并压缩css
gulp.task('convertCSS', function(){
  return gulp.src('src/**/*.css')
    .pipe(concat('app.css'))
    .pipe(cssnano())
    .pipe(rename(function(path){
      path.basename += '.min';
    }))
    .pipe(gulp.dest('dist/styles'));
});

//复制静态资源到指定目录
gulp.task('imagesCopy', function(){
  return gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.cur'])
    .pipe(gulp.dest('dist/'));
});

// 监视文件变化，自动执行任务
gulp.task('watch', function(){
  gulp.watch('src/**/*.css', ['convertCSS']);
  gulp.watch('src/**/*.js', ['convertJS', 'browserify']);
});

// 清除任务
gulp.task('clean', function(done) {
    del(['dist'], done);
});

// browserify
gulp.task("browserify", function () {
    var bro = browserify({
        entries: "index.js"
    });

    return bro.bundle()
        .pipe(source("amos.overt.js"))
        .pipe(buffer())
        .pipe(streamify(uglify()))
        .pipe(gulp.dest("dist/min"));
});

gulp.task('start', ['convertJS', 'convertCSS', 'imagesCopy', 'browserify', 'watch']);

// 启动: gulp start

// 设置默认任务（default）
gulp.task('default', ['clean'], function() {
    gulp.start('convertJS', 'convertCSS', 'imagesCopy', 'browserify', 'watch');
});

/////////////////////////////////////
//发布 BEGIN
////////////////////////////////////
// 编译并压缩js
gulp.task('compileJs', function(){
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-0'],
      plugins:['transform-runtime','transform-remove-strict-mode']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('lib/'));
});
// 合并并压缩css
gulp.task('compileCSS', function(){
  return gulp.src('src/**/*.css')
    .pipe(concat('app.css'))
    .pipe(cssnano())
    .pipe(rename(function(path){
      path.basename += '.min';
    }))
    .pipe(gulp.dest('lib/styles'));
});

//复制静态资源到指定目录
gulp.task('compileImg', function(){
  return gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.cur'])
    .pipe(gulp.dest('lib/'));
});
// 发布之前操作
gulp.task('prePublish', function(done) {
    del(['lib'], done);
});
// 执行发布
gulp.task('publish', ['compileJs', 'compileCSS', 'compileImg']);
//////////////////////////////////////////
//发布 END   gulp prePublish, gulp publish
/////////////////////////////////////////
