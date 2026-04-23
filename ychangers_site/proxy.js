const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Разрешаем всем (твоему HTML) обращаться к этому серверу
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/exchange', async (req, res) => {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://ychangers.com/tr/',
            data: new URLSearchParams(req.body).toString(),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://ychangers.com',
                'Referer': 'https://ychangers.com/'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Ошибка прокси:', error.message);
        res.status(500).json({ error: 'Ошибка при запросе к API' });
    }
});

app.listen(3000, () => {
    console.log('Прокси-сервер запущен на http://localhost:3000');
});