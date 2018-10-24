const nock = require('nock');
const test = require('zora');
const {Users} = require('./sdk')();

test('list users: should fetch a list of users with default parameters', async t => {
    const expected = {
        count: 1,
        items: [{id: 666}]
    };
    const req = nock('https://api.citykleta.com')
        .get('/users')
        .query({
            page: 1,
            size: 15
        })

        .reply(200, expected);

    const result = await Users()
        .list();


    t.ok(req.isDone(), 'mock should have been matched');
    t.deepEqual(result, expected);
});

test('list users: should fetch a list of users with default parameters using the provided token', async t => {
    const expected = {
        count: 1,
        items: [{id: 666}]
    };
    const req = nock('https://api.citykleta.com', {
        reqheaders: {
            'authorization': 'Bearer foo'
        }
    })
        .get('/users')
        .query({
            page: 1,
            size: 15
        })

        .reply(200, expected);

    const result = await Users({token: 'foo'})
        .list();

    t.ok(req.isDone(), 'mock should have been matched');
    t.deepEqual(result, expected);
});

test('list users: should fetch a list of users with overwritten parameters', async t => {
    const expected = {
        count: 1,
        items: [{id: 666}]
    };
    const req = nock('https://api.citykleta.com', {
        reqheaders: {
            'authorization': 'Bearer foo'
        }
    })
        .get('/users')
        .query({
            page: 3,
            size: 8
        })

        .reply(200, expected);

    const result = await Users({token: 'foo'})
        .list({page: 3, size: 8});

    t.ok(req.isDone(), 'mock should have been matched');
    t.deepEqual(result, expected);
});

test('list users: should forward error', async t => {
    let error;
    try {
        const req = nock('https://api.citykleta.com', {
            reqheaders: {
                'authorization': 'Bearer foo'
            }
        })
            .get('/users')
            .query({
                page: 'asdf',
                size: 8
            })

            .reply(400, {
                error_description: 'invalid request'
            });
        const result = await Users({token: 'foo'})
            .list({page: 'asdf', size: 8});
        t.ok(req.isDone(), 'mock should have been matched');
        t.fail('should have thrown an error without reaching this code');
    } catch (e) {
        error = e;
    } finally {
        t.deepEqual(error, {
            status: 400,
            message: {
                error_description: 'invalid request'
            }
        });
    }
});

test('one user: should get a particular user', async t => {
    const expected = {id: 666};

    const req = nock('https://api.citykleta.com', {
        reqheaders: {
            'authorization': 'Bearer foo'
        }
    })
        .get('/users/666')
        .reply(200, expected);

    const result = await Users({token: 'foo'})
        .one(666);

    t.ok(req.isDone(), 'mock should have been matched');
    t.deepEqual(result, expected);
});

test('one user: should handle API errors', async t => {
    let error;
    try {
        const req = nock('https://api.citykleta.com', {
            reqheaders: {
                'authorization': 'Bearer foo'
            }
        })
            .get('/users/666')
            .reply(404, {
                error_description: 'could not find the user'
            });
        const result = await Users({token: 'foo'})
            .one(666);

        t.ok(req.isDone(), 'mock should have been matched');
        t.fail('should have thrown an error without reaching this code');
    } catch (e) {
        error = e;
    } finally {
        t.deepEqual(error, {
            status: 404,
            message: {
                error_description: 'could not find the user'
            }
        });
    }
});

