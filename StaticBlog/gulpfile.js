﻿var gulp = require('gulp');
var gutil = require("gulp-util");
var runSequence = require('run-sequence');
var webpack = require('webpack');

var webpackConfig = require('./webpack.config.js');
var downloadSite = require('./Gulp/downloadSite');
var site = require('./Gulp/site');
var git = require('./Gulp/git');


gulp.task('default', ['webpack:build-dev']);

gulp.task('webpack:build-dev', function (callback) {
   var env = { prod: false };
   webpack(webpackConfig(env)).run(function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('build', ['webpack:build']);

gulp.task('webpack:build', function(callback) {
    var env = { prod: true };
    webpack(webpackConfig(env), function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('generateStaticSite', function (cb) {
    runSequence('build', 'runsite', 'downloadSite', 'killsite', cb);
});

gulp.task('runsite', function (cb) {
    site.run(cb);
});

gulp.task('killsite', function () {
    site.kill();
});

gulp.task('downloadSite', function (cb) {
    downloadSite(cb);
});

gulp.task('commitSite', git.commit);
gulp.task('pushSite', git.push);

gulp.task('deploySite', function (cb) {
    return runSequence('commitSite', 'pushSite', cb);
});
