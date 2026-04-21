const websiteScraper = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const path = require('path');

const scrape = websiteScraper.default || websiteScraper;
const PluginClass = PuppeteerPlugin.default || PuppeteerPlugin;

async function start() {
    // ВАЖНО: Удали папку ychangers-main вручную перед запуском!
    const destDir = path.resolve(__dirname, 'ychangers-main');

    try {
        console.log("Начинаю скачивание ГЛАВНОЙ страницы...");

        await scrape({
            urls: ['https://ychangers.com/en/'],
            directory: destDir,
            recursive: false, // ВЫКЛЮЧАЕМ переход по ссылкам
            requestConcurrency: 1,
            plugins: [
                new PluginClass({
                    launchOptions: {
                        headless: false
                    },
                    scrollToBottom: { timeout: 3000, viewportN: 2 }
                })
            ]
        });

        console.log("------------------------------------------");
        console.log("Успех! Главная страница сохранена в ychangers-main");
        console.log("------------------------------------------");

    } catch (err) {
        if (err.message.includes('directory') && err.message.includes('exists')) {
            console.error("ОШИБКА: Папка уже существует. Удали её!");
        } else {
            console.error("Произошла ошибка:", err);
        }
    }
}

start();