const { GIFs } = require("../../storage/JSON/gifs");

module.exports = class {
    constructor() {
        this.cmd = 'slap',
        this.aliases = ['slapuser']
    }

    async run(client, msg, args, options) {
        let slappedUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

        const urls = GIFs.slap;
        const url = urls[Math.floor(Math.random() * urls.length)];

        if (!slappedUser || slappedUser === msg.author) {
            msg.channel.send({ embed: {
                title: `You slapped yourself... Why??`,
                image: {
                    url: url
                }
            }});
            return;
        }
        if (slappedUser === client.user) {
            msg.channel.send({ embed: {
                title: `Ow! Why'd you slap me, ${msg.author.username}?`,
                image: {
                    url: url
                }
            }});
            return;
        }

        msg.channel.send({ embed: {
            title: `${msg.author.username} slapped ${slappedUser.username}`,
            image: {
                url: url
            }
        }});
        return;

    }
}