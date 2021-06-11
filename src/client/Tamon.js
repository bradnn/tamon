'use strict';

const { Collection, Client } = require('discord.js'),
    { promisify } = require('util'),
    glob = promisify(require('glob')),
    mongoose = require('mongoose'),
    UserManager = require('../managers/User/UserManager'),
    User = require('../managers/User/UserManager');

class Tamon extends Client {
    constructor() {
        super();

        this.config = {
            token: process.env.TOKEN,
            mongo_uri: process.env.MONGO_URI
        };

        this.commands = new Collection();
        this.aliases = new Collection();
        this.logger = require('../utils/Logger');
        this.memberStructure = require('../structures/User').UserSchema;

        this.cache = {}
        this.cache.members = new Collection();

        this.colors = {
            default: `#4361ee`,
            invalid: `#e63946`,
            success: `#06d6a0`
        }
    }

    init() {

        glob (`${process.cwd()}/src/events/**/*.js`).then(events => {
            for (const eventFile of events) {
                const event = new (require(eventFile))(this);
                this.logger.event(`Loading event: ${event.event.event}`);
                this.on(event.event.event, (...args) => event.run(...args));
            }
        });

        glob (`${process.cwd()}/src/commands/**/*.js`).then(events => {
            for (const commandFile of events) {
                const error = this.loadCommand(commandFile);
                if (error) {
                    this.logger.error(error);
                }
            }
        });

        mongoose.connect(this.config.mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            this.logger.mongo(`Connected to database.`);
        }).catch((err) => {
            this.logger.error(err);
        })
        this.login(this.config.token);
    }

    loadCommand(filePath) {
        try {
            const command = new (require(filePath))(this);
            this.logger.command(`Loading Command: ${command.command.name}`)
            this.commands.set(command.command.name.toLowerCase(), command);
            command.command.aliases.forEach((alias) => {
                this.aliases.set(alias.toLowerCase(), command.command.name.toLowerCase());
            });
            return false;
        } catch (e) {
            return `Couldn't load command at ${filePath}: ${e}`;
        }
    }

    async unloadCommand(filePath) {
        try {
            const command = new (require(filePath))(this);
            let cmd;
            if (this.commands.has(command.command.name.toLowerCase())) {
                cmd = this.commands.get(command.command.name.toLowerCase());
            } else if (this.aliases.has(command.command.name.toLowerCase())) {
                cmd = this.commands.get(this.aliases.get(command.command.name.toLowerCase()));
            }
            if (!cmd) {
                return `The command \`${command.command.name.toLowerCase()}\` doesn't seem to exist, nor is it an alias. Try again!`;
            }
            delete require.cache[require.resolve(filePath)];
            this.commands.delete(command.command.name);
            command.command.aliases.forEach((alias) => {
                this.aliases.delete(alias.toLowerCase());
            });
            return false;
        } catch (e) {
            return `Couldn't unload command at ${filePath}: ${e}`;
        }
    }

    /**
     * 
     * @param {User} user Discord user 
     * @returns {UserManager}
     */
    async getMember(user) {
        const memberID = user.id;
        if (this.cache.members.get(memberID)) {
            return this.cache.members.get(memberID);
        } else {
            let memberData = await this.memberStructure.findOne({ id: memberID });
            if (!memberData) {
                memberData = await this.memberStructure.create({ id: memberID });
            }
            await memberData.save();
            const memberClass = new User(this, user, memberData);
            this.cache.members.set(memberID, memberClass);
            return memberClass;
        }
    }


}

module.exports = Tamon;