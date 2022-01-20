const puppeteer = require('puppeteer');
const moment = require('moment');
const date = new Date();
const fs = require('fs');
const { exit } = require('process');
const cookiesPath = "cookies_addFriendSgbesar.txt";

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu',
            '--start-maximized',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
        ],
    });


    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://mbasic.facebook.com", ["geolocation", "notifications"]);
    const page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 768
    });


    const previousSession = fs.existsSync(cookiesPath)
    let havecookie = false ;
    if (previousSession) {
        const content = fs.readFileSync(cookiesPath);
        const cookiesArr = JSON.parse(content);
        
        if (cookiesArr.length !== 0) {
            for (let cookie of cookiesArr) {
            await page.setCookie(cookie)
            havecookie = true ;
            }
            console.log('Session has been loaded in the browser')
        }
        
    }

    await page.goto('https://mbasic.facebook.com', {
        waitUntil: 'networkidle2',
    });

  if(havecookie === false){
    let linkAAc = await page.$x('//span[contains(text(), "Allow All Cookies")]')
    if (linkAAc.length > 0) {
      await linkAAc[0].click()
    }
    await page.waitForTimeout(3000) 

    var linkAa = await page.$x('//button[contains(text(), "Accept All")]')
    if (linkAa.length > 0) {
      await linkAa[0].click()
    }
    await page.waitForTimeout(3000) 

    await page.waitForSelector('#m_login_email');
    await page.type('#m_login_email', 'xxx@gmail.com'); //masukkan email facebook
    await page.type(`input[name="pass"]`, 'xxxxxxx'); //masukkan password facebook
    await page.waitForTimeout(3000) 
    await page.click(`input[name="login"]`);
    await page.waitForTimeout(3000) 
    await page.click(`input[value="OK"]`);
    await page.waitForTimeout(3000) 
    

    // Write Cookies
    const cookiesObject = await page.cookies()
    fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
    console.log('Session has been saved to ' + cookiesPath);
  }


  await page.goto('https://mbasic.facebook.com/home.php', {
    waitUntil: 'networkidle2',
  });

  await page.waitForTimeout(3000)
  await page.type('textarea[placeholder="What\'s on your mind?"]', `Post seuatu di wall facebook`); //
  await page.waitForTimeout(3000)
  await page.$$eval('input[name="view_post"]', elements => elements[0].click());
  await page.waitForTimeout(3000)     
  console.log(`post kat wall end: ${moment().format('yyyy-mm-dd-hh-mm-ss')}`); 

  await browser.close();
  console.log('finished');
  process.exit();


})();
