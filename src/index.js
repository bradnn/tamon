require('dotenv').config(); // Include dotenv config

const Tamon = require("./client/Tamon"), // Require tamon file
     client = new Tamon(); // Define client

client.init(); // Run bot startup