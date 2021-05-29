const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'fish',
        this.aliases = ['gofish']
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
                    description: `Times Fished: **\`${user.fish().getCount()}\`**`,
                    timestamp: new Date(),
                    footer: {
                        text: `${user.user.username}'s fishing stats`
                    },
                    color: client.colors.default
                }});
                break;
            }
            case "inven":
            case "net":
            case "inventory":
            case "bag": {

                const user2 = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
                if (user2) {
                    user = await User.get(user2);
                }

                const fishObj = {
                    freshwaterItem: client.items.get(`freshwater fish`),
                    blowfishItem: client.items.get(`blowfish`),
                    tropicalItem: client.items.get(`tropical fish`),
                    octopusItem: client.items.get(`octopus`),
                    sharkItem: client.items.get(`shark`),
                    whaleItem: client.items.get(`whale`),
                    penguinItem: client.items.get(`penguin`)
                }

                var fishString = ``;

                for (var fish in Object.values(fishObj)) {
                    fish = Object.values(fishObj)[fish];
                    fishString += `${fish.emoji} **${fish.name}**: **\`${Number.comma(user.fish().getCaught(fish))}\`**
Tier: ${String.capitalize(fish.tier)} **-** Sell Price: ${Number.comma(fish.price.sell)} coins\n\n`;
                }

                msg.channel.send({ embed: {
                    author: {
                        name: `${user.user.username}'s Fishing Bag`,
                        icon_url: user.user.avatarURL()
                    },
                    description: fishString,
                    timestamp: new Date(),
                    color: client.colors.default
                }});
                break;
            }
            default: {
                const rodItem = client.items.get(`fishing rod`);
                if (user.inventory().getCount(rodItem) < 1) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You don't own a fishing rod! Do \`${options.prefix}shop\` to check the price.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s fishing trip`,
                            icon_url: user.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    return;
                }

                if (user.cooldown().get("fish", true, msg).response) return;

                var amount;
                var type;

                const chance = Math.ceil(Math.random() * 100);

                if (chance > 99) { // PENGUIN
                    type = client.items.get(`penguin`);
                    amount = Math.floor(Math.random() * 3) + 1;
                } else if (chance > 95) { // WHALE
                    type = client.items.get(`whale`);
                    amount = Math.floor(Math.random() * 5) + 3;
                } else if (chance > 90) { // SHARK
                    type = client.items.get(`shark`);
                    amount = Math.floor(Math.random() * 7) + 5;
                } else if (chance > 85) { // OCTOPUS
                    type = client.items.get(`octopus`);
                    amount = Math.floor(Math.random() * 10) + 7;
                } else if (chance > 80) { // TROPICAL FISH
                    type = client.items.get(`tropical fish`);
                    amount = Math.floor(Math.random() * 15) + 10;
                } else if (chance > 70) { // BLOWFISH
                    type = client.items.get(`blowfish`);
                    amount = Math.floor(Math.random() * 17) + 10;
                } else { // FRESHWATER FISH
                    type = client.items.get(`freshwater fish`);
                    amount = Math.floor(Math.random() * 17) + 15;
                }

                amount = Math.round(amount * user.buff().get('fishAmount'));

                user.fish().addCaught(type, amount);
                user.inventory().add(type, amount);
                user.fish().addCount();
                user.save();
                msg.channel.send({ embed: {
                    title: `${user.user.username} Fishing`,
                    description: `You caught ${amount} ${type.name} while fishing!`,
                    timestamp: Date.now(),
                    footer: {
                        text: `do ${options.prefix}fish bag`,
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