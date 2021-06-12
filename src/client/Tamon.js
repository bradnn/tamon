'use strict';

const { Collection, Client } = require('discord.js'),
    { promisify } = require('util'),
    glob = promisify(require('glob')),
    mongoose = require('mongoose'),
    UserManager = require('../managers/User/UserManager'),
    User = require('../managers/User/UserManager');

/**
 * Main tamon client.
 */
class Tamon extends Client {
    constructor() {
        super();

        this.config = { // Config data
            token: process.env.TOKEN,
            mongo_uri: process.env.MONGO_URI
        };
        this.colors = { // Colors used throughout the bot
            default: `#4361ee`,
            invalid: `#e63946`,
            success: `#06d6a0`
        };
        this.adminIDs = [ // List of ID's for owner specific commands
            `263789620007927813`,
            `473232057380896778`
        ];

        this.logger = require('../utils/Logger'); // Logger functions
        this.memberStructure = require('../models/User').UserSchema; // User mongoose model

        this.commands = new Collection(); // Command collection
        this.aliases = new Collection(); // Command alias collection
        this.challenges = new Collection(); // Challenge collection
        this.jobs = new Collection(); // Job collection
        this.cache = {}; // Creates a cache of data from the database
        this.cache.members = new Collection(); // Creates a cache of member data
    }

    /**
     * Initialize the bot.
     */
    init() {
        this.loadJobs();
        this.loadChallenges();
        this.loadCommands();
        this.loadEvents();

        mongoose.connect(this.config.mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            this.logger.mongo(`Connected to database.`);
        }).catch((err) => {
            this.logger.error(err);
        })
        this.login(this.config.token);
    }

    /**
     * Load all events in directory to bot
     * @returns
     */
    loadEvents() {
        glob (`${process.cwd()}/src/events/**/*.js`).then(events => {
            for (const eventFile of events) {
                const error = this.loadEvent(eventFile);
                if (error) {
                    this.logger.error(error);
                }
            }
        }); 
    }

    /**
     * Load an event to the bot.
     * @param {string} filePath Path of event
     * @returns {?string} False if it was loaded successfully or an error string.
     */
    loadEvent(filePath) {
        try {
            const event = new (require(filePath))(this);
            this.logger.event(`Loading event: ${event.event.event}`);
            this.on(event.event.event, (...args) => event.run(...args));
            return false;
        } catch (e) {
            return `Couldn't load event at ${filePath}: ${e}`;
        }
    }

    /**
     * Unload an event from the bot.
     * @param {string} filePath Path of event
     * @returns {?string} False if it was unloaded successfully or an error string.
     */
    async unloadEvent(filePath) {
        try {
            delete require.cache[require.resolve(filePath)];
            return false;
        } catch (e) {
            return `Couldn't unload event at ${filePath}: ${e}`;
        }
    }

    /**
     * Load all commands in directory to bot
     * @returns
     */
    loadCommands() {
        glob (`${process.cwd()}/src/commands/**/*.js`).then(events => {
            for (const commandFile of events) {
                const error = this.loadCommand(commandFile);
                if (error) {
                    this.logger.error(error);
                }
            }
        });
    }

    /**
     * Load a command to the bot.
     * @param {string} filePath Path of command
     * @returns {?string} False if it was loaded successfully or an error string.
     */
    loadCommand(filePath) {
        try {
            const command = new (require(filePath))(this);
            this.logger.command(`Loading Command: ${command.command.name}`);
            this.commands.set(command.command.name.toLowerCase(), command);
            command.command.aliases.forEach((alias) => {
                this.aliases.set(alias.toLowerCase(), command.command.name.toLowerCase());
            });
            return false;
        } catch (e) {
            return `Couldn't load command at ${filePath}: ${e}`;
        }
    }

    /**
     * Unload a command from the bot.
     * @param {string} filePath Path of command
     * @returns {?string} False if it was unloaded successfully or an error string.
     */
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
     * Load all jobs in directory to bot
     * @returns
     */
    loadJobs() {
        glob (`${process.cwd()}/src/assets/jobs/**/*.js`).then(jobs => {
            for (const jobFile of jobs) {
                const error = this.loadJob(jobFile);
                if (error) {
                    this.logger.error(error);
                }
            }
        });
    }

    /**
     * Load a job to the bot.
     * @param {string} filePath Path of job
     * @returns {?string} False if it was loaded successfully or an error string.
     */
    loadJob(filePath) {
        try {
            const job = new (require(filePath))(this);
            this.logger.job(`Loading job: ${job.job.name}`);
            this.jobs.set(job.job.name, job);
            return false;
        } catch (e) {
            return `Couldn't load job at ${filePath}: ${e}`;
        }
    }

    /**
     * Unload a job from the bot.
     * @param {string} filePath Path of job 
     * @returns {?string} False if it was unloaded successfully or an error string.
     */
    async unloadJob(filePath) {
        try {
            const job = new (require(filePath))(this);
            let thisJob;
            if (this.jobs.has(job.job.name)) {
                thisJob = this.jobs.get(job.job.name);
            }
            if (!thisJob) {
                return `The job \`${job.job.name}\` doesn't exist.`;
            }
            delete require.cache[require.resolve(filePath)];
            this.jobs.delete(job.job.name);
            return false;
        } catch (e) {
            return `Couldn't unload job at ${filePath}: ${e}`;
        }
    }

    loadChallenges() {
        glob (`${process.cwd()}/src/assets/challenges/**/*.js`).then(challenges => {
            for (const challengeFile of challenges) {
                const error = this.loadChallenge(challengeFile);
                if (error) {
                    this.logger.error(error);
                }
            }
        });
    }

    loadChallenge(filePath) {
        try {
            const challenge = new (require(filePath))(this);
            this.logger.log(`Loading challenge: ${challenge.challenge.name}`);
            this.challenges.set(challenge.challenge.name, challenge);
            return false;
        } catch (e) {
            return `Couldn't load challenge at ${filePath}: ${e}`;
        }
    }

    unloadChallenge(filePath) {
        try {
            const challenge = new (require(filePath))(this);
            let chal;
            if (this.challenges.has(challenge.challenge.name)) {
                chal = this.challenges.get(challenge.challenge.name);
            }
            if (!chal) {
                return `The challenge \`${challenge.challenge.name}\` doesn't exist.`; 
            }
            delete require.cache[require.resolve(filePath)];
            this.challenges.delete(challenge.challenge.name);
            return false;
        } catch (e) {
            return `Couldn't unload job at ${filePath}: ${e}`;
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