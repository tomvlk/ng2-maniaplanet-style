"use strict";
require('../demo/src/polyfills.ts');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/platform-browser-dynamic/testing');
require('./matchers');
// Prevent Karma from running prematurely.
__karma__.loaded = Function.prototype;
// First, initialize the Angular testing environment.
testing_1.getTestBed().initTestEnvironment(testing_2.BrowserDynamicTestingModule, testing_2.platformBrowserDynamicTesting());
// Then we find all the tests.
var context = require.context('../demo/src', true, /\.spec\.ts/);
// And load the modules.
context.keys().map(context);
var context2 = require.context('../src/spec', true, /\.spec\.ts/);
context2.keys().map(context2);
// Finally, start Karma to run the tests.
__karma__.start();
