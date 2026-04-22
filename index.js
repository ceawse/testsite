let scrape = require('website-scraper');
// Если scrape загрузился как объект, берем из него .default
if (typeof scrape !== 'function' && scrape.default) {
    scrape = scrape.default;
}

let PuppeteerPlugin = require('website-scraper-puppeteer');
if (typeof PuppeteerPlugin !== 'function' && PuppeteerPlugin.default) {
    PuppeteerPlugin = PuppeteerPlugin.default;
}

const path = require('path');
const fs = require('fs');

const dir = path.resolve(__dirname, 'ychangers_site');

// ВАЖНО: website-scraper выдаст ошибку, если папка уже существует.
// Удаляем папку перед запуском, если она есть.
if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
}

const options = {
  urls: ['https://ychangers.com/'],
  directory: dir,
  recursive: false,
  plugins: [
    new PuppeteerPlugin({
      launchOptions: {
        headless: "new"
      },
      scrollToBottom: { timeout: 10000, viewportN: 10 }
    })
  ],
  sources: [
    {selector: 'img', attr: 'src'},
    {selector: 'link[rel="stylesheet"]', attr: 'href'},
    {selector: 'script', attr: 'src'},
    {selector: 'link[rel*="icon"]', attr: 'href'}
  ],
  subdirectories: [
    {directory: 'img', extensions: ['.jpg', '.png', '.svg', '.gif', '.webp']},
    {directory: 'js', extensions: ['.js']},
    {directory: 'css', extensions: ['.css']},
    {directory: 'fonts', extensions: ['.woff', '.woff2', '.ttf']}
  ],
};

console.log("Начинаю загрузку... Это может занять около 30 секунд.");

scrape(options).then(() => {
  console.log("Готово! Проверь папку ychangers_site");
}).catch((err) => {
  console.error("Произошла ошибка во время выполнения:");
  console.error(err);
});