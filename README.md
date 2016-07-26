#Prerender User Agent S3 Cache

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