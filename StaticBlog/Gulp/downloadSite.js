var scrape = require('website-scraper');
var fs = require('fs');
var fsExtra = require('fs-extra');

var rootUrl = 'http://localhost:55955';
var outputDir = '../Output';
var options = {
    urls: [rootUrl],
    directory: '../Temp/',
    recursive: true,
    filenameGenerator: 'bySiteStructure',
    maxDepth: 100,
    prettifyUrls: true,
    urlFilter: function (url) {
        return url.indexOf(rootUrl) === 0;
    }
};

module.exports = function (readyCallback) {
    if (fsExtra.pathExistsSync(options.directory)) {
        fsExtra.removeSync(options.directory);
    }
    // with promise
    scrape(options).then((result) => {
        var dirs = fs.readdirSync(outputDir);
        for (let dir of dirs) {
            if (dir.indexOf('.') == 0) {
                continue;
            }
            fsExtra.removeSync(`${outputDir}/${dir}`);
        }

        fsExtra.moveSync(`${options.directory}localhost_55955`, outputDir);
        fsExtra.removeSync(options.directory);

        if (readyCallback) {
            readyCallback();
        }
    }).catch((err) => {
        throw err;
        /* some code here */
    });
};
