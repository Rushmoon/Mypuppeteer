const puppeteer = require('puppeteer');
/*tip
1.page.click(selector,{button:right}) 这个button:right 指的居然是鼠标右击。。。。醉了
  click的方法在实现上还是模拟的真实鼠标点击，所以注意代码可以点透，但真实情况不可以
* */


(async () => {
    const browser = await puppeteer.launch(
        {
            //当使用自己下载的chromium的时候使用的
            executablePath: '../../Chromium/chrome-win/chrome.exe',
            headless: false
        }
    );
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    await page.$eval('#kw',inputDom=> inputDom.value = '');
    await page.$eval('#kw',inputDom=> inputDom.value = 'puppeteer');
    //官方文档上说当点击的按钮存在跳转的时候要等待一个函数。。。。
    // const navigationPromise = page.waitForNavigation({"timeout":10000});
    await page.click('#su');
    // await navigationPromise;
    //不存在跳转但需要等待页面的加载,通过调用一系列waitFor函数
    await page.waitForSelector('#content_left');
    //$的方法只是类似于querySelector 用于帮助定位用的，要想获取元素之中的属性，或者其中的内容，还是要使用$eval,或者是evaluate
    let content =await page.$('.nums_text');
    let contentResult = await page.evaluate(dom=> dom.innerHTML,content);
    console.log("evaluate方法获取",contentResult);

    let result =await page.$eval('.nums_text',content=> content.innerText);
    console.log("直接使用eval方法获取",result);
    await browser.close();
})();