const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const sitePath = path.join(__dirname, 'ychangers_site');

// Парсеры данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. УНИВЕРСАЛЬНЫЙ ПРОКСИ
// Используем регулярное выражение /.*/ вместо строк, чтобы избежать ошибок синтаксиса
app.post(/.*/, async (req, res, next) => {
    // Если в запросе есть action, значит это наш калькулятор
    if (req.body && req.body.action) {
        console.log(`[PROXY] Запрос: ${req.body.action} -> ${req.path}`);
        try {
            const response = await axios({
                method: 'post',
                url: `https://ychangers.com${req.path}`,
                data: new URLSearchParams(req.body).toString(),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) rv:120.0',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': 'https://ychangers.com',
                    'Referer': `https://ychangers.com${req.path}`
                }
            });
            return res.json(response.data);
        } catch (error) {
            console.error('[PROXY ERROR]:', error.message);
            return res.status(500).json({ error: 'Original API is not responding' });
        }
    }
    next();
});

// 2. ТВОЯ СТАТИКА
app.use(express.static(sitePath, {
    extensions: ['html'],
    index: 'index.html'
}));

// 3. ТВОИ РЕДИРЕКТЫ
app.use((req, res, next) => {
    if (req.url.endsWith('/index.html')) {
        const newPath = req.url.replace(/\/index\.html$/, '/');
        return res.redirect(301, newPath);
    }
    next();
});

app.get('/', (req, res) => {
    res.redirect('/en/');
});

// 4. ТВОЯ ОБРАБОТКА ОШИБОК
app.use((req, res) => {
    res.status(204).end();
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(204).end();
});

app.listen(3000, () => {
    console.log('-------------------------------------------');
    console.log('СЕРВЕР РАБОТАЕТ: http://localhost:3000');
    console.log('-------------------------------------------');
});