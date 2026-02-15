const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// This allows the server to read data sent from your HTML form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This tells the server where your HTML/CSS files are located
app.use(express.static(path.join(__dirname, 'public')));

// Your Hardcoded Token
const MY_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTk5NDIyOTdBQkQzQjQwRiIsImlhdCI6MTc3MTE5MTk1MiwiZXhwIjoxOTI4ODcxOTUyfQ.1uO3OU7au_N9-1T-OCt92f39VnmVF51md_5Fm6O81o-_qkB4kgjKj8HvXNXPe3nPU8yoxV-Rw5t0zhAtsNqz9w";

// The Route that handles the SMS sending
app.post('/send-sms', async (req, res) => {
    try {
        const { apiType, phone, senderId, message } = req.body;
        
        let endpoint, payload;

        if (apiType === 'message') {
            endpoint = "https://cpaas.messagecentral.com/message/v1/send";
            payload = {
                "mobileNumber": phone,
                "senderId": senderId,
                "message": message,
                "type": "SMS",
                "flowType": "SMS",
                "messageType": "TRANSACTIONAL"
            };
        } else {
            endpoint = "https://api.messagecentral.com/verify/send";
            payload = {
                "phone_number": phone,
                "channel": "sms"
            };
        }

        const response = await axios.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MY_TOKEN}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response ? error.response.data : "Internal Server Error" 
        });
    }
});

// Use the port Render gives us, or 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
