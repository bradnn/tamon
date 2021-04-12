const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'fish',
        this.aliases = ['gofish']
    }

    async run(client, msg, args, options) {
        let author = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg.author;
        const user = await User.get(author);

        switch(args[0]?.toLowerCase()) {
            case "inven":
            case "net":
            case "inventory":
            case "bag": {
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
                    fishString += `${fish.emoji} **${fish.name}**: **\`${Number.comma(user.getItemCount(fish))}\`**
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
                }})


            }
            default: {
                const rodItem = client.items.get(`fishing rod`);
                if (user.getItemCount(rodItem) < 1) {
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

                if (user.getCooldown("fish", true, msg).response) return;

            }
        }
    }
}