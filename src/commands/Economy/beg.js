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
                msg.channel.send({ embed: { 
                    author: { 
                        name: `${profile.user.username}'s stats`,
                        icon_url: profile.user.avatarURL()
                    },
                    description: `Times begged: **\`${profile.beg().getCount(true)}\`**\nAmount Earned: **\`${Number.comma(profile.beg().getEarned())}\`**`,
                    timestamp: new Date(),
                    footer: {
                        text: `${profile.user.username}'s begging stats`
                    },
                    color: client.colors.default
                }})
                break;
            }
            default: {
                if (profile.cooldown().get("beg", true, msg).response) return;

                const amount = Math.floor(Math.random() * 200) + 100;
                profile.economy().add(amount, "beg");
                profile.beg().addCount();
                profile.save();
                msg.channel.send({ embed: {
                    title: `${profile.user.username}'s Begging`,
                    description: `You begged for money and got ${Number.comma(amount)} coins.`,
                    timestamp: new Date(),
                    footer: {
                        text: `${profile.user.username}'s beg`,
                        icon_url: profile.user.avatarURL()
                    },
                    color: client.colors.success
                }});
                break;
            }
        }

        return;
    }
}