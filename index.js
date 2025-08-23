const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true, // ✅ QR එක දැන් terminal එකේ print වෙනවා
        auth: state,
        version
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update
        if (qr) {
            console.log("📌 Scan me with WhatsApp:", qr)
        }
        if (connection === 'open') {
            console.log("✅ Bot Connected Successfully!")
        }
    })
}

startBot()
