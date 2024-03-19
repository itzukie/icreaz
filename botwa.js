const qrcode = require('qrcode-terminal');
const fs = require("fs");
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { OpenAI } = require("openai");
const openai = new OpenAI({ key: "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" }); // Ganti dengan kunci API yang valid

const client = new Client({
    authStrategy: new LocalAuth({
         clientId: "client-one" //Un identificador(Sugiero que no lo modifiques)
    })
  })

// Simpan nilai sesi ke file setelah otorisasi berhasil
client.on('authenticated', (session) => {
  console.log(session);
});

const axios = require('axios');

const apiKey = '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'; // Ganti dengan kunci API yang valid
const apiUrl = 'https://api.openai.com/v1/completions'; // Ganti dengan URL dan endpoint yang sesuai
const requestData = {
  // ... data permintaan Anda
};

axios.post(apiUrl, requestData, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});

const data = {
  model: 'gpt-3.5-turbo-1106',
  // other parameters or data for your request
};


client.initialize();

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log("Siap mengirim pesan");
});

client.on('message_create', handleIncomingMessage);

async function handleIncomingMessage(message) {
  console.log(message);

  if (message.body.includes('/ask')) {
    let text = message.body.split('/ask')[1];
    var qst = `Q: ${text}\nA:`;

    try {
        const completion = await openai.chat.completions.create({
        engine: "gpt-3.5-turbo-1106", // Ganti dengan engine yang sesuai
        prompt: qst,
        temperature: 0,
        max_tokens: 300,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      if (response && response.choices && response.choices.length > 0) {
        message.reply(response.choices[0].text);
      } else {
        console.error("Respon tidak valid dari OpenAI");
      }
    } catch (error) {
      console.error("Error dari OpenAI:", error);
    }
  } else if (message.body.includes('/draw')) {
    let text = message.body.split('/draw')[1];
    var qst = `Q: ${text}\nA:`;

    try {
      const response = await openai.image.create({
        model: "dall-e-3", // Ganti dengan model yang sesuai
        prompt: qst,
        n: 1,
        size: '512x512',
      });

      if (response && response.data && response.data[0] && response.data[0].url) {
        var imgUrl = response.data[0].url;
        const media = new MessageMedia('image/png', imgUrl);
        await client.sendMessage(message.from, media, { caption: "Gambar Anda" });
      } else {
        console.error("Respon tidak valid dari OpenAI untuk penyelesaian gambar");
      }
    } catch (error) {
      console.error("Error dari OpenAI:", error);
    }
  }
}
