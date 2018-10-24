const nock = require('nock');
const test = require('zora');
const {Businesses} = require('./sdk')();

test('list businesses: should fetch a list of businesses with default parameters', async t => {
    const expected = {
        count: 1,
        items: [{id: 666}]
    };
    nock('https://api.citykleta.com')
        .get('/businesses')
        .query({
            page: 1,
            size: 15
        })

        .reply(200, expected);

    const result = await Businesses()
        .list();

    t.deepEqual(result, expected);
});

test('list businesses: should fetch a list of businesses with default parameters using the provided token', async t => {
    const expected = {
        count: 1,
        items: [{id: 666}]
    };
    nock('https://api.citykleta.com', {
        reqheaders: {
            'authorization': 'Bearer foo'
        }
    })
        .get('/businesses')
        .query({
            page: 1,
            size: 15
        })

        .reply(200, expected);

    const result = await Businesses({token: 'foo'})
        .list();

    t.deepEqual(result, expected);
});

test('list businesses: should fetch a list of businesses with overwritten parameters', async t => {
    const expected = {
        count: 1,
        items: [{id: 666}]
    };
    nock('https://api.citykleta.com', {
        reqheaders: {
            'authorization': 'Bearer foo'
        }
    })
        .get('/businesses')
        .query({
            page: 3,
            size: 8
        })

        .reply(200, expected);

    const result = await Businesses({token: 'foo'})
        .list({page: 3, size: 8});

    t.deepEqual(result, expected);
});

test('list businesses: should forward error', async t => {
    let error;
    try {
        nock('https://api.citykleta.com', {
            reqheaders: {
                'authorization': 'Bearer foo'
            }
        })
            .get('/businesses')
            .query({
                page: 'asdf',
                size: 8
            })

            .reply(400, {
                error_description: 'invalid request'
            });
        const result = await Businesses({token: 'foo'})
            .list({page: 'asdf', size: 8});

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

test('one business: should get a particular business', async t => {
    const expected = {id: 666};

    nock('https://api.citykleta.com', {
        reqheaders: {
            'authorization': 'Bearer foo'
        }
    })
        .get('/businesses/666')
        .reply(200, expected);

    const result = await Businesses({token: 'foo'})
        .one(666);

    t.deepEqual(result, expected);
});

test('one business: should handle API errors', async t => {
    let error;
    try {
        nock('https://api.citykleta.com', {
            reqheaders: {
                'authorization': 'Bearer foo'
            }
        })
            .get('/businesses/666')
            .reply(404, {
                error_description: 'could not find the business'
            });
        const result = await Businesses({token: 'foo'})
            .one(666);

        t.fail('should have thrown an error without reaching this code');
    } catch (e) {
        error = e;
    } finally {
        t.deepEqual(error, {
            status: 404,
            message: {
                error_description: 'could not find the business'
            }
        });
    }
});

