const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT;
const client = new Client();
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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
