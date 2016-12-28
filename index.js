var loaderUtils = require("loader-utils");
var _browserify = require('../require-node/_browserify');

var config = {};
var aliasPathDict;
function initAliasPathDict(config) {
    config = config;
    aliasPathDict = aliasPathDict || {};
    for (var moduleName in config.alias) {
        var modulePath = config.alias[moduleName];
        aliasPathDict[modulePath] = moduleName;
        if (modulePath.slice(-3) !== '.js') {
            aliasPathDict[modulePath + '.js'] = moduleName;
        }
    }
}

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    for (var key in query) {
        //console.log(query[key])
        if (query[key][0] === '{' && query[key][query[key].length - 1] === '}') {
            query[key] = JSON.parse(query[key]);
        }
    }
    console.log('query:', query)
    if (query.config && !aliasPathDict) {
        initAliasPathDict(require(query.config));
    }

    //console.log('__dirname', __dirname);
    var index = __dirname.indexOf('/node_modules/');
    if (index === -1) {
        index = __dirname.indexOf('\\node_modules\\');
    }
    var urlPath = this.resourcePath.split('?', 1)[0].slice(index).replace(/\\/g, '/');
    var moduleName = aliasPathDict && aliasPathDict[urlPath] || urlPath;
    console.log('[this.resourcePath,urlPath]', this.resourcePath, urlPath, moduleName);

    try {
        return _browserify.toCommonJS(this.resourcePath, moduleName, Object.assign(config, query));
    }
    catch (err) {
        console.log(err && err.stack || err);
        console.log('require-node-loader err:', this.resourcePath, moduleName, urlPath);
        process.exit(-1);
    }
}
