'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const init = async () => {

    const tokens = [];

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    const tokenSchema = Joi.object({
        id: Joi.number().required().min(1),
        value: Joi.string().required().min(1)
    });

    const paginationSchema = Joi.object({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0)
    });

    const swaggerOptions = { info: {
        title: 'Token API Documentation',
        version: Pack.version,
    }};

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            request.log('info', 'GET hello hapi');
            return 'Hello, Hapi.js!';
        }
    });

    server.route({
        method: 'GET',
        path: '/tokens',
        options: {
            description: 'Get all tokens',
            notes: 'Returns a list of all tokens',
            tags: ['api', 'tokens'],
            validate: {
                query: paginationSchema
            }
        },
        handler: async (request, h) => {
            return h.response(tokens).code(200);
        }
    });

    server.route({
        method: 'POST',
        path: '/tokens',
        options: {
            validate: {
                payload: tokenSchema
            }
        },
        handler: async (request, h) => {
            const newToken = request.payload;
            tokens.push(newToken);
            return h.response(newToken).code(201);
        }
    });

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

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
