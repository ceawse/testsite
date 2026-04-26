const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

// Укажи здесь точное имя папки, где лежат твои файлы
const sitePath = path.join(__dirname, 'ychangers_site');

// Парсеры данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Функция для исправления ошибки s2.substring (превращает числа в строки рекурсивно)
function stringifyNumbers(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'number') {
            obj[key] = String(obj[key]); // Число -> Строка
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            stringifyNumbers(obj[key]); // Идем вглубь объекта
        }
    }
    return obj;
}

// 1. ПРОКСИ ДЛЯ КУРСОВ (С исправлением ошибки substring)
app.post(/.*/, async (req, res, next) => {
    if (req.body && req.body.action) {
        console.log(`[API] Запрос курса: ${req.body.action} на ${req.path}`);
        try {
            const response = await axios({
                method: 'post',
                url: `https://ychangers.com${req.path}`,
                data: new URLSearchParams(req.body).toString(),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            let data = response.data;

            // ПРИМЕНЯЕМ ФИКС: Превращаем все числа в ответе в строки
            if (data && typeof data === 'object') {
                data = stringifyNumbers(data);
            }

            return res.json(data);
        } catch (error) {
            console.error('[API ERROR]:', error.message);
            return res.status(500).json({ error: 'Original API error' });
        }
    }
    next();
});

// 2. РЕДИРЕКТ (Убираем index.html из адресной строки)
app.use((req, res, next) => {
    if (req.url.endsWith('/index.html')) {
        const newPath = req.url.replace(/\/index\.html$/, '/');
        return res.redirect(301, newPath);
    }
    next();
});

// 3. СТАТИКА
app.use(express.static(sitePath, {
    extensions: ['html'],
    index: 'index.html',
    setHeaders: (res, filePath) => {
        // Устраняем проблему со шрифтами (rejected by sanitizer)
        if (filePath.endsWith('.woff2')) res.setHeader('Content-Type', 'font/woff2');
        if (filePath.endsWith('.woff')) res.setHeader('Content-Type', 'font/woff');
    }
}));

// 4. ГЛАВНАЯ СТРАНИЦА
app.get('/', (req, res) => {
    res.redirect('/en/');
});

// 5. ОБРАБОТКА ОШИБОК
app.use((req, res) => {
    console.log(`[404] Файл не найден: ${req.url}`);
    res.status(404).send('Page not found. Check if the folder ychangers_site exists.');
});

app.use((err, req, res, next) => {
    console.error('[SERVER ERROR]:', err.stack);
    res.status(500).send('Internal Server Error');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`СЕРВЕР РАБОТАЕТ: http://localhost:${PORT}`);
    console.log(`ПУТЬ К ФАЙЛАМ: ${sitePath}`);
    console.log(`===========================================`);
});