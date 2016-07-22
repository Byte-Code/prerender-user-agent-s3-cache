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

    describe('Test before Phantom Request', function() {

        it('Request is not GET', function() {
            var fakeNext = sinon.stub();
            var res = {};

            req.method = 'POST';

            userAgent.beforePhantomRequest(req, res, fakeNext);

            assert(fakeNext.called);
        });
    });

});