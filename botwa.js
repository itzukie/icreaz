const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const client = new Client({
     authStrategy: new LocalAuth({
          clientId: "client-one" //Un identificador(Sugiero que no lo modifiques)
     })
})

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log(session);
});
 

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})

client.on('ready', () => {
    console.log("ready to message")
});

client.on('message', message => {
	if(message.body === 'Hai') {
		message.reply('Hai! Bagaimana saya bisa membantu Anda hari ini? Jika Anda memiliki pertanyaan lebih lanjut atau ada hal khusus yang ingin Anda diskusikan, silakan beri tahu saya.');
	}
});

client.on('message', message => {
	if(message.body === 'Turunan dari tan x') {
		message.reply('Turunan dari tan x adalah sec^2 x');
	}
});

client.on('message', async (msg) => { 
    if (
      (msg.body.startsWith('!s') || msg.body.startsWith('/sticker')) &&
       msg.type === 'image'
    ) {
     const media = await msg.downloadMedia();
  
      client.sendMessage(msg.from, media, {
        sendMediaAsSticker: true, 
        stickerAuthor: 'Bang Itz',
     });
    } 
  });

  const { exec } = require('child_process');
  
  client.on('message', async (msg) => {
    if (
      (msg.body.startsWith('!sv') || msg.body.startsWith('/sv')) &&
      msg.hasMedia
    ) {
      const media = await msg.downloadMedia();
  
      // Save video to a file
      const videoPath = 'input_video.mp4';
      fs.writeFileSync(videoPath, media.data, 'base64');
  
      // Convert video to sticker using ffmpeg
      const outputStickerPath = 'output_sticker.webp';
      const command = `ffmpeg -i ${videoPath} -vf "fps=10,scale=512:-1:flags=lanczos" -c:v webp -preset default -loop 0 -t 2 ${outputStickerPath}`;
  
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', error);
          client.sendMessage(msg.from, 'Error converting video to sticker.');
        } else {
          // Send the sticker back to the same chat
          const sticker = MessageMedia.fromFilePath(outputStickerPath);
          client.sendMessage(msg.from, media, {
            sendMediaAsSticker: true, 
            stickerAuthor: 'Bang Itz',
         });
        }
        // Cleanup: Delete temporary files
        fs.unlinkSync(videoPath);
        fs.unlinkSync(outputStickerPath);
      });
    }
  });
