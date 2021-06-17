const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");
const { Message } = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "use",
            description: "Use or equip an item",
            category: "Profile",
            cooldown: null,
            aliases: ["equip"],
            ownerOnly: false,
            dirname: __filename
        });
    }

    /**
     * Execute the commmand.
     * 
     * @param {Message} msg Discord message object
     * @param {Array} args Array of arguments
     * @param {object} data Extra data provided by the message event
     * @returns {undefined}
     */
    async run (msg, args, data) {
    }
}