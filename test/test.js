/**
 * Created by Samuele on 7/21/16.
 */

'use strict';

const chai = require('chai'),
    assert = chai.assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('Prerender User Agent S3 Cache', function () {

    let sandbox;
    let req = {};

    let isMobileValue = false;
    let isTabletValue = false;

    const testUserAgent = {
        parse: function () {
            return {
                isMobile: isMobileValue,
                isTablet: isTabletValue
            };
        }
    };

    var fakeUpdate = {
        digest: sinon.stub()
    };

    var fakeMD5 = {
        update: function () {
            return fakeUpdate;
        }
    };

    class testMD5 {
        constructor() {
            return fakeMD5;
        }
    }

    const userAgent = proxyquire('../lib/prerender-useragent-S3-cache', {
        'express-useragent': testUserAgent,
        'md5.js': testMD5
    });

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        req.prerender = {url: 'http://test.url'};
        req.headers = {};
    });


    afterEach(function () {
        sandbox.restore();
    });

    describe('Test before Phantom Request', function () {

        let fakeCacheGet = sinon.stub();
        let fakeSetCache = sinon.stub();

        beforeEach(function () {

            userAgent.cache = {
                get: fakeCacheGet,
                set: fakeSetCache
            };
        });

        it('Request is not GET', function () {
            let fakeNext = sinon.stub();
            let res = {};

            req.method = 'POST';

            userAgent.beforePhantomRequest(req, res, fakeNext);

            assert(fakeNext.called);
        });

        it('Request is a GET', function () {
            let fakeNext = sinon.stub();
            let res = {};

            req.method = 'GET';

            userAgent.beforePhantomRequest(req, res, fakeNext);

            assert(fakeCacheGet.called);
        });
    });

    describe('Test after Pahtnom Request', function () {

        it('The prender status code is different from 200', function () {
            let fakeNext = sinon.stub();
            let res = {};

            req.prerender = {
                statusCode: 400
            };

            userAgent.afterPhantomRequest(req, res, fakeNext);

            assert(fakeNext.called);
        });
        
    });

    describe('Test S3 key generator', function () {

        beforeEach(function () {
            isMobileValue = false;
            isTabletValue = false;
        });

        it('Mobile', function () {
            let userAgentString = '_mobile_';
            let md5Result = '0X0';
            let url = 'http://test.com/page';

            fakeUpdate.digest.returns(md5Result);
            isMobileValue = true;

            let s3Key = userAgent.testS3KeyGenerator.genarateKey(url, userAgentString);

            assert(fakeUpdate.digest.called);
            assert.equal(s3Key, url.concat(userAgentString).concat(md5Result));
        });

        it('Tablet', function () {
            let userAgentString = '_tablet_';
            let md5Result = '0X0';
            let url = 'http://test.com/page';

            fakeUpdate.digest.returns(md5Result);
            isTabletValue = true;

            let s3Key = userAgent.testS3KeyGenerator.genarateKey(url, userAgentString);

            assert(fakeUpdate.digest.called);
            assert.equal(s3Key, url.concat(userAgentString).concat(md5Result));
        });

        it('Desktop or otherwise', function () {
            let userAgentString = '_desktop_';
            let md5Result = '0X0';
            let url = 'http://test.com/page';

            fakeUpdate.digest.returns(md5Result);

            let s3Key = userAgent.testS3KeyGenerator.genarateKey(url, userAgentString);

            assert(fakeUpdate.digest.called);
            assert.equal(s3Key, url.concat(userAgentString).concat(md5Result));
        });

        it('If is both mobile and tablet is saved as tablet', function () {
            let userAgentString = '_tablet_';
            let md5Result = '0X0';
            let url = 'http://test.com/page';

            isMobileValue = true;
            isTabletValue = true;

            fakeUpdate.digest.returns(md5Result);

            let s3Key = userAgent.testS3KeyGenerator.genarateKey(url, userAgentString);

            assert(fakeUpdate.digest.called);
            assert.equal(s3Key, url.concat(userAgentString).concat(md5Result));
        });

    });
});