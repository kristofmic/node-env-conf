/*jshint maxlen: 90*/

var
  nconf = require('nconf'),
  path = require('path'),
  _ = require('lodash'),
  getProjectRoot = require('./get_project_root');

require('colors');

nconf.init = init();

module.exports = nconf;

function init(options) {
  options = options || {};

  var configs = options.configs;
  var env = process.env[options.env];

  if (!env) {
    console.log('ENVIRONMENT VARIABLE NOT SET! Defaulting to \'localhost\''.red);
    env = 'localhost';
  }

  if (!_.isArray(configs) || _.isEmpty(configs)) {
    console.log('Setting up default configurations...'.green);
    configs = loadDefaults();
  }

  nconf.argv().env();

  _.each(configs, function(config) {
    loadConfig(env, config);
  });

  return nconf;
}

function loadConfig(env, config) {
  var
    configPath;

  config = config || {};

  if (!config.name || !config.path) return;

  if (config.name.toLowerCase() === 'env' ||
      config.name.toLowerCase() === 'environment') {
    config.name = env.toLowerCase() + '.json';
  }

  configPath = path.join(config.path, config.name);

  console.log(('Loading configuration: ' + configPath).blue);
  nconf.file(config.name, configPath );
}

function loadDefaults() {
  var
    projectRoot = getProjectRoot(),
    defaults;

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
