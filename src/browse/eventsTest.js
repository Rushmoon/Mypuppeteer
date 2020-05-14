const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch(
        {
            //当使用自己下载的chromium的时候使用的
            executablePath: '../../Chromium/chrome-win/chrome.exe',
            headless: false
        }
    );
    const disconnectEvent =()=>{
        console.log("断开连接")
    };
    const changeEvent =()=>{
        console.log("切换目标")
    };
    const targetInt1 =()=>{
        console.log("初次进入标签1")
    };
    const targetInt2 =()=>{
        console.log("初次进入标签2")
    };

    /*
    * browse的“钩子”
    * 1.disconnected 事件 当在chromium实例连接断开的时候调用
    * 2.targetchanged 事件 当目标的url改变时触发
    * 3.tarcreated  当目标被创建时被触发。。（新页面一开始被触发）例如当通过window.open或browser.newPage打开一个新的页面
    * 4.targetdestroyed 当目标被销毁时被处罚，例如当一个页面被关闭时。。
    *
    * (1).自己手动点的也触发钩子函数，源代码触发的跳转或者地址变化触发，有待验证2。地址变换触发targetchange的钩子，验证源代码跳转也会触发targeChange钩子
    * (2).url改变后面的hash改变算url改变
    *
    * tip
    * 1.page.waitForNavigation()  a.如果时间不确定的话，就使用timeout：0 注意不要加载过于复杂的页面，会有很长时间的加载时间。百度搜索加载了10分钟没出来。。。。
    *                             b.page.waitForNavigation 的参数如果不写的话，就会传输默认的值，所以理论上是都要传的，你不传，他就自己传
    * */
    browser.on('targetchanged',changeEvent);
    browser.on('disconnected',disconnectEvent);
    browser.on('targetcreated',targetInt1);
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    // await page.goto('http://www.example.com');
    /*单页面内的跳转*/
    /*
    await page.$eval('#kw',inputDom=> inputDom.value = '');
    await page.$eval('#kw',inputDom=> inputDom.value = 'puppeteer');
    await page.click('#su');
    //不存在跳转但需要等待页面的加载,通过调用一系列waitFor函数
    await page.waitForSelector('#content_left');
    let content =await page.$eval('.nums_text',content=> content.innerText);
    console.log(content);
    */

    /*跳转其他页面*/
    /* */
    //设置系统默认的超时时间
    // await page.setDefaultNavigationTimeout(5000);
    await page.waitForSelector('#hotsearch-content-wrapper');
    //官方文档上说当点击的按钮存在跳转的时候要加一个等待函数。。。。最好使用并发的方式，将两个合到一起，这样就不会报延迟出错的警告了
    await Promise.all(
     [page.waitForNavigation({'timeout':100000,'waitUntil':'networkidle0'},),
            page.click('.hotsearch-item')]
    ).catch(err=>{
        console.error(err)
    });

    let content =await page.$eval('.nums_text',content=> content.innerText);
    console.log(content);

    /*从当前连接断开,并从之前的连接重新连接*/
    /*
    const browserWSEndpoint = browser.wsEndpoint();
    browser.disconnect();
    // 使用endpoint 重新和 Chromiunm 建立连接
    const browser2 = await puppeteer.connect({browserWSEndpoint});
    browser2.on('targetchanged',changeEvent);
    browser2.on('tarcreated',targetInt1)
    */
    await browser.close();
})();