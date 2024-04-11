const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const malawiGateway = 'https://apis.staging.elipa.global/payments/v2/payin/session/create/mw';
const zambiaGateway = 'https://apis.staging.elipa.global/payments/v2/payin/session/create/zm';

app.use(cors());
app.use(bodyParser.json()); 

app.post('/payment', async (req, res) => {
    try {
        const response = await fetch(malawiGateway, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const responseData = await response.json();

        res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});