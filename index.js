const path = require('path');
const fs = require('fs');

let scrape = require('website-scraper');
if (typeof scrape !== 'function' && scrape.default) {
    scrape = scrape.default;
}

let PuppeteerPlugin = require('website-scraper-puppeteer');
if (typeof PuppeteerPlugin !== 'function' && PuppeteerPlugin.default) {
    PuppeteerPlugin = PuppeteerPlugin.default;
}

const dir = path.resolve(__dirname, 'ychangers_site_main');

// Очистка папки перед запуском
if (fs.existsSync(dir)) {
    console.log("Очистка старой папки...");
    fs.rmSync(dir, { recursive: true, force: true });
}

const options = {
    urls: ['https://ychangers.com/en/'],
    directory: dir,

    // ИЗМЕНЕНИЯ ТУТ: Отключаем рекурсию
    recursive: false,       // Скачать только указанный URL
    maxRecursiveDepth: 0,   // Глубина 0 означает только саму страницу без перехода по ссылкам

    requestConcurrency: 3,

    filenameGenerator: 'bySiteStructure',

    plugins: [
        new PuppeteerPlugin({
            launchOptions: {
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            // Оставляем это, чтобы прогрузились ленивые (lazy-load) картинки на главной
            scrollToBottom: { timeout: 15000, viewportN: 15 }
        })
    ],

    // Ресурсы всё равно нужно скачивать, чтобы страница отображалась корректно
    sources: [
        {selector: 'img', attr: 'src'},
        {selector: 'img', attr: 'srcset'},
        {selector: 'link[rel="stylesheet"]', attr: 'href'},
        {selector: 'script', attr: 'src'},
        {selector: 'link[rel*="icon"]', attr: 'href'},
        {selector: 'source', attr: 'src'},
        {selector: 'video', attr: 'src'},
        {selector: 'use', attr: 'xlink:href'},
    ],

    // При отключенной рекурсии urlFilter будет применяться только к ассетам (картинки, стили)
    urlFilter: (url) => {
        const isInternal = url.startsWith('https://ychangers.com') || url.startsWith('http') === false;
        const isOtherLang = /\/(ru|zh|et|es|de|bg|tr|pl|fr)\//.test(url);
        return isInternal && !isOtherLang;
    },

    subdirectories: [
        {directory: 'assets/img', extensions: ['.jpg', '.png', '.svg', '.gif', '.webp', '.ico']},
        {directory: 'assets/js', extensions: ['.js']},
        {directory: 'assets/css', extensions: ['.css']},
        {directory: 'assets/fonts', extensions: ['.woff', '.woff2', '.ttf', '.eot']}
    ],
};

console.log("Запуск скачивания главной страницы...");

scrape(options).then(() => {
    console.log("-----------------------------------------");
    console.log("ГОТОВО!");
    console.log(`Главная страница сохранена в: ${dir}`);
    console.log("-----------------------------------------");
}).catch((err) => {
    console.error("Ошибка:");
    console.error(err);
});