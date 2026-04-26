const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const sitePath = path.join(__dirname, 'ychangers_site');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. ПРОКСИ ДЛЯ КУРСОВ (Без изменений)
app.post(/.*/, async (req, res, next) => {
    if (req.body && req.body.action) {
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
            return res.json(response.data);
        } catch (error) {
            return res.status(500).json({ error: 'Proxy error' });
        }
    }
    next();
});

// 2. УМНАЯ СТАТИКА
// Настраиваем так, чтобы /en/contacts открывал /en/contacts/index.html автоматически
app.use(express.static(sitePath, {
    extensions: ['html'], // позволяет обращаться /kyc вместо /kyc.html
    index: 'index.html'
}));

// 3. ГЛАВНЫЙ РЕДИРЕКТ
app.get('/', (req, res) => {
    res.redirect('/en/');
});

// 4. ОБРАБОТКА ОШИБОК (404)
// Если файл не найден, не отдаем пустоту, а возвращаем на главную или пишем ошибку
app.use((req, res) => {
    res.status(404).send('File not found in ychangers_site');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});