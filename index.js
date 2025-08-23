const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, useCodePairing } = require('@whiskeysockets/baileys')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        version
    })

    sock.ev.on('creds.update', saveCreds)

    // 👉 Pair Code method
    if (!state.creds.registered) {
        let phoneNumber = "94761549297"  // ✅ ඔබගේ WhatsApp නම්බර් (94 country code සමග)
        let code = await useCodePairing(sock, phoneNumber)
        console.log("📌 Your Pair Code is:", code)
    }

    sock.ev.on('connection.update', (update) => {
        const { connection } = update
        if (connection === 'open') {
            console.log("✅ Bot Connected Successfully!")
        }
    })
}

startBot()
