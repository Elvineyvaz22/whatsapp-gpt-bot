const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth()
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

client.on('qr', qr => {
    console.log('📲 QR Kod yaradıldı, telefonla skan et:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp GPT bot hazırdır!');
});

client.on('message', async message => {
    if (message.body.length < 2) return;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Səmimi, qısa və köməkçi cavab ver." },
                { role: "user", content: message.body }
            ]
        });

        const reply = response.choices[0].message.content;
        message.reply(reply);
    } catch (err) {
        console.error("GPT xətası:", err);
        message.reply("Xəta baş verdi, sonra yenidən cəhd et.");
    }
});

client.initialize();
