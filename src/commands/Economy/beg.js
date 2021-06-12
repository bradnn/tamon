const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");


module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "Beg",
            description: "Beg for money on the streets",
            category: "Economy",
            cooldown: 30000,
            aliases: ["plsgivemoney", "needmoners", "GIBMONERS"],
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
        
        switch (args[0]?.toLowerCase()) {
            case "view":
            case "stats":
            case "info": {
                let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]) || msg.author;
                if (user) {
                    userData = await this.client.getMember(user);
                }
                msg.channel.send({
                    embed: {
                        author: {
                            name: `${userData.user.username}`,
                            icon_url: userData.user.avatarURL()
                        },
                        description: `Times begged: **\`${comma(userData.beg.count)}\`**\nAmount Earned: **\`${comma(userData.beg.earned)}\`**`,
                        timestamp: new Date(),
                        footer: {
                            text: `${userData.user.username}'s begging stats`
                        },
                        color: this.client.colors.default
                    }
                })
                break;
            }
            default: {
                if((await this.getCooldown(msg.author, true, msg)).response) return;

                const amount = Math.floor(Math.random() * 200) + 100;
                userData.economy.addPocket(amount);
                userData.beg.addEarned(amount);
                userData.beg.addCount();
                userData.save();
                msg.channel.send({
                    embed: {
                        title: `${userData.user.username}'s Begging`,
                        description: `You begged for money and got ${comma(amount)} coins.`,
                        timestamp: new Date(),
                        footer: {
                            text: `${userData.user.username}'s beg`,
                            icon_url: userData.user.avatarURL()
                        },
                        color: this.client.colors.success
                    }
                });
                break;
            }
        }
        return;
    }
}