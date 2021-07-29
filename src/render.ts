import { merge } from 'lodash/fp';
import puppeteer from 'puppeteer';

export type RenderOptions = {
    emulateScreenMedia: boolean;
    viewport: puppeteer.Viewport;
    waitUntil: puppeteer.WaitForOptions['waitUntil'];
    pdf: puppeteer.PDFOptions;
};

const defaultOptions: RenderOptions = {
    emulateScreenMedia: true,
    viewport: { width: 1600, height: 1200 },
    waitUntil: 'networkidle2',
    pdf: { format: 'a4', printBackground: true },
};

const render = async (html: string, customOptions?: Partial<RenderOptions> | null) => {
    const options = merge(defaultOptions, customOptions);

    // start browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
    });

    // start page
    const page = await browser.newPage();

    // print on console
    page.on('console', (...messages) => console.info('Console logs:', ...messages));

    // print on error
    page.on('error', err => {
        console.error(`Error event emitted: ${err}`);
        console.error(err.stack);
        browser.close();
    });

    let pdf: Buffer;

    try {
        // set view port
        await page.setViewport(options.viewport);

        if (options.emulateScreenMedia) {
            await page.emulateMediaType('screen');
        }

        // set html content
        await page.setContent(html, { waitUntil: options.waitUntil });

        // render to pdf
        pdf = await page.pdf(options.pdf);
    } finally {
        // close browser
        await browser.close();
    }

    return pdf;
};

export default render;
