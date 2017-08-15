var scrape = require('website-scraper');
var fs = require('fs-extra');

var rootUrl = 'http://localhost:55955';
var options = {
    urls: [rootUrl],
    directory: '../Output/',
    recursive: true,
    filenameGenerator: 'bySiteStructure',
    maxDepth: 100,
    prettifyUrls: true,
    urlFilter: function (url) {
        return url.indexOf(rootUrl) === 0;
    }
};

module.exports = function (readyCallback) {
    if (fs.pathExistsSync(options.directory)) {
        fs.removeSync(options.directory);
    }
    // with promise
    scrape(options).then((result) => {
        if (readyCallback) {
            readyCallback();
        }
    }).catch((err) => {
        /* some code here */
    });
}
