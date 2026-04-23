const express = require('express');
const path = require('path');
const app = express();

const sitePath = path.join(__dirname, 'ychangers_site');

app.use(express.static(sitePath, {
    extensions: ['html'],
    index: 'index.html'
}));

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

app.use((req, res) => {
    res.status(204).end();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(204).end();
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});