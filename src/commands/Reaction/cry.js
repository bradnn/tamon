const { GIFs } = require("../../storage/JSON/gifs");

module.exports = class {
    constructor() {
        this.cmd = 'cry',
        this.aliases = ['crying', 'imcrying']
    }

    async run(client, msg, args, options) {
        let kissedUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

        const urls = GIFs.cry;
        const url = urls[Math.floor(Math.random() * urls.length)];

        if (!kissedUser || kissedUser == msg.author) {
            msg.channel.send({ embed: {
                title: `${msg.author.username} is crying...`,
                image: {
                    url: url
                }
            }});
            return;
        }
        if (kissedUser === client.user) {
            msg.channel.send({ embed: {
                title: `${msg.author.username} is crying...`,
                image: {
                    url: url
                }
            }});
            return;
        }

        msg.channel.send({ embed: {
            title: `${msg.author.username} cries for ${kissedUser.username}'s attention`,
            image: {
                url: url
            }
        }});
        return;

    }
}