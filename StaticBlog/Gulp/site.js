var childProcess = require('child_process');
var exec = childProcess.exec;

var started = false;

function run(cb) {
    var child = exec('dotnet run --launch-profile StaticBlogProduction');

    child.stdout.on('data', (data) => {
        if (!started && data.indexOf('Application started') !== -1) {
            started = true;
            cb && cb();
        }
    });

    return child;
}

function kill() {
    exec('taskkill /F /IM dotnet.exe')
}

module.exports = {
    run,
    kill
};


