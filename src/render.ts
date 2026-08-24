import merge from 'lodash/fp/merge.js';
import puppeteer from 'puppeteer';
import { getBrowser } from './browser.js';

enum OutputKind {
    Pdf = 'Pdf',
    Image = 'Image',
}

type VariantRenderOptions<TKind extends OutputKind> = {
    output: TKind;
    emulateScreenMedia: boolean;
    viewport: puppeteer.Viewport;
    waitUntil: puppeteer.WaitForOptions['waitUntil'];
};

type PdfRenderOptions = VariantRenderOptions<OutputKind.Pdf> & {
    pdf?: puppeteer.PDFOptions;
};

type ImageRenderOptions = VariantRenderOptions<OutputKind.Image> & {
    selector?: string;
    screenshot?: puppeteer.ScreenshotOptions;
};

export type RenderOptions = PdfRenderOptions | ImageRenderOptions;

const defaultOptions: RenderOptions = {
    emulateScreenMedia: true,
    viewport: { width: 1600, height: 1200 },
    waitUntil: 'networkidle2',
    output: OutputKind.Pdf,
};
const defaultPdfOptions: puppeteer.PDFOptions = {
    format: 'a4',
    printBackground: true,
};
const defaultScreenshotOptions: puppeteer.ScreenshotOptions = {
    type: 'png',
};

const render = async (html: string, customOptions?: Partial<RenderOptions> | null) => {
    const options: RenderOptions = merge(defaultOptions, customOptions);

    // start browser
    const browser = await getBrowser();
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

    let buffer: Buffer;
    let contentType: string;

    try {
        // Set viewport and other options concurrently
        const viewportPromise = page.setViewport(options.viewport || { width: 1280, height: 800 });
        const emulateMediaPromise = options.emulateScreenMedia ? page.emulateMediaType('screen') : Promise.resolve();
        await Promise.all([viewportPromise, emulateMediaPromise]);

        // set html content
        await page.setContent(html, { waitUntil: options.waitUntil });
        // render to pdf
        switch (options.output) {
            case OutputKind.Pdf: {
                const pdfOptions: puppeteer.PDFOptions = merge(defaultPdfOptions, options.pdf);

                contentType = 'application/pdf';
                buffer = await page.pdf(pdfOptions);
                break;
            }

            case OutputKind.Image: {
                const screenshotOptions: puppeteer.ScreenshotOptions = merge(
                    defaultScreenshotOptions,
                    options.screenshot
                );

                contentType = `image/${screenshotOptions.type || 'png'}`;
                if (options.selector) {
                    const element = await page.$(options.selector);
                    if (element) {
                        buffer = await element.screenshot(screenshotOptions);
                    }
                }
                if (!buffer) {
                    buffer = await page.screenshot(screenshotOptions);
                }
                break;
            }
        }
    } finally {
        // close the page
        await page.close();
    }

    return [buffer, contentType] as const;
};

export default render;
