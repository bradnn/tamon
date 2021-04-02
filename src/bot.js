require('dotenv').config(); // IMPORTING .env CONFIG

const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');
const { parse } = require('path');
const { promisify } = require('util'); 
const glob = promisify(require('glob'));

const client = new Client(); // DEFINING DISCORD CLIENT

client.logger = require('./modules/Logger'); // DEFINES LOGGER

client.commands = new Collection(); // COMMAND STORAGE
client.aliases = new Collection(); // ALIASES FOR COMMANDS
client.servers = new Collection(); // GUILD STORAGE
client.members = new Collection(); // USER STORAGE

async function start() {
        // LOADING EVENTS
        glob (`${process.cwd()}/src/events/**/*.js`).then(events => {
            for (const eventFile of events) {
                const { name } = parse(eventFile);
                const file = require(eventFile);
                const event = new file(client, name.toLowerCase());
                client.logger.event(`Loading Event: ${name}`);
                client.on(name, (...args) => event.run(client, ...args));
            }
        });

        // LOADING COMMANDS
        glob (`${process.cwd()}/src/commands/**/*.js`).then(commands => {
            for (const commandFile of commands) {
                const { name } = parse(commandFile);
                const file = require(commandFile);
                const command = new file(client, name.toLowerCase());
                client.logger.command(`Loading Command: ${name}`);
                client.commands.set(name, command);
                if (command.aliases) {
                    for (const alias of command.aliases) {
                        client.aliases.set(alias, name);
                    }
                }
            }
        });

        // CONNECTING TO THE DATABASE
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            client.logger.mongo(`Connected to the MongoDB database.`);
        }).catch((err) => {
            client.logger.error(`Couldn't connect to the MongoDB database. Error: ${err}`);
        })

        // LOGIN TO BOT
        client.login(process.env.TOKEN);
}

start();

module.exports.Client = {
    get: function () {
        return client;
    }
}