const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch(
        {
            executablePath: '../Chromium/chrome-win/chrome.exe',
            headless: false
        }
    );
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});

    await browser.close();
})();