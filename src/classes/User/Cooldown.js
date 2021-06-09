/**
 * @file Cooldown module for the UserClass.
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

const { User, Message, Client } = require("discord.js");
const { Document } = require("mongoose");
const { Time } = require("../../modules/Time");

/** @type {Document} The MongoDB user model */
var user; 
/** @type {User} The user's discord object */
var member;
/** @type {Client} */
var client;

cooldowns = {
    work: 3600000, //3600000
    fish: 120000,
    mine: 180000,
    beg: 30000
}

module.exports = class {
    /**
     * Sets the variable user to a user model from MongoDB.
     * 
     * @class
     * @classdesc Cooldown module for the UserClass.
     * 
     * @param {Document} model A user model from MongoDB.
     * @param {Client} Client
     * @param {User} User 
     */
    constructor(model, Client, User) {
        user = model; // Sets the user to the model from MongoDB.
        member = User; // Set the member to the users discord.js object.
        client = Client;
    }

    /**
     * Get the cooldown of a command.
     * 
     * @param {string} type What command should the cooldown be checked for.
     * @param {boolean} set Should it set the cooldown if they are on cooldown.
     * @param {Message} [msg] Provide a discord message object if it should send a message.
     * @returns {object} Cooldown object.
     */
    get(type, set = true, msg) {
        const previousTime = user.profile.commands.cooldowns[type]; // When command was last used
        const nowTime = new Date(); // Current Date
        const timePassed = Math.abs(previousTime - nowTime); // How long its been since the command was used

        var cooldown = cooldowns[type];

        if (timePassed <= cooldown) {
            const timeLeftMilli = Math.ceil(cooldown - timePassed)
            const timeLeftSec = (timeLeftMilli / 1000);
            const timeLeftFormatted = Time.format(timeLeftMilli);

            if (msg) msg.channel.send(this.embed(member, type, timeLeftFormatted));

            return {
                response: true,
                timeLeftSec,
                timeLeftMilli,
                timeLeftFormatted,
                message: `You need to wait ${timeLeftFormatted} before you can use ${type} again.`,
                embed: this.embed(member, type, timeLeftFormatted)
            }
        }

        if (set) user.profile.commands.cooldowns[type] = new Date();
        return {
            response: false
        }
    }

    /**
     * Generates an error message for if a user is on cooldown.
     * 
     * @param {User} user The Discord.js user object.
     * @param {string} type The cooldown type.
     * @param {string} remaining How long they have to wait to use the command.
     * @returns 
     */
    embed(user, type, remaining) {
        const embed = {
            embed: {
                title: `Slow down ${user.username} ⏱`,
                description: `You need to wait ${remaining} before you can use ${type} again.`,
                color: client.colors.invalid
            }
        }
        return embed;
    }
}