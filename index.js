var _browserify = require('require-node/_browserify');

module.exports = function (content) {
    this.cacheable && this.cacheable();
    // console.log(typeof this.query, this.query);
    try {
        return _browserify.toCommonJS(this.resourcePath, this.query);
    } catch (err) {
        console.log(err);
        process.exit(-1);
    }
}
