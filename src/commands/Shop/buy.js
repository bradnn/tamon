const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'buy',
        this.aliases = ['purchase']
    }

    async run(client, msg, args, options) {
        if (!args[0]) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You need to supply a valid item name. \`${options.prefix}buy <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s purchase`,
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
                        text: `${msg.author.username}'s purchase`,
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
                description: `You need to supply a valid item name. \`${options.prefix}buy <Item Name> <Amount>\``,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s purchase`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        if (!item.price.buy) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `This item isn't available for purchase.`,
                timestamp: Date.now(),
                footer: {
                    text: `${msg.author.username}'s purchase`,
                    icon_url: msg.author.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        const user = await User.get(msg.author);
        if (item.price.buy * amount > user.economy().get()) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You don't have enough coins to buy this. You need ${Number.comma(item.price.buy * amount)} coins.`,
                timestamp: Date.now(),
                footer: {
                    text: `${user.user.username}'s purchase`,
                    icon_url: user.user.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        if (item.maxAmount <= user.inventory().getCount(item)) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `You can't buy anymore of this item.`,
                timestamp: Date.now(),
                footer: {
                    text: `${user.user.username}'s purchase`,
                    icon_url: user.user.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        if (item.maxAmount < user.inventory().getCount(item) + amount) {
            msg.channel.send({ embed: {
                title: `❌ Error`,
                description: `Buying ${amount} of ${item.name} would exceed the limit of ${item.maxAmount}`,
                timestamp: Date.now(),
                footer: {
                    text: `${user.user.username}'s purchase`,
                    icon_url: user.user.avatarURL()
                }, 
                color: client.colors.invalid
            }});
            return;
        }
        user.economy().remove(item.price.buy * amount, "buy");
        user.shop().addBoughtCount(amount);
        user.inventory().add(item, amount);
        user.save();
        msg.channel.send({ embed: {
            title: `${user.user.username} Purchase`,
            description: `You successfully purchased ${Number.comma(amount)}x ${item.name} for ${Number.comma(item.price.buy * amount)} coins.`,
            timestamp: Date.now(),
            footer: {
                text: `${user.user.username}'s purchase`,
                icon_url: user.user.avatarURL()
            },
            color: client.colors.success
        }});
        return;
    }
}