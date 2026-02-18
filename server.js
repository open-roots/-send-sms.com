const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors()); // ✅ allow frontend requests
app.use(express.json());

// ✅ Exactly 5 verified sender IDs
const VERIFIED_SENDERS = [
  "CraftPay Plc",
  "CraftPay Plc",
  "CraftPay Plc",
  "CraftPay Plc",
  "CraftPay Plc"
];

// ✅ Your Infobip base URL already inserted
const INFOBIP_BASE_URL = "https://pdpr9m.api.infobip.com";

// ✅ Put your API key here
const INFOBIP_API_KEY = "dba08d865d12f363f1b7a4aba61600ed-6620a483-ee25-4544-960d-d69bfcdf2a90";

app.post("/send-sms", async (req, res) => {
  try {
    const { to, text, sender } = req.body;

    // sender required
    if (!sender) {
      return res.status(400).json({
        error: "Sender ID is required"
      });
    }

    // reject if sender not verified
    if (!VERIFIED_SENDERS.includes(sender)) {
      return res.status(403).json({
        error: "Sender ID not allowed",
        allowed: VERIFIED_SENDERS
      });
    }

    // required fields
    if (!to || !text) {
      return res.status(400).json({
        error: "Phone number and text are required"
      });
    }

    const response = await axios.post(
      INFOBIP_BASE_URL + "/sms/2/text/advanced",
      {
        messages: [
          {
            from: sender,
            destinations: [{ to }],
            text: text
          }
        ]
      },
      {
        headers: {
          Authorization: `App ${INFOBIP_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("SMS API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
