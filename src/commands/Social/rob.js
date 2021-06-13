const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");


module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "rob",
            description: "Rob a user for extra cash",
            category: "Social",
            cooldown: 1800000,
            aliases: ["steal"],
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
        var robbingUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]);
        if (!robbingUser) {
            msg.channel.send({ embed: {
                title: `${msg.author.username}'s Rob`,
                description: `You need to mention a user to rob.`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s rob`,
                    icon_url: userData.user.avatarURL()
                },
                color: this.client.colors.invalid
            }});
            return;
        }
        if (userData.economy.balance < 10000) {
            msg.channel.send({ embed: {
                title: `${msg.author.username}'s Rob`,
                description: `You have less than 10,000 coins in your pocket... Try not being broke next time.`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s rob`,
                    icon_url: userData.user.avatarURL()
                },
                color: this.client.colors.invalid
            }});
            return;
        }

        robbingUser = await this.client.getMember(robbingUser);
        if (robbingUser.economy.balance < 10000) {
            msg.channel.send({ embed: {
                title: `${msg.author.username}'s Rob`,
                description: `The user mentioned has less than 10,000 coins in their pocket. You can't rob broke people...`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s rob`,
                    icon_url: userData.user.avatarURL()
                },
                color: this.client.colors.invalid
            }});
            return;
        }
        if((await this.getCooldown(msg.author, true, msg)).response) return;

        var chance = Math.random() * 100;
        if (chance > 60) {
            const robAmount = Math.floor((robbingUser.economy.balance / 35) + 200);
            robbingUser.economy.delPocket(robAmount);
            userData.economy.addPocket(robAmount);
            userData.save();
            robbingUser.save();
            msg.channel.send({ embed: {
                title: `${msg.author.username}'s Rob`,
                description: `You just robbed ${robbingUser.user.username} for ${comma(robAmount)} coins. Nice job!`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s rob`,
                    icon_url: userData.user.avatarURL()
                },
                color: this.client.colors.success
            }});
        } else {
            const fineAmount = Math.floor(Math.random() * 500) + 1000;
            robbingUser.economy.addPocket(fineAmount);
            userData.economy.delPocket(fineAmount);
            userData.save();
            robbingUser.save();
            msg.channel.send({ embed: {
                title: `${msg.author.username}'s Rob`,
                description: `You were caught robbing them and you were fined ${comma(fineAmount)} coins. Try not being stupid.`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s rob`,
                    icon_url: userData.user.avatarURL()
                },
                color: this.client.colors.invalid
            }});
        }

        return;
    }
}