const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const client = new Client({
    puppeteer: {
		args: ['--no-sandbox','--disable-setuid-sandbox'],
	}
});
let qrCodeUrl = '';

client.on('qr', async (qr) => {
    qrCodeUrl = await qrcode.toDataURL(qr);
    io.emit('qrCode', qrCodeUrl);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    console.log('Message is received:', msg.body);
});

client.initialize();

app.use(express.static(__dirname + '/public'));

app.get('/', async(req, res) => {
     // Generate a new QR code
    const qr = await client.generateInviteLink();
    qrCodeUrl = await qrcode.toDataURL(qr);
    // Emit the new QR code to the client
    io.emit('qrCode', qrCodeUrl);
    
    // Send the HTML file to the client
    res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});
// test generation