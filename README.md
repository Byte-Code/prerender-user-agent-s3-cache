#Prerender User Agent S3 Cache [![Build Status](https://travis-ci.org/Byte-Code/prerender-user-agent-s3-cache.svg?branch=master)](https://travis-ci.org/Byte-Code/prerender-user-agent-s3-cache)![Dependencies](https://david-dm.org/Byte-Code/prerender-user-agent-s3-cache.svg)[![Code Climate](https://codeclimate.com/github/Byte-Code/prerender-user-agent-s3-cache/badges/gpa.svg)](https://codeclimate.com/github/Byte-Code/prerender-user-agent-s3-cache)

A plugin for [Prerender](https://github.com/prerender/prerender) that cache the HTML on S3 generated based 
on the user agent, adding the device and MD5 user agent

## Usage

Run the test

        npm test
        
Install

        npm install prerender-user-agent-render
        
Add this to your Prerender server.js:

        server.use(require('prerender-user-agent-s3-cache'));
        
[License](LICENSE)
