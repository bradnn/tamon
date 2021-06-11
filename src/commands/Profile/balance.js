const Command = require("../../structures/Command");
const { comma } = require("../../utils/Number");
const { Message } = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "Balance",
            description: "Check your balance",
            category: "Profile",
            cooldown: null,
            aliases: ["bal"],
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
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg.author;
        const userData = await this.client.getMember(user);

        msg.channel.send({
            embed: {
                author: {
                    name: `${user.username}'s balance`,
                    icon_url: user.avatarURL()
                },
                description: `🪙 ${comma(userData.economy.balance)} coins`,
                timestamp: new Date(),
                color: this.client.colors.default
            }
        });
        return;
    }
}