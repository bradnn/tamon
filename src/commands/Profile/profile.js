const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'profile',
        this.aliases = ['stats']
    }

    async run(client, msg, args, options) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg.author;
        const profile = await User.get(user);
        

        const embed = {
            author: {
                name: `${user.username}'s stats`,
                icon_url: user.avatarURL()
            },
            fields: [
                {
                    name: `Inventory`,
                    value: `${profile.getTotalItemCount()} items (Worth ${Number.comma(profile.getTotalItemWorth())} coins)`
                },
                {
                    name: `Pets`,
                    value: `Active Pet: **\`${profile.getActivePet()}\`**\nPet Count: **\`${Number.comma(Object.keys(profile.model.profile.pets.storage).length)}\`**`
                }
            ],
            timestamp: new Date(),
            color: client.colors.default
        }

        msg.channel.send({ embed: embed});
        return;
    }
}