const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'beg',
        this.aliases = ['plsgivemoney', 'needmoners', 'GIBMONERS']
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

                const WIN_AMOUNT = profile.getRollAmountWon();
                const LOSS_AMOUNT = profile.getRollAmountLost();
                const TOTAL_PROFIT = WIN_AMOUNT - LOSS_AMOUNT;

                const WINS = profile.getRollWins();
                const LOSSES = profile.getRollLosses();
                const TOTAL_ROLLS = WINS + LOSSES;

                msg.channel.send({ embed: { 
                    author: { 
                        name: `${profile.user.username}'s stats`,
                        icon_url: profile.user.avatarURL()
                    },
                    description: `Times rolled: **\`${Number.comma(TOTAL_ROLLS)}\`**
Rolls won: **\`${Number.comma(WINS)}\`**
Rolls lost: **\`${Number.comma(LOSSES)}\`**

Amount won: **\`${Number.comma(WIN_AMOUNT)} coins\`**
Amount lost: **\`${Number.comma(LOSS_AMOUNT)} coins\`**
Total profit: **\`${Number.comma(TOTAL_PROFIT)} coins\`**`,
                    timestamp: new Date(),
                    footer: {
                        text: `${profile.user.username}'s rolling stats`
                    },
                    color: client.colors.default
                }})
                break;
            }
            default: {
                const amount = parseInt(args[0]);

                if (!amount || isNaN(amount)) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You didn't provide a valid amount to gamble! Do \`${options.prefix}roll <Amount to gamble>\`.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s roll`,
                            icon_url: user.user.avatarURL()
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
                            text: `${user.user.username}'s roll`,
                            icon_url: user.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }

                var botRoll = Math.floor(Math.random() * 6) + 1;
                var theirRoll = Math.floor(Math.random() * 6) + 1;

                while (botRoll === theirRoll) {
                    botRoll = Math.floor(Math.random() * 6) + 1;
                };

                if(botRoll > theirRoll) {
                    profile.delCoins(amount, "roll");
                    profile.addRollLoss();
                    msg.channel.send({ embed: {
                        title: `${profile.user.username} Roll`,
                        description: `You rolled a ${theirRoll} and I rolled a ${botRoll}. You lost ${Number.comma(amount)} coins.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${profile.user.username}'s roll`,
                            icon_url: profile.user.avatarURL()
                        },
                        color: client.colors.invalid
                    }});
                    break;
                }
                profile.addCoins(amount, "roll");
                profile.addRollWin();
                msg.channel.send({ embed: {
                    title: `${profile.user.username} Roll`,
                    description: `You rolled a ${theirRoll} and I rolled a ${botRoll}. You won ${Number.comma(amount)} coins!`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${profile.user.username}'s roll`,
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