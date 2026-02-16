const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Data settings
app.use(cors());
app.use(express.json());

// Only keep this if you have a folder named "public" with HTML files in it!
app.use(express.static(path.join(__dirname, 'public')));

// Fetch token securely from Environment Variables
const TOKEN = process.env.MESSAGE_CENTRAL_TOKEN;

app.post('/send-sms', async (req, res) => {
    const { apiType, phone, senderId, message } = req.body;
    
    let url = apiType === 'message' 
        ? "https://cpaas.messagecentral.com/message/v1/send" 
        : "https://api.messagecentral.com/verify/send";

    let payload = apiType === 'message' ? {
        mobileNumber: phone,
        senderId: senderId,
        message: message,
        type: "SMS",
        flowType: "SMS",
        messageType: "TRANSACTIONAL"
    } : {
        phone_number: phone,
        channel: "sms"
    };

    try {
        const result = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        res.status(200).json(result.data);
    } catch (err) {
        // Safe error logging
        console.error("SMS API Error:", err.response?.data || err.message);
        res.status(500).json(err.response ? err.response.data : { error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
