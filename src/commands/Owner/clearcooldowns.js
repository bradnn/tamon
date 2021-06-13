const Command = require("../../models/Command");
const { Message } = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "Clearcooldown",
            description: "Clear a users cooldown",
            category: "Owner",
            cooldown: 0,
            aliases: ["ClearCD"],
            ownerOnly: true,
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
        if (this.isAdmin(msg.author)) {
            let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg.author;
            const userData = await this.client.getMember(user);
            userData.model.profile.commands.cooldowns = {
                work: 0
            };
            userData.save();
            msg.channel.send(`Cleared ${user.username}'s cooldowns.`);
            return;
        }
    }
}