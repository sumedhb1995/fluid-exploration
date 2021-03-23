// eslint-disable-next-line strict
'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {
    let state = '4';
    const server = Hapi.server({
        port: 8000,
        host: 'localhost',
        "routes": {
            "cors": {
                "origin": ["http://localhost:8080"],
                "headers": ["Accept", "Content-Type"],
                "additionalHeaders": ["X-Requested-With"]
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return state;
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler: (request, h) => {
            const payload = request.payload;
            state = payload;
            return state;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();