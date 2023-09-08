// const {default: puppeteer} = require('puppeteer');
const { default: puppeteer } = require("puppeteer");
const { writeFile, readFile } = require("fs/promises");
const { load } = require("cheerio");

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  });
  const page = await browser.newPage();
  await page.goto("https://www.myntra.com/");
  await page.type(
    "#desktop-header-cnt > div.desktop-bound > div.desktop-query > input",
    "tops"
  );
  //   await page.type("input[type=search]", "tops");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
  const productdata = [];
  const $ = load(await page.content());
  $("div.search-searchProductsContainer.row-base > section > ul > li").each(
    (_, el) => {
      if (productdata.length < 20) {
        productdata.push({
          //   name: $(el).find("h3").text(),
          name: $("h3", el).text(),
          price: $("div > span > span.product-discountedPrice", el).text(),
          decription: $(
            "div.product-productMetaInfo > h4.product-product",
            el
          ).text(),
          Image_Url: $("div > picture > img", el).attr("src"),
          Product_Url: "https://www.myntra.com/" + $("a", el).attr("href")
        });
      }
    }
  );
  await writeFile("product.json", JSON.stringify(productdata));
  await browser.close();
};
main();

