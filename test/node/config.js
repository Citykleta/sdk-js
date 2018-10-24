const test = require('zora');
const sdk = require('./sdk');

test('should use the default service url', t => {
    const client = sdk();
    const Users = client.Bikes();
    t.equal(Users.url, 'https://api.citykleta.com/');
});

test('should use a provided service url', t => {
    const client = sdk({url: 'http://foo.bar'});
    const Users = client.Users();
    t.equal(Users.url, 'http://foo.bar/');
});
