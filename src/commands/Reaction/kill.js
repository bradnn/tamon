const { GIFs } = require("../../storage/JSON/gifs");

module.exports = class {
    constructor() {
        this.cmd = 'kill',
        this.aliases = ['murder']
    }

    async run(client, msg, args, options) {
        let kissedUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

        const urls = GIFs.kill;
        const url = urls[Math.floor(Math.random() * urls.length)];

        if (!kissedUser || kissedUser == msg.author) {
            msg.channel.send({ embed: {
                title: `ahahaha don't kill yourself youre too sexy ${msg.author.username}...`,
                image: {
                    url: url
                }
            }});
            return;
        }
        if (kissedUser === client.user) {
            msg.channel.send({ embed: {
                title: `${msg.author.username} murdered me. The disrespect.`,
                image: {
                    url: url
                }
            }});
            return;
        }

        msg.channel.send({ embed: {
            title: `${msg.author.username} murdered ${kissedUser.username}.`,
            image: {
                url: url
            }
        }});
        return;

    }
}