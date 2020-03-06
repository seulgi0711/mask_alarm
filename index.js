const puppeteer = require("puppeteer");
const axios = require("axios");

const target =
  "http://www.welkeepsmall.com/shop/shopdetail.html?branduid=922816&xcode=023&mcode=001&scode=&special=1&GfDT=bmx6W18%3D";

const sendHook = () => {
  axios.post(
    "https://hook.dooray.com/services/1387695619080878080/2694511431369318838/FQ9OO41dSg-vPVA2KiD5-g",
    {
      botName: "마스크 살수있다!",
      text: target,
      attachments: [{ text: "카카오로 로그인" }]
    }
  );
};

const checkAndReload = async page => {
  const soldout = await page.$(".soldout");

  if (soldout) {
    console.log("솔드아웃");
    await page.waitFor(1000 * 30);
    await Promise.all([
      page.waitForNavigation(), // The promise resolves after navigation has finished
      page.reload({ waitUntil: ["domcontentloaded"] }) // Clicking the link will indirectly cause a navigation
    ]);
    checkAndReload(page);
  } else {
    console.log("살 수 있음");
    sendHook();
    await browser.close();
  }
};

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(target);

  await checkAndReload(page);
})();
