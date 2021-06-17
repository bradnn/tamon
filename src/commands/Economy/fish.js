const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");


module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "fish",
            description: "Go on a fishing trip",
            category: "Economy",
            cooldown: 900000,
            aliases: ["gofish"],
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
        const rod = this.client.items.items.get(`fishing rod`);
        var userData = await this.client.getMember(msg.author);

        switch(args[0]?.toLowerCase()) {
            case "net":
            case "bag": {
                const user2 = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]);
                if (user2) {
                    userData = await this.client.getMember(user2);
                }

                var fishObj = {
                    salmonItem: this.client.items.items.get(`salmon`),
                    bassItem: this.client.items.items.get(`bass`)
                }
                var fishString = ``;

                for (var fish in Object.values(fishObj)) {
                    fish = Object.values(fishObj)[fish];
                    fishString += `${fish.item.emoji} **${fish.item.name}**: **\`${await fish.count(userData)}\`**\nTier: ${fish.item.tier} **-** Sell price: ${fish.meta.sellPrice} coins\n\n`;
                }
                msg.channel.send({ embed: {
                    author: {
                        name: `${userData.user.username}'s Fishing Bag`,
                        icon_url: userData.user.avatarURL()
                    },
                    description: fishString,
                    timestamp: new Date(),
                    color: this.client.colors.default
                }});
                break;
            }
            default: {
                if (await rod.count(userData) < 1) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You don't own a fishing rod! Do \`!shop\` to check the price.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${userData.user.username}'s fishing trip`,
                            icon_url: userData.user.avatarURL()
                        }, 
                        color: this.client.colors.invalid
                    }});
                    break;
                }
                
                if((await this.getCooldown(msg.author, true, msg)).response) break;
        
                var possibleCatches = [];
                var amount;
                var type;
                var bait = await this.getBait(userData);
        
                if (!bait) {
                    possibleCatches = ["salmon"];
                    amount = Math.floor(Math.random() * 5) + 1;
                } else if (bait.item.name == "Worm Bait") {
                    possibleCatches = ["bass", "salmon"];
                    amount = Math.ceil(Math.random() * 5) + 5;
                } else {
                    possibleCatches = ["salmon"];
                    amount = Math.floor(Math.random() * 5) + 1;
                }
        
                type = this.client.items.items.get(possibleCatches[Math.floor(Math.random() * possibleCatches.length)]);
        
                await type.add(userData, amount);
                var embed = {
                    title: `${userData.user.username} Fishing`,
                            description: `You caught ${amount} ${type.item.name} while fishing!`,
                            fields: [],
                            timestamp: Date.now(),
                            footer: {
                                text: `do !fish bag`,
                                icon_url: userData.user.avatarURL()
                            },
                            color: this.client.colors.success
                }
                const uses = await rod.addUses(userData, 1);
                if (uses == -1) {
                    embed.fields[0] = {
                        name: `❌ Broken Item`,
                        value: `Your fishing rod has broken.`
                    };
                }
        
                msg.channel.send({ embed });
                break;
            }
        }
        return;
    }

    async getBait(user) {
        const wormBait = this.client.items.items.get(`worm bait`);
        if (await wormBait.count(user) > 0) {
            return wormBait;
        }

        return false;
    }
}