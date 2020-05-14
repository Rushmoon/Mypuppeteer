const puppeteer = require('puppeteer');
const readline = require('readline');
const URL = 'http://10.10.18.229:8809';
(async () => {
    const browser = await puppeteer.launch(
        {
            //当使用自己下载的chromium的时候使用的
            executablePath: '../../Chromium/chrome-win/chrome.exe',
            headless: true,
            //取消大片空白
            defaultViewport: null,
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
    await page.waitFor(3000);
    await page.waitForSelector('.nc-workbench-allAppsBtn');
    // ant-select-selection-selected-value
    const groupContent =await page.$('.ant-select-selection-selected-value');
    const dbName = await page.evaluate(dom=> dom.innerHTML,groupContent);
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
    await page.waitFor(2000);
    /*调出菜单*/
    /*尝试去使用$$和evaluate去配合 来完成对元素的查找，事实证明没搞懂。。。
    let mapList = await page.$$('.result-group-list');
    let contentResult = await page.evaluate(Arr=> {
        let resultDom = null;
        Arr.map(item=>{
            console.log(item.firstChild);
            if(item.firstChild.lastChild.innerHTML === "人力资本"){
                resultDom = item.lastChild
            }
        });
         return resultDom
    },mapList);
    */
    /*emmm没关系，我们先试试这个$$eval*/
    const HRIndex = await page.$$eval('div.result-group-list h4.result-header span.result-header-name',nodeList=>{
        let result  = -1;
        for (var i=0;i<nodeList.length;i++){
            if(nodeList[i].innerHTML === "人力资本"){
                result = i;
            }
        }
        return result + 1
    });
    console.log('获取人力资本的index！',HRIndex);
    page.click("div.result-group-list:nth-child("+HRIndex+") .result-app-list .app-col:nth-child(3) .list-item-content");
    await page.waitFor(2000);
    let startDate = new Date();
    console.log("开始时间"+startDate.getHours()+":"+startDate.getMinutes());
    await Promise.all(
        [page.waitForNavigation({'timeout':0,"waitUntil":"networkidle0"}),
            page.click(".content div.content-item .content-item-content .item-app")
            ]
    ).catch(err=>{
        console.error(err)
    });
    await page.waitFor(2000);
    // const tableLength = await page.$$eval('table tbody.u-table-tbody tr.u-table-row',table=>table.index);
    let currentDate = new Date();
    console.log("结束时间"+currentDate.getHours()+":"+currentDate.getMinutes());
    /*退出登录
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
    await page.waitFor(500);
     */
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