import app from './app';

const port = parseInt(process.env.PORT || '3000', 10);

const server = app.listen(port, () => {
    console.info('Express server listening on http://localhost:%d/ in %s mode', port, app.get('env'));
});

// keep track if the server is already exiting
let exited = false;

function closeServer(signal) {
    if (exited) {
        // already taken care of
        return;
    }

    // print it out
    console.info(`${signal} received`);
    console.info('Closing http.Server ..');

    // close http server
    server.close(() => {
        // mark it as exited
        exited = true;
        // print it out
        console.info('Server closed');
        // give a short period to clean up and properly shutdown
        setTimeout(() => process.exit(0), 100);
    });
}

// graceful shutdown
process.stdin.resume();

// stop server when closing
process.on('exit', closeServer.bind(this, 'SIGTERM'));

// handle signals
process.on('SIGTERM', closeServer.bind(this, 'SIGTERM'));
process.on('SIGINT', closeServer.bind(this, 'SIGINT'));