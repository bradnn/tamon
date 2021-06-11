require('dotenv').config();

const Tamon = require("./client/Tamon"),
      client = new Tamon();

client.init();