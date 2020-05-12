const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch(
        {
            //当使用自己下载的chromium的时候使用的
            executablePath: '../../Chromium/chrome-win/chrome.exe',
            headless: false
        }
    );

/*
* browse的“钩子”
* 1.disconnected 事件 当在chromium实例连接断开的时候调用
* 2.targetchanged 事件 当目标的url改变时触发
* 3.tarcreated  当目标被创建时被触发。。（一开始被触发？）例如当通过window.open或browser.newPage打开一个新的页面
* 4.targetdestroyed 当目标被销毁时被处罚，例如当一个页面被关闭时。。
* */

/*
    //browse的断开连接以及重连
    // 返回浏览器实例的 socket 连接 URL, 可以通过这个 URL 重连接 chrome 实例 保存 Endpoint，这样就可以重新连接  Chromium
    const browserWSEndpoint = browser.wsEndpoint();
    //断开与chromium实例的连接，
    browser.disconnect()
    // 使用endpoint 重新和 Chromiunm 建立连接
    const browser2 = await puppeteer.connect({browserWSEndpoint});
    await browser2.close();
*/

    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});
    //关闭浏览器
    await browser.close();
})();