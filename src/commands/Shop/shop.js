const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");


module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "shop",
            description: "View the store",
            category: "Shop",
            cooldown: 0,
            aliases: ["store"],
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
        var userData = await this.client.getMember(msg.author);

        const clientItems = this.client.items.items.array();
        var items = [];
        for (var item in clientItems) {
            if (clientItems[item].meta.display) { items.push(clientItems[item]); }
        }

        const itemAmount = items.length;
        const pageCount = Math.ceil(itemAmount / 6);
        var shopString = ``;
        var pageChosen = parseInt(args[0]);

        if (!pageChosen || isNaN(pageChosen) || pageChosen < 1) { pageChosen = 1; }
        if (pageChosen > pageCount) { pageChosen = pageCount; }

        for (var i = 1; i <= 5; i++) {
            const index = i + (pageChosen * 6) - 7;
            const displayItem = items[index];

            if (displayItem) {
                shopString += `${displayItem.item.emoji} **${displayItem.item.name}**: **\`${comma(displayItem.meta.buyPrice)} coins\`**\nTier: ${displayItem.item.tier} **-** ${displayItem.item.category}\n\n`;
            }
        }

        msg.channel.send({ embed: {
            title: `Shop **-** Page ${pageChosen}`,
            description: shopString,
            timestamp: new Date(),
            footer: {
                text: `${msg.author.username}'s shop • !shop 1-${pageCount}`,
                icon_url: msg.author.avatarURL()
            },
            color: this.client.colors.default
        }});

        return;
    }
}