var gulp = require('gulp');
var git = require('gulp-git');
var moment = require('moment');

function commit() {
	var date = moment().format('YYYY-MM-DD HH:mm');
	return gulp.src('./../Output/*')
	  .pipe(git.add({ cwd: './../Output/' }))
	  .pipe(git.commit(`${date} content update`, { cwd: './../Output/' }));
};

function push(cb){
    git.push('origin', 'master', { cwd: './../Output/' }, function (err) {
        if (err) throw err;
        cb && cb();
	});
}

module.exports = { commit, push };