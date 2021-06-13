const Server = require('./api/server');

require('dotenv').config(); // Include dotenv config

const Tamon = require("./client/Tamon"), // Require tamon file
     client = new Tamon(), // Define client
     express = new Server(client); // Define express app

client.init(); // Run bot startup
express.listen(); // Start express server