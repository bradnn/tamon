'use strict';
const { Collection, Client } = require('discord.js'),
    path = require('path');

class Tamon extends Client {
    constructor() {
        super();

        this.config = {
            token: process.env.TOKEN,
            mongo_uri: process.env.MONGO_URI
        };
        this.commands = new Collection();
        this.aliases = new Collection();
    }

    init() {
        this.login(this.config.token);

        this.on('ready', () => {
            console.log('ready');
        })
    }

    loadCommand(filePath) {
        try {
            const command = new (require(filePath))(this);
            this.commands.set(command.command.name, command);
            command.command.aliases.forEach((alias) => {
                this.aliases.set(alias, command.command.name);
            });
            return false;
        } catch (e) {
            return `Couldn't load command at ${filePath}: ${e}`;
        }
    }


}

module.exports = Tamon;