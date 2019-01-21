#!/usr/bin/env node

const prerender = require('./lib');

const options = {
    logRequests: true
};

const server = prerender(options);

server.use(prerender.sendPrerenderHeader());
server.use(prerender.healthCheck());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.responsiveView());
server.use(prerender.logHeaders());
server.use(prerender.httpHeaders());

if (process.env.REDIS_URL) {
    server.use(prerender.redisCache());
}

server.start();