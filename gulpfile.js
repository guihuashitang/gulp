var gulp = require('gulp');
var sass = require('gulp-sass'); //css预处理器sass
var minimist = require('minimist');
var rev = require('gulp-rev'); //为静态文件随机添加一串hash值, 解决cdn缓存问题, a.css --> a-d2f3f35d3.css')
var revCollector = require('gulp-rev-collector'); //根据rev生成的manifest.json文件中的映射, 去替换文件名称, 也可以替换路径



var config={
  "dev":{
    "title":'dev',
    "url":"www.dev.com"
  },
  "pro":{
    "title":'pro',
    "url":"www.pro.com"
  }
}

var options = minimist(process.argv.slice(2), {
  string:'env',
  default: {
    env: process.env.NODE_ENV || 'development'
  } 
});

console.log(process.argv.slice(2))
console.log(config[options.env])


// gulp.task('revHtml',["revCss"], function(){ //Gulp3
//   return gulp.src('./html/pages/**/*.html')
//     .pipe(revCollector({
//       replaceReved: true
//     })) 
//     .pipe(gulp.dest('./dist/pages'))
// });

gulp.task('revCss', function(){
  return gulp.src('./html/css/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('revJs', function(){
  return gulp.src('./html/js/**/*.js')
    .pipe(rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('revHtml',function(){
  return gulp.src(['./dist/**/*.json','./html/pages/**/*.html'])
    .pipe(revCollector({
      replaceReved: true
    })) 
    .pipe(gulp.dest('./dist/pages'))
});



gulp.task('default', gulp.series(gulp.parallel('revCss','revJs'),'revHtml'));//Gulp4

/**
 *  gulp.series 用于串行（顺序）执行
 *  gulp.parallel 用于并行执行
*/

// gulp.task('sass', function(){
//   return gulp.src('html/css/**/*.scss')
//     .pipe(sass()) // Using gulp-sass
//     .pipe(gulp.dest('dist/css'))
// });

