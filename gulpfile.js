var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    config = {
        server: {
            baseDir: "./dist"
        }
    };
gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe($.sass({outputStyle: 'expanded'}))
        .pipe($.autoprefixer())
        .pipe(gulp.dest('src/css'))
});

gulp.task('inline-css', ['sass'], function() {
    return gulp.src('src/*.html')
        .pipe($.inlineCss())
        .pipe(gulp.dest('dist/'))
});

gulp.task('html-min', ['inline-css'], function () {
    return gulp.src('dist/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest("dist"))
        .pipe(reload({stream: true}));
});

gulp.task('clean-images', function () {
    return gulp.src('dist/img', {read: false})
        .pipe($.clean());
});

gulp.task('images', ['clean-images'], function () {
    return gulp.src('src/img/**/*')
        .pipe($.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(reload({stream: true}));
});

// http://www.mailgun.com/
var emailOptions = {
    user: 'api:key-48d4ee17e26a14708fdef9dbe9a58fd8',
    url: 'https://api.mailgun.net/v3/sandbox1b0689784d364292b0f95e60ddd52b64.mailgun.org',
    form: {
        from: 'Yura <mailgun@sandbox1b0689784d364292b0f95e60ddd52b64.mailgun.org>',
        to: 'Yuriy Boychuk <yura13boychuk@gmail.com>',
        subject: 'The last dist'
    }
};

gulp.task('send-email', function () {
    return gulp.src('dist/index.html')
        .pipe($.email(emailOptions));
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('watch', function () {
    gulp.watch(['src/sass/**/*.scss', 'src/**/*.html'], ['html-min']);
    gulp.watch('src/img/*', ['images']);
});

gulp.task('build', ['html-min', 'images']);
gulp.task('test', ['send-email']);
gulp.task('default', ['webserver', 'watch']);
