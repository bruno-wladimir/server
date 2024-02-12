const { Client } = require('whatsapp-web.js');
const { LocalAuth } = require('whatsapp-web.js');
const { create } = require('puppeteer');

const client = new Client({
  puppeteer: {
    headless: true,
  },
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID"
  })
});




// Inicialize o cliente
client.initialize();

// Exporte o cliente para ser usado em outros lugares
module.exports = client;
