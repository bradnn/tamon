const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'flip',
        this.aliases = ['5050']
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

                const WIN_AMOUNT = profile.getFlipAmountWon();
                const LOSS_AMOUNT = profile.getFlipAmountLost();
                const TOTAL_PROFIT = WIN_AMOUNT - LOSS_AMOUNT;

                const WINS = profile.getFlipWins();
                const LOSSES = profile.getFlipLosses();
                const TOTAL_FLIPS = WINS + LOSSES;

                msg.channel.send({ embed: { 
                    author: { 
                        name: `${profile.user.username}'s stats`,
                        icon_url: profile.user.avatarURL()
                    },
                    description: `Times flipped: **\`${Number.comma(TOTAL_FLIPS)}\`**
Flips won: **\`${Number.comma(WINS)}\`**
Flips lost: **\`${Number.comma(LOSSES)}\`**

Largest win: **\`${Number.comma(profile.getFlipLargestWin())}\`**
Largest loss: **\`${Number.comma(profile.getFlipLargestLoss())}\`**

Amount won: **\`${Number.comma(WIN_AMOUNT)} coins\`**
Amount lost: **\`${Number.comma(LOSS_AMOUNT)} coins\`**
Total profit: **\`${Number.comma(TOTAL_PROFIT)} coins\`**`,
                    timestamp: new Date(),
                    footer: {
                        text: `${profile.user.username}'s flip stats`
                    },
                    color: client.colors.default
                }})
                break;
            }
            default: {
                const amount = parseInt(args[0]);
                var choice = args[1]?.toLowerCase();

                if (!amount || isNaN(amount)) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You didn't provide a valid amount to gamble! Do \`${options.prefix}flip <Amount to gamble> <Heads | Tails>\`.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s flip`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }

                if (amount < 0) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You didn't provide a valid amount to gamble! You have to gamble an amount greater than 0.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s flip`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }

                if (amount > profile.economy.get()) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You need to have ${Number.comma(amount)} in your balance to gamble it.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s flip`,
                            icon_url: profile.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }

                if(!choice) { 
                    choice = "tails"
                }

                const results = ["tails", "heads"];
                const result = results[Math.floor(Math.random() * results.length)];
                if(choice !== result) {
                    profile.economy.del(amount, "flip");
                    profile.addFlipLoss();
                    msg.channel.send({ embed: {
                        title: `${profile.user.username} Flip`,
                        description: `You flipped ${result} and lost ${Number.comma(amount)} coins.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s flip`,
                            icon_url: profile.user.avatarURL()
                        },
                        color: client.colors.invalid
                    }});
                    break;
                }
                profile.economy.add(amount, "flip");
                profile.addFlipWin();
                msg.channel.send({ embed: {
                    title: `${profile.user.username} Flip`,
                    description: `You flipped ${result} and won ${Number.comma(amount)} coins!`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${profile.user.username}'s flip`,
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