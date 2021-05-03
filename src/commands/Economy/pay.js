const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'pay',
        this.aliases = ['transfer']
    }

    async run(client, msg, args, options) {
        var profile = await User.get(msg.author);


        switch (args[0]?.toLowerCase()) {
            case "info":
            case "stats":
            case "view": {
                let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]) || msg.author;
                if (user) {
                    profile = await User.get(user);
                }
                msg.channel.send({ embed: { 
                    author: { 
                        name: `${profile.user.username}'s stats`,
                        icon_url: profile.user.avatarURL()
                    },
                    description: `Amount Sent: **\`${Number.comma(profile.pay.getPaySent())}\`**
Amount Recieved: **\`${Number.comma(profile.pay.getPayRecieved())}\`**
Amount Profited: **\`${Number.comma(profile.pay.getPayRecieved() - profile.pay.getPaySent())}\`**`,
                    timestamp: new Date(),
                    footer: {
                        text: `${profile.user.username}'s pay stats`
                    },
                    color: client.colors.default
                }})
                break;
            }
            default: {
                const user2 = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]);
                if (!user2) { 
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You need to provide a valid user to pay. \`${options.prefix}pay <user> <amount>\``,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s payment`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }
                const amount = parseInt(args[1]);

                if (!amount || isNaN(amount) || amount < 0) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You need to provide a valid number to pay. \`${options.prefix}pay <user> <amount>\``,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s payment`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }
                if (amount > profile.economy.get()) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You don't have ${Number.comma(amount)} coins to pay.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s payment`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }
                const canProfilePay = profile.pay.canPay(amount);
                if (!canProfilePay.canPay) { 
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `Paying ${Number.comma(amount)} coins would exceed your transaction limit of ${Number.comma(canProfilePay.limit)}.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s payment`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }
                var profile2 = await User.get(user2);
                const canProfile2Pay = profile2.pay.canPay(amount);
                if (!canProfile2Pay.canPay) { 
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `Recieving ${Number.comma(amount)} coins would exceed their transaction limit of ${Number.comma(canProfile2Pay.limit)}.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s payment`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }

                profile2.economy.add(amount, "pay");
                profile.economy.del(amount, "pay");
                profile2.save();
                msg.channel.send({ embed: {
                    title: `${profile.user.username}'s Payment`,
                    description: `You have sent ${Number.comma(amount)} coins to ${profile2.user.username}!`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${profile.user.username}'s payment`,
                        icon_url: profile.user.avatarURL()
                    },
                    color: client.colors.success
                }});
                break;
            }
        }
        profile.save();

        return;
    }
}