'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const identity = new AWS.CognitoIdentity();
const identityServiceProvider = new AWS.CognitoIdentityServiceProvider();
module.exports = {
    identity,
    identityServiceProvider
};
