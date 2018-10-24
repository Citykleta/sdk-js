const {sdk} = require('../../dist/bundle/index.js');
const fetch = require('node-fetch');
const {URL} = require('url');
module.exports = sdk(fetch, URL, (string) => Buffer.from(string).toString('base64'));



