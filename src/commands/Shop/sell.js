const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'sell',
        this.aliases = ['sale']
    }

    async run(client, msg, args, options) {
        if (!args[0]) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You need to supply a valid item name. \`${options.prefix}sell <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s sale`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
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
                    color: client.colors.invalid
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

        const item = client.items.get(args.join(' ')) || client.items.get(client.itemAliases.get(args.join(' ')));
        if (!item) { 
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You need to supply a valid item name. \`${options.prefix}sell <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s sale`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        if (!item.price.sell) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `This item isn't available for sale.`,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s sale`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        const user = await User.get(msg.author);
        if (amount > user.inventory().getCount(item)) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You don't have enough ${item.name} to sell. You need ${Number.comma(amount)}x ${item.name}.`,
                timestamp: Date.now(),
                footer: {
                    text: `${user.user.username}'s sale`,
                    icon_url: user.user.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        user.economy().add(item.price.sell * amount, "sell");
        user.shop().addSoldCount(amount);
        user.inventory().remove(item, amount);
        user.save();
        msg.channel.send({ embed: {
            title: `${user.user.username} Sale`,
            description: `You successfully Sold ${Number.comma(amount)}x ${item.name} for ${Number.comma(item.price.sell * amount)} coins.`,
            timestamp: Date.now(),
            footer: {
                text: `${user.user.username}'s sale`,
                icon_url: user.user.avatarURL()
            },
            color: client.colors.success
        }});
        return;
    }
}