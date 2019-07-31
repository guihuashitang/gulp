var gulp = require('gulp');
var sass = require('gulp-sass'); //css预处理器sass
var minimist = require('minimist');
var rev = require('gulp-rev'); //为静态文件随机添加一串hash值, 解决cdn缓存问题, a.css --> a-d2f3f35d3.css')
//使用gulp为js和css静态文件添加版本号，升级服务器代码后，可以不用强制更新浏览器或清空缓存，优化用户体验。
var revCollector = require('gulp-rev-collector'); //根据rev生成的manifest.json文件中的映射, 去替换文件名称, 也可以替换路径
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var del = require('del');//删除



var myConfig={
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
console.log(options,process.env.NODE_ENV)


// gulp.task('revHtml',["revCss"], function(){ //Gulp3
//   return gulp.src('./html/pages/**/*.html')
//     .pipe(revCollector({
//       replaceReved: true
//     })) 
//     .pipe(gulp.dest('./dist/pages'))
// });

gulp.task('clean', function() {
  return del(['./dist']);
});

//生成filename文件，存入string内容
function string_src(filename, string) {
  var src = require('stream').Readable({objectMode: true})
  src._read = function () {
      this.push(new gutil.File({
          cwd: "", base: "", path: filename, contents: Buffer.from(string)
      }))
      this.push(null)
  }
  return src
}


gulp.task('config', function () {
  //取出对应的配置信息
  var envConfig = myConfig[options.env];
  var conConfig = 'urlConfig = ' + JSON.stringify(envConfig);
  //生成config.js文件
  return string_src("config.js", conConfig)
    .pipe(gulp.dest('./html/js/'))
});

gulp.task('serve', function () {
  return gulp.src(['./html/js/config.js', './html/js/index.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./html/js'))
});


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



gulp.task('default', gulp.series('clean','config','serve',gulp.parallel('revCss','revJs'),'revHtml'));//Gulp4
// gulp.task('default',gulp.series('config'));//Gulp4


/**
 *  gulp.series 用于串行（顺序）执行
 *  gulp.parallel 用于并行执行
*/

// gulp.task('sass', function(){
//   return gulp.src('html/css/**/*.scss')
//     .pipe(sass()) // Using gulp-sass
//     .pipe(gulp.dest('dist/css'))
// });

