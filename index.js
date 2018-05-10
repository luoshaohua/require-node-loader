var loaderUtils = require("loader-utils");
var _browserify = require('require-node/_browserify');

var aliasPathDict;
function initAliasPathDict(alias) {
    aliasPathDict = aliasPathDict || {};
    for (var moduleName in alias) {
        var modulePath = alias[moduleName];
        aliasPathDict[modulePath] = moduleName;
        if (modulePath.slice(-3) !== '.js') {
            aliasPathDict[modulePath + '.js'] = moduleName;
        }
    }
}

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    console.log('query:', query)
    if (query.alias && !aliasPathDict) {
        initAliasPathDict(query.alias);
    }

    //console.log('__dirname', __dirname);
    var index = __dirname.indexOf('/node_modules/');
    if (query.base) {
        index = query.base.length;
    } else if (index === -1) {
        index = __dirname.indexOf('\\node_modules\\');
    }
    var urlPath = this.resourcePath.split('?', 1)[0].slice(index).replace(/\\/g, '/');
    var moduleName = aliasPathDict && aliasPathDict[urlPath] || urlPath;
    console.log('[this.resourcePath,urlPath]', this.resourcePath, urlPath, moduleName);

    try {
        return _browserify.toCommonJS(this.resourcePath, moduleName, query);
    }
    catch (err) {
        console.log(err && err.stack || err);
        console.log('require-node-loader err:', this.resourcePath, moduleName, urlPath);
        process.exit(-1);
    }
}
