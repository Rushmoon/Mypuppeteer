const puppeteer = require('puppeteer');
const readline = reuquire('readline');
const URL = 'http://10.10.18.229:8809';
(async () => {
    const browser = await puppeteer.launch(
        {
            //当使用自己下载的chromium的时候使用的
            executablePath: '../../Chromium/chrome-win/chrome.exe',
            headless: false,
            args:[`--window-size=${1280},${680}`],
        }
    );
    const page = await browser.newPage();
    await page.goto(URL);
    await page.waitForSelector('.content-right');
    await page.$eval('#username',inputDom=> inputDom.value = '');
    await page.$eval('#username',inputDom=> inputDom.value = 'zhi');
    await page.$eval('#password',inputDom=> inputDom.value = '');
    await page.$eval('#password',inputDom=> inputDom.value = '1234qwer');
    await page.click('#loginBtn');
    await page.waitForSelector('.nc-workbench-allAppsBtn.nc-workbench-icon-close');
    // ant-select-selection-selected-value
    let groupContent =await page.$('.ant-select-selection-selected-value');
    let dbName = await page.evaluate(dom=> dom.innerHTML,groupContent);
    if(dbName){
        console.log('登录成功！！进入总集团',dbName);
    }
    /* 模拟人的行为等待2秒时间内上下滚动滑轮
    for(let i = 0; i < 30; i++){
        await page.evaluate((i)=>{
            window.scrollTo(0,i*15)
        },i);
        await timeout(50);
    }
     */
    //这里我们使用最稳妥的方法waitFor()
    await page.waitFor(3000);
    /*等待某个接口请求，但貌似不好使。。。要在之后探究使用的方法
    const finalRequest = await page.waitForRequest(request => request.url() === URL + '/nccloud/riart/message/workBenchMessagePushAction.do' && request.method() === 'POST');
     return finalRequest.url();
     */
    //
    await page.click('.nc-workbench-allAppsBtn.nc-workbench-icon-close');
    await page.waitForSelector('.result-group-list');
    /*调出菜单*/




    /*退出登录*/
    //当为主界面的时候用的登出方式
    //     await page.click('.ant-drawer-mask',{button:'right'});
        await page.click('.avatar_container');
        await page.waitFor(1000);

    await page.click('.avatar_container');
    await page.waitFor(1000);
    let currentName =await page.$('div.info span.name');
    let name = await page.evaluate(dom=> dom.innerHTML,currentName);
    await page.click('div.exitDiv');
    await page.waitForSelector('div.u-modal-content');
    await page.click('button.u-button.nc-button-wrapper.button-primary');
    await page.waitFor(500);
    await page.click('button.u-button.ant-tooltip-open.nc-button-wrapper.button-primary');
    console.log(name+'注销账号登出集团',dbName);
    /*
    //参考代码
    await page.waitForSelector('#content_left');
    await page.$eval('#kw',inputDom=> inputDom.value = '');
    await page.$eval('#kw',inputDom=> inputDom.value = 'puppeteer');
    await page.click('#su');
    let content =await page.$('.nums_text');
    let contentResult = await page.evaluate(dom=> dom.innerHTML,content);
    */

    await browser.close();
})();