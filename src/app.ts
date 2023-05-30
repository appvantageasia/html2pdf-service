import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import { getBrowser } from './browser.js';
import render from './render.js';

const app = express();

// In production it will probably service behind a proxy
app.enable('trust proxy');

// hide information about express
app.disable('x-powered-by');

// enable compression
app.use(compression());

// and json parsing
const bodyLimit = process.env.BODY_LIMIT || '100kb';
app.use(express.json({ limit: bodyLimit }));

// enable logs
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

// liveness probe
app.get('/.live', async (req, res, next) => {
    try {
        // get the browser instance
        const browser = await getBrowser();

        // ensure it's alive and throw if it's not
        if (!browser.isConnected()) {
            throw new Error('Browser disconnected');
        }

        // give a successful answer
        res.status(200).send('OK');
    } catch (error) {
        // continue with the error
        next(error);
    }
});

// render page
app.post('/', async (req, res, next) => {
    try {
        // get inputs from the json payload
        const { html = '', options = null } = req.body;

        // render the PDF
        const pdf = await render(html, options);

        // reply with express
        res.set('content-type', 'application/pdf');
        res.send(pdf);
    } catch (error) {
        // continue with the error
        next(error);
    }
});

// error handler
app.use((error, req, res, next) => {
    // print the error
    console.error(`Error when processing request: ${error.message}`);
    console.error(error.stack);

    // then returns a 500
    res.status(500).send('Internal Error');
});

export default app;
