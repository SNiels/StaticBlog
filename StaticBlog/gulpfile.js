var gulp = require('gulp');
var gutil = require("gulp-util");
var runSequence = require('run-sequence');
var webpack = require('webpack');

var webpackConfig = require("./webpack.config.js");
var downloadSite = require('./Gulp/downloadSite');
var site = require('./Gulp/site');


gulp.task('default', ["webpack:build-dev"], function() {
	gulp.watch(["Assets/**/*"], ["webpack:build-dev"]);
});

gulp.task('webpack:build-dev', function(callback) {
   webpack(webpackConfig).run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('generateStaticSite', function (cb) {
    runSequence('runsite', 'downloadSite', cb)
});

gulp.task('runsite', function (cb) {
    site.run(cb);
});

gulp.task('downloadSite', function (cb) {
    downloadSite(cb);
});