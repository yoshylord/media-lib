'use strict';

const Nconf = require('nconf');


const internals = {};

internals.init = function() {
    // Setup nconf to use the configuration_default.json file
    Nconf.file({file: 'configuration_default.json'});
};

internals.init();

module.exports = Nconf;
