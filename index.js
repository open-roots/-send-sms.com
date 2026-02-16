const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTk5NDIyOTdBQkQzQjQwRiIsImlhdCI6MTc3MTE5MTk1MiwiZXhwIjoxOTI4ODcxOTUyfQ.1uO3OU7au_N9-1T-OCt92f39VnmVF51md_5Fm6O81o-_qkB4kgjKj8HvXNXPe3nPU8yoxV-Rw5t0zhAtsNqz9w-_qkB4kgjKj8HvXNXPe3nPU8yoxV-Rw5t0zhAtsNqz9w";

// NEW: Health Check Route to wake up the server
app.get('/health', (req, res) => {
    res.status(200).json({ status: "Online", message: "Server is awake and ready." });
});

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
        // Improved Error Logging
        console.error("Backend Error:", err.response ? err.response.data : err.message);
        res.status(err.response ? err.response.status : 500).json({
            error: "SMS Gateway Error",
            details: err.response ? err.response.data : "Internal Server Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});

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
