const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const sitePath = path.join(__dirname, 'ychangers_site');

// 1. Статические файлы
app.use(express.static(sitePath, {
    extensions: ['html']
}));

// 2. Редирект с главной на английскую версию, если зашли просто на localhost:3000
app.get('/', (req, res) => {
    if (fs.existsSync(path.join(sitePath, 'en', 'index.html'))) {
        res.redirect('/en/');
    } else {
        res.send('Сайт еще не скачан или структура отличается. Проверьте папку ychangers_site');
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен: http://localhost:3000');
});