const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = 'J1ZH3DNWVB6W8UXHB2HHV8ZV5C74D17ZSD';

app.get('/', async (req, res) => {
    // const { address } = req.query;
    //if (!address) {
    //    return res.status(400).json({ error: 'Address parameter is missing.' });
    //}
    address = '0x758b8178A9A4B7206D1f648c4a77C515CbaC7000';
    try {
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'balance',
                address: address,
                tag: 'latest',
                apikey: API_KEY
            }
        });

        const data = response.data;

        if (data.status === '1') {
            const balance_wei = parseInt(data.result);
            const balance_eth = balance_wei / 1e18; // Convert from wei to ETH
            return res.json({ address: address, balance: balance_eth });
        } else {
            return res.status(500).json({ error: 'Unable to fetch balance.' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
