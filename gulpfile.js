var gulp = require("gulp");

var sass = require("gulp-sass");

var minCss = require("gulp-clean-css");

var uglify = require("gulp-uglify");

var server = require("gulp-webserver");

var fs = require("fs");

var url = require("url");

var path = require("path");

var swiperJson = require("./src/data/swiper.json");
var dataJson = require("./src/data/data.json");
//压缩sass编译css
gulp.task("devCss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest("./src/css"))
});
//检测css
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("devCss"));
});
//压缩js
gulp.task("minJs", function() {
    return gulp.src(["./src/js/**/*.js", "!./src/js/libs/*.js"])
        .pipe(uglify())
        .pipe(gulp.dest("./src/bulid"))
});
//起服务
gulp.task("server", function() {
    return gulp.src("src")
        .pipe(server({
            port: 8899,
            open: true,
            middleware: function(req, res, next) {
                if (req.url === "/favicon.ico") {
                    res.end("")
                    return;
                }
                var obj = url.parse(req.url, true);
                var pathname = obj.pathname;
                var query = obj.query;
                pathname = pathname === "/" ? "index.html" : pathname;
                if (pathname === "/api/swiper") {
                    res.end(JSON.stringify({ code: 1, data: swiperJson }))
                } else if (pathname === "/api/find") {
                    res.end(JSON.stringify({ code: 1, data: dataJson }))
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }


            }
        }))
});
//整合环境
gulp.task("dev", gulp.series("devCss", "server", "watch"));

//线上环境---打包
gulp.task("bulidUglify", function() {
    return gulp.src("./src/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./src/bulid/js"))
});
//打包css
gulp.task("bulidCss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest("./src/bulid/css"))
});
//
gulp.task("copyLibs", function() {
    return gulp.src("./src/js/libs/*.js")
        .pipe(gulp.dest("./src/bulid/js/libs"))
})
gulp.task("copyhtml", function() {
    return gulp.src("./src/**/*.html")
        .pipe(gulp.dest("./src/bulid"))
})
gulp.task("copyImgs", function() {
        return gulp.src("./src/img/*")
            .pipe(gulp.dest("./src/bulid/img"))
    })
    //线上环境
gulp.task("bulid", gulp.series("bulidUglify", "bulidCss", "copyLibs", "copyhtml", "copyImgs"))