var gulp = require('gulp'),
    autoPrefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    copy = require('gulp-copy'),
    util = require('gulp-util'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    seq = require('run-sequence'),
    exec = require('child_process').exec,
    base64 = require('gulp-base64'),
    imageResize = require('gulp-image-resize'),
    rename = require("gulp-rename"),
    replace = require('gulp-replace'),
    fs = require('fs');
    //responsive = require('gulp-responsive-images');


var roots = {
        "src" : "./www",
        "dev" : ".",
        "dest" : "./deploy"
    },
    folders = {
        "css" : "/static/css",
        "js" : "/static/js",
        "fonts" : "/static/fonts",
        "assets": "/assets/images",
        "icons" : "/static/icons",
        "pages" : "/paginas",
        "rootImg": "/images/**/*.*"
    };

gulp.task('cleaner', function(){

    // empty and remove dest directory
    var src = [];
    src.push(roots.dest);

    return gulp.src(src)
        .pipe(clean({
            read: false, // do not read files, just remove
            force: true // force files for Windows
        }));
});

gulp.task('prefix', function () {
    var src = roots.src + folders.css + '/*.css',
        dest = roots.dest + folders.css;

    return gulp.src(src)
        .pipe(autoPrefix('last 3 versions', '> 2%', 'ie 10', 'android 4.2'))
        .pipe(gulp.dest(dest));
});

gulp.task('base64', function(){

    var src = roots.dest + folders.css + '/*.css',
        dest = roots.dest + folders.css;

    return gulp.src(src)
        .pipe(base64({
            extensions: ['ttf', 'woff', 'woff2'],
            maxImageSize: 1024*1024 // max size in bytes
        }))
        .pipe(gulp.dest(dest));

});

gulp.task('copy-html', function(){
    var src = [],
        dest = roots.dest;

    // src.push(roots.src + '/**/*.html');
    src.push(roots.src + '/.htaccess');

    return gulp.src(src)
        .pipe(gulp.dest(dest));

});

gulp.task('inline-styles', function () {
    var src = [],
        dest = roots.dest;

    src.push(roots.src + '/**/*.html');

    return gulp.src(src)
        .pipe(replace(/<link rel="stylesheet" href="([^\.]+\.css)"[^>]*>/g, function(s, filename) {
            var style = fs.readFileSync(('./deploy' + filename), 'utf8');
            return '<style>\n' + style + '\n</style>';
        }))
        .pipe(replace('data-main="/static/js/main"','data-main="/static/js/main-build"'))
        .pipe(gulp.dest(dest));
});

gulp.task('copy-icons', function(){
    var src = roots.src + folders.icons + '/**/*',
        dest = roots.dest + folders.icons;

    return gulp.src(src)
        .pipe(gulp.dest(dest));
});

gulp.task('copy-assets', function(){
    var src = roots.src + folders.assets + '/**/*',
        dest = roots.dest + folders.assets;

    return gulp.src(src)
        .pipe(gulp.dest(dest));
});

gulp.task('copy-fonts', function(){
    var src = roots.src + folders.fonts + '/**/*',
        dest = roots.dest + folders.fonts;

    return gulp.src(src)
        .pipe(gulp.dest(dest));
});

gulp.task('copy-js', function () {
    var src = [],
        dest = roots.dest + folders.js;

    if(!util.env.dev) {
        src.push('!' + roots.src + folders.js + '/debug.js');
    }
    src.push(roots.src + folders.js + '/**/*.js');

    return gulp.src(src)
        .pipe(gulp.dest(dest));
});

gulp.task('minify-js', function() {
    var src = [],
        dest = roots.dest + folders.js;

    if(!util.env.dev) {
        src.push('!' + roots.src + folders.js + '/debug.js');
    }
    src.push(roots.src + folders.js + '/**/*.js');

    return gulp.src(src)
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task('amd', function(cb){
    exec("node r.js -o amd-optimize-config.json", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

var imgsrc = [],
    imgdest = roots.dest + folders.assets;

// imgsrc.push('!' + roots.dev + '/images/background.jpg');
// imgsrc.push('!' + roots.dev + '/images/background_mobile.jpg');
imgsrc.push(roots.dev + '/images/**/*.jpg');

gulp.task('small-image', function () {

    gulp.src(imgsrc)
        .pipe(imageResize({
            width : 320,
            crop : false,
            upscale : false
        }))
        .pipe(rename(function (path) { path.basename += "-s"; }))
        .pipe(gulp.dest(imgdest));
});

gulp.task('medium-image', function () {

    gulp.src(imgsrc)
        .pipe(imageResize({
            width : 450,
            crop : false,
            upscale : false
        }))
        .pipe(rename(function (path) { path.basename += "-m"; }))
        .pipe(gulp.dest(imgdest));
});

gulp.task('large-image', function () {

    gulp.src(imgsrc)
        .pipe(imageResize({
            width : 800,
            crop : false,
            upscale : false
        }))
        .pipe(rename(function (path) { path.basename += "-l"; }))
        .pipe(gulp.dest(imgdest));
});


gulp.task('full-image', function () {

    gulp.src(imgsrc)
        .pipe(imageResize({
            width : 1200,
            crop : false,
            upscale : false
        }))
        .pipe(gulp.dest(imgdest));
});

gulp.task('clean-img', function(){
    gulp.src(roots.dest + '/assets/images')
        .pipe(clean({
            read: true, // do not read files, just remove
            force: true // force files for Windows
        }));
});

gulp.task('copy-img-to-assets', function(){
    var src = roots.dev + '/images/*.*',
        dest = roots.dev + '/assets/images';

    return gulp.src(src)
        .pipe(gulp.dest(dest));
});

gulp.task('create-responsive-images', function(){

    return seq('copy-img-to-assets', 'copy-assets', 'small-image', 'medium-image', 'large-image', 'full-image');
});

gulp.task('responsive-to-dev', function(){
   var src = roots.dest + '/assets/**/*.*',
       dest = roots.dev + '/assets';


    return gulp.src(src)
        .pipe(gulp.dest(dest));
});

gulp.task('pre-deploy', function(){
   // return seq('copy-img-to-assets', 'create-responsive-images', 'responsive-to-dev', 'deploy');
    console.log('Sorry, not working at the moment');
    console.log('please run following commands with gulp; \n','copy-img-to-assets \n', 'create-responsive-images \n', 'responsive-to-dev \n', 'deploy');
    return null
});


// gulp running tasks
gulp.task('deploy', function() {
    return seq('cleaner', 'prefix', 'copy-html', 'inline-styles', 'create-responsive-images', 'copy-icons', 'copy-fonts', 'base64', 'minify-js', 'amd');
});
