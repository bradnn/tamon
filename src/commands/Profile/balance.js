const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'balance',
        this.aliases = ['bal']
    }

    async run(client, msg, args, options) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg.author;
        const profile = await User.get(user);
        
        const embed = {
            author: {
                name: `${user.username}'s balance`,
                icon_url: user.avatarURL()
            },
            description: `🪙 ${profile.getCoins(true)} coins`,
            timestamp: new Date(),
            color: client.colors.default
        }

        msg.channel.send({ embed: embed});
        return;
    }
}