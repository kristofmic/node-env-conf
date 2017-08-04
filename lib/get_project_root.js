const fs = require('fs');
const _ = require('lodash');
const path = require('path');

module.exports = getProjectRoot;

function getProjectRoot(dir = __dirname) {
  const noNMDir = dir.replace(/node_modules(?!.*node_modules).*/, '');

  const files = fs.readdirSync(noNMDir);

  if (_.includes(files, 'package.json')) {
    return noNMDir;
  }

  return getProjectRoot(path.resolve(noNMDir, '..'));
}
