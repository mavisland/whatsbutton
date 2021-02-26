"use strict";

// Packages
var gulp = require("gulp");
var autoprefixer = require("autoprefixer");
var cleanCSS = require("gulp-clean-css");
var del = require("del");
var fs = require("fs");
var gulpif = require("gulp-if");
var pkg = require("./package.json");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");

/**
 * Task: 'clean'
 *
 * Remove pre-existing content from output folders
 */
gulp.task(
  "clean",
  gulp.series(function (done) {
    // Clean the dist folder
    del.sync(["dist/"]);

    // Signal completion
    done();
  })
);

/**
 * Task: 'scripts'
 *
 * Concanate & minify JavaScript files
 */
gulp.task(
  "scripts",
  gulp.series(function (done) {
    gulp
      .src("js/jquery.whatsbutton.js")
      .pipe(plumber())
      .pipe(gulp.dest("dist/js/"))
      .pipe(
        uglify({
          output: {
            comments: false,
          },
        })
      )
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(gulp.dest("dist/js/"));

    // Signal completion
    done();
  })
);

/**
 * Task: 'styles'
 *
 * Compile, autoprefix & minify SASS files
 */
gulp.task(
  "styles",
  gulp.series(function (done) {
    gulp
      .src("scss/whatsbutton.scss")
      .pipe(plumber())
      .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.init()))
      .pipe(
        sass({
          outputStyle: "expanded",
        })
      )
      .pipe(
        postcss([
          autoprefixer({
            browsers: pkg.browserlist,
            cascade: false,
          }),
        ])
      )
      .pipe(gulp.dest("dist/css/"))
      .pipe(
        cleanCSS({
          level: {
            1: {
              specialComments: 0,
            },
          },
        })
      )
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.write(".")))
      .pipe(gulp.dest("dist/css/"));

    // Signal completion
    done();
  })
);

/**
 * Task: 'build'
 *
 * Run all tasks
 */
gulp.task("build", gulp.parallel(["styles", "scripts"]));

/**
 * Task: 'watch'
 *
 * Watch all file changes
 */
gulp.task("watch", function () {
  gulp.watch("js/*.js", gulp.series("scripts"));
  gulp.watch("scss/*.scss", gulp.series("styles"));
});

// Default
gulp.task("default", gulp.series(["clean", "build", "watch"]));
