const Command = require("../../models/Command");
const { Message } = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "addcoins",
            description: "Add coins to a user",
            category: "Owner",
            cooldown: 0,
            aliases: ["addcoin"],
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
            const amount = parseInt(args[0]);
            if (isNaN(amount)) {
                msg.channel.send(`Amount is not a valid number.`);
                return;
            }
            let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]) || msg.author;
            const userData = await this.client.getMember(user);
            userData.economy.addPocket(amount);
            userData.save();
            msg.channel.send(`Added ${amount} to ${user.username}'s pocket.`);
            return;
        }
    }
}