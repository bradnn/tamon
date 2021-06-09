const { GIFs } = require("../../storage/JSON/gifs");

module.exports = class {
    constructor() {
        this.cmd = 'kiss',
        this.aliases = ['mwah']
    }

    async run(client, msg, args, options) {
        let kissedUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

        const urls = GIFs.kiss;
        const url = urls[Math.floor(Math.random() * urls.length)];

        if (!kissedUser || kissedUser == msg.author) {
            msg.channel.send({ embed: {
                title: `Did you really just kiss yourself...`,
                image: {
                    url: url
                }
            }});
            return;
        }
        if (kissedUser === client.user) {
            msg.channel.send({ embed: {
                title: `Aww, thanks for the kiss ${msg.author.username} <3`,
                image: {
                    url: url
                }
            }});
            return;
        }

        msg.channel.send({ embed: {
            title: `${msg.author.username} kisses ${kissedUser.username}`,
            image: {
                url: url
            }
        }});
        return;

    }
}