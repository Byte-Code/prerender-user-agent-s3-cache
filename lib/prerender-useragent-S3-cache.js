/**
 * Created by Samuele on 7/20/16.
 */
'use strict';

var userAgentParser = require('express-useragent');
var cache_manager = require('cache-manager');
var s3 = new (require('aws-sdk')).S3({params: {Bucket: process.env.S3_BUCKET_NAME}});
var MD5 = require('md5.js');

var s3KeyGenerator = {
    genarateKey : function (url, userAgent) {
        var ua = userAgentParser.parse(userAgent);

        var userAgentMD5 = new MD5().update(userAgent).digest('hex');

        if (true === ua.isTablet) {
            return url.concat('_tablet_').concat(userAgentMD5);
        } else if (true === ua.isMobile) {
            return url.concat('_mobile_').concat(userAgentMD5);
        } else {
            return url.concat('_desktop_').concat(userAgentMD5);
        }
    }
};


var s3_cache = {
    get: function(key, callback) {
        if (process.env.S3_PREFIX_KEY) {
            key = process.env.S3_PREFIX_KEY + '/' + key;
        }

        s3.getObject({
            Key: key
        }, callback);
    },
    set: function(key, value, callback) {
        if (process.env.S3_PREFIX_KEY) {
            key = process.env.S3_PREFIX_KEY + '/' + key;
        }

        var request = s3.putObject({
            Key: key,
            ContentType: 'text/html;charset=UTF-8',
            StorageClass: 'REDUCED_REDUNDANCY',
            Body: value
        }, callback);

        if (!callback) {
            request.send();
        }
    }
};

module.exports = {
    init: function() {
        this.cache = cache_manager.caching({
            store: s3_cache
        });
    },

    beforePhantomRequest: function(req, res, next) {

        if(req.method !== 'GET') {
            return next();
        }

        this.cache.get(s3KeyGenerator.genarateKey(req.prerender.url, req.headers['user-agent']), function (err, result) {
            if(err) {
                console.error(err);
            }

            if (!err && result) {
                console.log('cache hit');
                return res.send(200, result.Body);
            }

            next();
        });
    },

    afterPhantomRequest: function(req, res, next) {

        if(req.prerender.statusCode !== 200) {
            return next();
        }

        this.cache.set(s3KeyGenerator.genarateKey(req.prerender.url, req.headers['user-agent']), req.prerender.documentHTML, function(err, result) {
            if (err) {
                console.error(err);
            }

            next();
        });

    },

    testS3KeyGenerator: s3KeyGenerator
};


