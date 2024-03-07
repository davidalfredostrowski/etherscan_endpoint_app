
const express = require('express');
const axios = require('axios');

const app = express();

// Replace 'YOUR_API_KEY' with your actual Etherscan API key
const API_KEY = 'J1ZH3DNWVB6W8UXHB2HHV8ZV5C74D17ZSD';

// Endpoint to get ETH balance of a wallet address
app.get('/eth_balance', async (req, res) => {
    const { address } = req.query;
    if (!address) {
        return res.status(400).json({ error: 'Address parameter is missing.' });
    }

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
            return res.json({ address: address, eth_balance: balance_eth });
        } else {
            return res.status(500).json({ error: 'Unable to fetch ETH balance.' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Endpoint to get USDT balance of a wallet address
app.get('/usdt_balance', async (req, res) => {
    const { address } = req.query;
    if (!address) {
        return res.status(400).json({ error: 'Address parameter is missing.' });
    }

    try {
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'tokenbalance',
                contractaddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT contract address
                address: address,
                tag: 'latest',
                apikey: API_KEY
            }
        });

        const data = response.data;

        if (data.status === '1') {
            const balance = parseInt(data.result) / 1e6; // USDT balance is in 6 decimal places
            return res.json({ address: address, usdt_balance: balance });
        } else {
            return res.status(500).json({ error: 'Unable to fetch USDT balance.' });
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

