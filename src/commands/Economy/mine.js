const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'mine',
        this.aliases = ['gimmeore']
    }

    async run(client, msg, args, options) {
        let author = msg.author;
        var user = await User.get(author);

        switch(args[0]?.toLowerCase()) {
            case "stats":
            case "view":
            case "info": {
                let user2 = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
                if (user2) {
                    user = await User.get(user2);
                }
                msg.channel.send({ embed: {
                    author: {
                        name: `${user.user.username}'s stats`,
                        icon_url: user.user.avatarURL()
                    },
                    description: `Times Mined: **\`${user.getTimesMined()}\`**`,
                    timestamp: new Date(),
                    footer: {
                        text: `${user.user.username}'s mining stats`
                    },
                    color: client.colors.default
                }});
                break;
            }
            case "inven":
            case "inventory":
            case "backpack":
            case "bag": {

                const user2 = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
                if (user2) {
                    user = await User.get(user2);
                }

                const oreObj = {
                    steelItem: client.items.get(`steel`),
                    bronzeItem: client.items.get(`bronze`),
                    goldItem: client.items.get(`gold`),
                    rubyItem: client.items.get(`ruby`)
                }

                var oreString = ``;

                for (var ore in Object.values(oreObj)) {
                    ore = Object.values(oreObj)[ore];
                    oreString += `${ore.emoji} **${ore.name}**: **\`${Number.comma(user.getItemCount(ore))}\`**
Tier: ${String.capitalize(ore.tier)} **-** Sell Price: ${Number.comma(ore.price.sell)} coins\n\n`;
                }

                msg.channel.send({ embed: {
                    author: {
                        name: `${user.user.username}'s Mining Backpack`,
                        icon_url: user.user.avatarURL()
                    },
                    description: oreString,
                    timestamp: new Date(),
                    color: client.colors.default
                }});
                break;
            }
            default: {
                const pickaxeItem = client.items.get(`pickaxe`);
                if (user.getItemCount(pickaxeItem) < 1) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You don't own a pickaxe! Do \`${options.prefix}shop\` to check the price.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s mining quarry`,
                            icon_url: user.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    return;
                }

                if (user.getCooldown("mine", true, msg).response) return;

                var amount;
                var type;

                const chance = Math.ceil(Math.random() * 100);

                if (chance > 98) {
                    type = client.items.get(`ruby`);
                    amount = Math.floor(Math.random() * 3) + 1;
                } else if (chance > 85) {
                    type = client.items.get(`gold`);
                    amount = Math.floor(Math.random() * 5) + 3;
                } else if (chance > 65) {
                    type = client.items.get(`bronze`);
                    amount = Math.floor(Math.random() * 7) + 5;
                } else {
                    type = client.items.get(`steel`);
                    amount = Math.floor(Math.random() * 17) + 15;
                }

                amount = Math.round(amount * user.getBuff('mineAmount'));

                user.addOresMined(type, amount);
                user.addItem(type, amount);
                user.addTimesMined();
                user.save();
                msg.channel.send({ embed: {
                    title: `${user.user.username} Mining`,
                    description: `You visited a mineshaft and mined ${amount}x ${type.name}.`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${user.user.username}'s mining quarry`,
                        icon_url: user.user.avatarURL()
                    },
                    color: client.colors.success
                }});
                break;
            }
        }
        return;
    }
}