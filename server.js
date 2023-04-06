const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
    console.log('Message received:', msg.body);
});

client.initialize();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('Listening on port 3000');
});
