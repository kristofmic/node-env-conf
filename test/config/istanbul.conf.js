const glob = require('glob');
const path = require('path');

const matchedPatterns = ['../../lib/**/*.js'];
const ignoredPatterns = ['**/*.uspec.js'];

matchedPatterns.forEach(pattern => {
  glob
    .sync(pattern, {
      dot: true,
      ignore: ignoredPatterns,
    })
    .forEach(requireFile);
});

function requireFile(filepath) {
  if (filepath.indexOf('.uspec') !== -1) {
    return;
  }

  const fullPath = path.join(__dirname, '..', filepath);

  require(fullPath);
}
