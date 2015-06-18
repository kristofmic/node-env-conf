var
  nconf = require('nconf'),
  path = require('path'),
  _ = require('lodash'),
  getProjectRoot = require('./get_project_root');

require('colors');

nconf.init = init();

module.exports = nconf;

function init(configs) {
  if (!_.isArray(configs) || _.isEmpty(configs)) {
    console.log('Setting up default configurations...'.green);
    configs = loadDefaults();
  }

  nconf.argv().env();

  _.each(configs, loadConfig);

  return nconf;
}

function loadConfig(config) {
  var
    configPath;

  config = config || {};

  if (!config.name || !config.path) return;

  if (config.name.toLowerCase() === 'env' ||
      config.name.toLowerCase() === 'environment') {
    config.name = nconf.get('NODE_ENV').toLowerCase() + '.json';
  }

  configPath = path.join(config.path, config.name);

  console.log(('Loading configuration: ' + configPath).blue);
  nconf.file(config.name, configPath );
}

function loadDefaults() {
  var
    projectRoot = getProjectRoot(),
    defaults;

  if (!process.env.NODE_ENV) {
    console.log('NODE_ENV NOT SET! Defaulting to \'localhost\''.red);
    process.env.NODE_ENV = 'localhost';
  }

  console.log(('Identified project root: ' + projectRoot).green);

  // priority is determined by order (i.e., first load is highest priority)
  defaults = [
    {
      name: 'private-config.json',
      path: path.join(projectRoot)
    },
    {
      name: 'env',
      path: path.join(projectRoot, 'env/')
    },
    {
      name: 'config.json',
      path: projectRoot
    },
    {
      name: 'package.json',
      path: projectRoot
    }
  ];

  return defaults;
}
