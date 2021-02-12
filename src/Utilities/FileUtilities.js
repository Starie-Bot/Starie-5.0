const requireAll = require("require-all");

module.exports.ReadDirectory = (directory, onResolve) => {
    requireAll({
        dirname: directory,
        resolve: onResolve
    });
};