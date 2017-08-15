var exec = require('child_process').exec;


var started = false;
var child;

function run(cb) {
    child = exec('dotnet run', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb && cb(err);
    });

    child.stdout.on('data', (data) => {
        if (!started && data.indexOf('Application started') != -1) {
            started = true;
            cb && cb();
        }
    });
}

function kill() {
    child.kill();
}


module.exports = {
    run,
    kill
}