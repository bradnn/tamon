const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");


module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "buy",
            description: "Buy from the store",
            category: "Shop",
            cooldown: 0,
            aliases: ["purchase"],
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
                description: `You need to supply a valid item name. \`!buy <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s purchase`,
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
                        text: `${msg.author.username}'s purchase`,
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
                description: `You need to supply a valid item name. \`!buy <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s purchase`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }

        if (!item.meta.buyPrice) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `This item isn't available for purchase.`,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s purchase`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }
        var userData = await this.client.getMember(msg.author);
        if (item.meta.buyPrice * amount > userData.economy.balance) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You don't have enough coins in your pocket to buy this. You need ${comma(item.price.buy * amount)} coins.`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s purchase`,
                    icon_url: userData.user.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }
        var itemCount = await item.count(userData);
        if (itemCount > item.meta.maxAmount) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You can't buy anymore of this item.`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s purchase`,
                    icon_url: userData.user.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }

        if (itemCount + amount > item.meta.maxAmount) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `Buying ${amount} of ${item.item.name} would exceed the limit of ${item.meta.maxAmount}`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s purchase`,
                    icon_url: userData.user.avatarURL()
                }, 
                color: this.client.colors.invalid
            }});
            return;
        }

        userData.economy.delPocket(item.meta.buyPrice * amount);
        await item.add(userData, amount);
        userData.save();
        msg.channel.send({ embed: {
            title: `${userData.user.username} Purchase`,
            description: `You successfully purchased ${comma(amount)}x ${item.item.name} for ${comma(item.meta.buyPrice * amount)} coins.`,
            timestamp: Date.now(),
            footer: {
                text: `${userData.user.username}'s purchase`,
                icon_url: userData.user.avatarURL()
            },
            color: this.client.colors.success
        }});
        return;
    }
}