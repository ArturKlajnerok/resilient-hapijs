'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            request.log('info', 'GET hello hapi');
            return 'Hello, Hapi.js!';
        }
    });

    server.events.on('log', (event, tags) => {
        if (tags.info) {
            console.log(`Server info: ${event.data ? event.data : 'unknown'}`);
        }
    });

    server.events.on('request', (request, event, tags) => {
        if (tags.info) {
            console.log(`Server info: ${event.data ? event.data : 'unknown'}`);
        }
    });

    server.log(['test', 'info'], 'Server is starting...');

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
