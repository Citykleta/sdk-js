const nock = require('nock');
const test = require('zora');
const {Tokens} = require('./sdk')();

test('create token: should create a new token using client credential', async t => {
    const expected = {
        access_token: 'foo'
    };
    nock('https://api.citykleta.com')
        .post('/tokens', {
            username: 'hello@example.org',
            password: 'secret!!!',
            grant_type: 'password'
        })
        .basicAuth({
            user: 'app_id',
            pass: 'app_secret'
        })
        .reply(201, expected);

    const result = await Tokens({
        clientId: 'app_id',
        secret: 'app_secret'
    }).create({username: 'hello@example.org', password: 'secret!!!'});

    t.deepEqual(result, expected);
});

test('create token: should handle error', async t => {
    let error;
    try {
        nock('https://api.citykleta.com')
            .post('/tokens', {
                username: 'hello@example.org',
                password: 'secret!!!',
                grant_type: 'password'
            })
            .reply(401, {
                error_description: 'missing Basic authentication scheme'
            });

        await Tokens().create({username: 'hello@example.org', password: 'secret!!!'});
        t.fail('should throw an error and not reach this part');
    } catch (e) {
        error = e;
    } finally {
        t.deepEqual(error, {
            status: 401, message: {
                error_description: 'missing Basic authentication scheme'
            }
        });
    }
});
