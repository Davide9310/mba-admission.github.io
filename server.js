const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/replicate', async (req, res) => {
    const response = await fetch('https://api.replicate.com/v1/models/meta/meta-llama-3.1-405b-instruct/predictions', {
        method: 'POST',
        headers: {
            'Authorization': 'Token r8_8yLpWqtYAhUBPb46ijGAQKYLleepq4d2SgQ80',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
