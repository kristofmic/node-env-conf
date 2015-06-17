var
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash');

module.exports = getProjectRoot;

function getProjectRoot(dir) {
  var
    files;

  dir = dir || __dirname;

  dir = dir.replace(/node_modules(?!.*node_modules).*/, '');

  files = fs.readdirSync(dir);

  if (_.includes(files, 'package.json')) return dir;
  return getProjectRoot(path.resolve(dir, '..'));
}