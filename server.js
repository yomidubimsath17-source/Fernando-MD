const express = require("express");
const cors = require("cors"); // 👉 CORS import
const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  fetchLatestBaileysVersion 
} = require("@whiskeysockets/baileys");
const pino = require("pino");

const app = express();
app.use(cors()); // 👉 Enable CORS

const PORT = process.env.PORT || 3000;

// 👉 root route
app.get("/", (req, res) => {
  res.send("✅ WhatsApp Pair Code Server is Running!");
});

// 👉 pair code route
app.get("/pair", async (req, res) => {
  const phoneNumber = req.query.number;
  if (!phoneNumber) {
    return res
      .status(400)
      .json({ error: "⚠️ Please provide ?number=94XXXXXXXXX" });
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      logger: pino({ level: "silent" }),
      auth: state,
      version,
    });

    sock.ev.on("creds.update", saveCreds);

    // request pair code
    const code = await sock.requestPairingCode(phoneNumber);
    console.log("📌 Pair Code for", phoneNumber, "is:", code);

    res.json({ number: phoneNumber, pairCode: code });
  } catch (err) {
    console.error("❌ Error generating pair code:", err.message);
    res
      .status(500)
      .json({ error: "Failed to generate pair code", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
