const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

// Setting up common variables as globals in the test suite
global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;
