const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Allows your website to talk to this server

// Your Secret Credentials (In a real app, use Environment Variables!)
const AUTH_TOKEN = "eyJhbGciOiJIUzUxMiJ9...[YOUR_FULL_TOKEN]";
const CUSTOMER_ID = "C-9942297ABD3B40F";

app.post('/send-sms', async (req, res) => {
    const { phone, message, senderId, countryCode } = req.body;

    try {
        const url = `https://cpaas.messagecentral.com/verification/v3/send`;
        
        const response = await axios.post(url, {}, {
            params: {
                countryCode: countryCode || "234",
                customerId: CUSTOMER_ID,
                senderId: senderId || "UTOMOB",
                type: "SMS",
                flowType: "SMS",
                mobileNumber: phone,
                message: message
            },
            headers: { 'authToken': AUTH_TOKEN }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
