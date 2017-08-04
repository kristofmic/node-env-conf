require('colors');

const _ = require('lodash');
const nconf = require('nconf');
const path = require('path');

const getProjectRoot = require('./get_project_root');

nconf.init = init;

module.exports = nconf;

function init(options = {}) {
  let { configs } = options;
  let env = process.env[options.env];

  if (!env) {
    console.log(
      'CONFIGURATION ENVIRONMENT VARIABLE NOT SET!'.red,
      "You should set an environment variable and pass it in as an option when calling `init({ env: 'CONFIG' })`"
        .red,
      'Defaulting to "localhost"'.red
    );

    env = 'localhost';
  }

  if (!_.isArray(configs) || _.isEmpty(configs)) {
    console.log('Setting up default configurations...'.green);
    configs = loadDefaults();
  }

  nconf.argv().env();

  _.forEach(configs, _.partial(loadConfig, env));

  return nconf;
}

function loadConfig(env, config = {}) {
  const { path: configPath } = config;
  let { name: configName } = config;

  if (!configName || !configPath) return;

  if (configName.toLowerCase() === 'env' || configName.toLowerCase() === 'environment') {
    configName = `${env.toLowerCase()}.json`;
  }

  const configFilePath = path.join(configPath, configName);

  console.log(`Loading configuration: ${configFilePath}`.blue);

  nconf.file(configName, configFilePath);
}

function loadDefaults() {
  const projectRoot = getProjectRoot();

  console.log(`Identified project root: ${projectRoot}`.green);

  // priority is determined by order (i.e., first load is highest priority)
  const defaults = [
    {
      name: 'private-config.json',
      path: path.join(projectRoot),
    },
    {
      name: 'env',
      path: path.join(projectRoot, 'env/'),
    },
    {
      name: 'config.json',
      path: projectRoot,
    },
    {
      name: 'package.json',
      path: projectRoot,
    },
  ];

  return defaults;
}
