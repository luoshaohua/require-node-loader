var _browserify = require('require-node/_browserify');

module.exports = function (content) {
    this.cacheable && this.cacheable();
    try {
        return _browserify.toCommonJS(this.resourcePath, this.query);
    } catch (err) {
        console.log(err);
        process.exit(-1);
    }
}
