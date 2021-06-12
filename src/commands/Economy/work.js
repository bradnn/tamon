const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "Work",
            description: "Work for money",
            category: "Economy",
            cooldown: 3600000,
            aliases: ["ork"],
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
        let userData = await this.client.getMember(msg.author);

        switch(args[0]?.toLowerCase()) {
            case "view":
            case "stats":
            case "info": {
                const user2 = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]);
                if (!user2) {

                } else {
                    userData = this.client.getMember(user2);
                }

                msg.channel.send({embed: {
                    author: {
                        name: `${userData.user.username}'s stats`,
                        icon_url: userData.user.avatarURL()
                    },
                    description: `Job: **\`${userData.work.job}\`**\nHours Worked: **\`${userData.work.count}\`**\nSuccess / Fails: **\`${userData.work.successes} / ${userData.work.fails}\`**\nAmount Earned: **\`${comma(userData.work.earned)}\`**`
                }})
                break;
            }
            default: {

                if(!await this.canEarn(msg.author, userData.work.pay)) {
                    msg.channel.send({ embed: {
                        title: `${msg.author.username}'s Pocket`,
                        description: `Your pockets are full! Please spend or deposit your money to continue working.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${userData.user.username}'s work`,
                            icon_url: userData.user.avatarURL()
                        },
                        color: this.client.colors.invalid
                    }});
                    return;
                }

                if((await this.getCooldown(msg.author, true, msg)).response) return;
                
                const job = this.client.jobs.get(userData.work.job);
                const challenge = this.client.challenges.random();

                const result = await challenge.execute(msg, `${job.job.name} Work`, `${userData.user.username}'s work`);
                if (result.correct) {
                    userData.economy.addPocket(userData.work.pay);
                    userData.work.addCount();
                    userData.work.addEarned(userData.work.pay);
                    var embed = {
                        title: `${job.job.name} Work`,
                        description: job.message.replace("%p", comma(userData.work.pay) + " coins"),
                        fields: [],
                        timestamp: Date.now(),
                        footer: {
                            text: `${userData.user.username}'s work`,
                            icon_url: userData.user.avatarURL()
                        },
                        color: this.client.colors.default
                    }
                    msg.channel.send({ embed });
                    break;
                }
                switch (result.error) {
                    case "MISTYPE": {
                        const payout = Math.floor((userData.work.pay / 2) + Math.random() * 100);
                        userData.economy.addPocket(payout);
                        userData.work.addEarned(payout);
                        userData.work.addCount(false);
                        msg.channel.send({ embed: {
                            title: `${job.job.name} Work`,
                            description: job.incorrectMessage.replace("%p", comma(payout) + " coins").replace("%a", result.word),
                            timestamp: Date.now(),
                            footer: {
                                text: `${userData.user.username}'s work`,
                                icon_url: userData.user.avatarURL()
                            },
                            color: this.client.colors.invalid
                        }});
                        break;
                    }
                    case "TIME": {
                        msg.channel.send({
                            embed: {
                                title: `${job.job.name} Work`,
                                description: `You didn't answer the challenge and recieved no coins!`,
                                timestamp: Date.now(),
                                footer: {
                                    text: `${userData.user.username}'s work`,
                                    icon_url: userData.user.avatarURL()
                                },
                                color: this.client.colors.invalid
                            }
                        });
                        break;
                    }
                }
                break;
            }
        }
        userData.save();
        return;
    }
}