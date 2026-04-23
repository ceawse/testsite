const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

// --- ВНИМАНИЕ: Проверь имя папки! ---
// В начале чата ты писал 'ychangers_site_main', в коде ниже 'ychangers_site'.
// Укажи здесь точное имя папки, где лежат твои файлы.
const sitePath = path.join(__dirname, 'ychangers_site');

// Парсеры (нужны для работы прокси)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. ПРОКСИ ДЛЯ КУРСОВ (Ловим POST запросы от калькулятора)
app.post(/.*/, async (req, res, next) => {
    if (req.body && req.body.action) {
        console.log(`[API] Запрос курса: ${req.body.action} на ${req.path}`);
        try {
            const response = await axios({
                method: 'post',
                url: `https://ychangers.com${req.path}`,
                data: new URLSearchParams(req.body).toString(),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) rv:120.0',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return res.json(response.data);
        } catch (error) {
            console.error('[API ERROR]:', error.message);
            return res.status(500).json({ error: 'Original API error' });
        }
    }
    next();
});

// 2. РЕДИРЕКТ (Убираем index.html из адресной строки для красоты)
app.use((req, res, next) => {
    if (req.url.endsWith('/index.html')) {
        const newPath = req.url.replace(/\/index\.html$/, '/');
        return res.redirect(301, newPath);
    }
    next();
});

// 3. СТАТИКА (Раздаем твои HTML, CSS, Картинки)
app.use(express.static(sitePath, {
    extensions: ['html'],
    index: 'index.html'
}));

// 4. ГЛАВНАЯ СТРАНИЦА (Редирект с / на /en/)
app.get('/', (req, res) => {
    res.redirect('/en/');
});

// 5. ОБРАБОТКА ОШИБОК (Чтобы не было белого экрана 204)
app.use((req, res) => {
    console.log(`[404] Файл не найден: ${req.url}`);
    // Вместо 204 (пустоты) лучше отдавать 404 или главную страницу
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