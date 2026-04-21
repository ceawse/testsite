const websiteScraper = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const path = require('path');

// Исправляем импорты для новых версий библиотек
const scrape = websiteScraper.default || websiteScraper;
const PluginClass = PuppeteerPlugin.default || PuppeteerPlugin;

async function start() {
    const destDir = path.resolve(__dirname, 'ychangers-clone');

    try {
        console.log("Начинаю скачивание... Откроется окно браузера.");

        await scrape({
            urls: ['https://ychangers.com/en/'],
            directory: destDir,
            recursive: true,
            maxRecursiveDepth: 2,
            requestConcurrency: 1, // Один запрос за раз, чтобы не забанили
            plugins: [
                new PluginClass({
                    launchOptions: {
                        headless: false // Ты будешь видеть, как браузер ходит по сайту
                    },
                    scrollToBottom: { timeout: 3000, viewportN: 2 }
                })
            ]
        });

        console.log("------------------------------------------");
        console.log("Успех! Сайт полностью скопирован.");
        console.log(`Путь к файлам: ${destDir}`);
        console.log("------------------------------------------");

    } catch (err) {
        if (err.message.includes('directory') && err.message.includes('exists')) {
            console.error("ОШИБКА: Папка 'ychangers-clone' уже существует. Удали её перед запуском!");
        } else {
            console.error("Произошла ошибка:", err);
        }
    }
}

start();