const Command = require("../../models/Command");
const { Message } = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "additem",
            description: "Add items to a user",
            category: "Owner",
            cooldown: 0,
            aliases: ["additems"],
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
            const userData = await this.client.getMember(msg.author);
            const item = this.client.items.items.get(`fishing rod`);
            const add = await item.add(userData, 1);
            console.log(add);
            msg.channel.send(`Added 5 to ${msg.author.username}'s pocket.`);
            return;
        }
    }
}