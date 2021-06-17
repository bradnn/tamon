const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");


module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "sell",
            description: "Sell to the store",
            category: "Shop",
            cooldown: 0,
            aliases: ["sale"],
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
        if (!args[0]) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You need to supply a valid item name. \`!sell <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s sale`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: this.client.colors.invalid
            }})
        }

        var amount = parseInt(args[args.length - 1]);
        if (!isNaN(amount)) {
            if (amount < 1) {
                msg.channel.send({ embed: {
                    title: `❌ Error`,
                    description: `The amount you specified is invalid. Amount needs to be greater than 0`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${msg.author.username}'s sale`,
                        icon_url: msg.author.avatarURL()
                    }, 
                    color: this.client.colors.invalid
                }});
                return;
            }
            args.pop();
        } else {
            amount = 1;
        }

        for (var arg in args) {
            args[arg] = args[arg].toLowerCase();
        }

        const item = this.client.items.items.get(args.join(' ')) || this.client.items.items.get(this.client.items.aliases.get(args.join(' ')));
        if (!item) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You need to supply a valid item name. \`!sell <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s sale`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }

        if (!item.meta.sellPrice) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `This item isn't available for sale.`,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s sale`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }
        var userData = await this.client.getMember(msg.author);
        
        var itemCount = await item.count(userData);

        if (amount > itemCount) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You don't have enough ${item.item.name} to sell. You need ${comma(amount)}x ${item.item.name}.`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s sale`,
                    icon_url: userData.user.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }

        userData.economy.addPocket(item.meta.sellPrice * amount);
        await item.remove(userData, amount);
        userData.save();
        msg.channel.send({ embed: {
            title: `${userData.user.username} Sale`,
            description: `You successfully sold ${comma(amount)}x ${item.item.name} for ${comma(item.meta.sellPrice * amount)} coins.`,
            timestamp: Date.now(),
            footer: {
                text: `${userData.user.username}'s sale`,
                icon_url: userData.user.avatarURL()
            },
            color: this.client.colors.success
        }});
        return;
    }
}