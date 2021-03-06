describe('environment configuration manager', function () {
  var
    path = require('path'),
    envConf = require('../../lib/env_config_manager');

  describe('default configuration', function () {
    before(function () {
      envConf.init();
    });

    it('should load the environment variables', function () {
      expect(envConf.get('NODE_ENV')).to.equal('test');
    });

    it('should load the package.json file', function () {
      expect(envConf.get('name')).to.equal('node-env-conf');
    });

    it('should load the global configuration file', function () {
      expect(envConf.get('init:hello')).to.equal('world');
    });

    it('should load the environment configuration file', function () {
      expect(envConf.get('connection')).to.equal('localhost');
    });

    it('should load the private configuration file', function () {
      expect(envConf.get('init:foo')).to.equal('baz');
    });
  });

  describe('custom environment variable', function () {
    before(function () {
      envConf
        .remove('package.json')
        .remove('localhost.json')
        .remove('config.json')
        .remove('private-config.json');

      process.env.CONFIG = 'test';
      envConf.init({
        env: 'CONFIG'
      });
    });

    it('should load the environment configuration file', function () {
      expect(envConf.get('connection')).to.equal('test');
    });
  });

  describe('custom configuration', function () {
    before(function () {
      envConf
        .remove('package.json')
        .remove('test.json')
        .remove('config.json')
        .remove('private-config.json');

      envConf.init({
        configs: [
          {
            name: 'alt_test.json',
            path: path.resolve(__dirname, '..', '..', 'env')
          }
        ]
      });
    });

    it('should load the environment variables', function () {
      expect(envConf.get('NODE_ENV')).to.equal('test');
    });

    it('should NOT load the package.json file', function () {
      expect(envConf.get('name')).to.be.undefined;
    });

    it('should NOT load the global configuration file', function () {
      expect(envConf.get('init:hello')).to.be.undefined;
    });

    it('should load the environment configuration file ', function () {
      expect(envConf.get('connection')).to.equal('alt_test');
    });

    it('should load NOT the private configuration file', function () {
      expect(envConf.get('init:foo')).to.be.undefined;
    });
  });
});