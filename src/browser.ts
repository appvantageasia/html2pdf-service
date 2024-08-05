import puppeteer from 'puppeteer';

let instance: puppeteer.Browser | null = null;

let instancePromise: Promise<puppeteer.Browser> | null = null;

const launchBrowser = async (): Promise<puppeteer.Browser> =>
    puppeteer.launch({
        headless: 'shell',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--disable-default-apps',
            '--disable-hang-monitor',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-sync',
            '--disable-translate',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-crash-upload',
            '--no-default-browser-check',
            '--no-pings',
            '--no-service-autorun',
        ],
    });

export const getBrowser = () => {
    if (instance) {
        // browser already available
        return instance;
    }

    if (instancePromise) {
        // browser currently starting
        return instancePromise;
    }

    // start initializing and update the local variable
    instancePromise = launchBrowser();

    // then return the promise we just created
    return instancePromise.then(browser => {
        // update the local variable
        instance = browser;

        // then return it
        return browser;
    });
};

export const closeBrowser = () => {
    if (!instance) {
        return Promise.resolve();
    }

    return instance.close();
};
