const express = require("express");
const { default: makeWASocket, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/pair", async (req, res) => {
    try {
        const { number } = req.body; // body එකෙන් number ගන්නවා (94XXXXXXX format)
        if (!number) return res.status(400).json({ error: "❌ Number required!" });

        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            printQRInTerminal: false // browser එකේ QR print කරන්න ඕන නැහැ
        });

        // Pairing code request
        const code = await sock.requestPairingCode(number);
        return res.json({ pair_code: code });
    } catch (err) {
        console.error("❌ Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Pair Code API running on http://localhost:${PORT}`);
});
