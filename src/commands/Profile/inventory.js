const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'inventory',
        this.aliases = ['inven']
    }

    async run(client, msg, args, options) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg.author;
        const profile = await User.get(user);
        const inventory = profile.model.profile.inventory;
        var invenString = ``;

        for (var category in inventory) {
            for (var item in inventory[category]) {
                item = client.items.get(item.toLowerCase());
                if (item.display === true) {
                    invenString += `${item.emoji} **${item.name}**: **\`${Number.comma(inventory[category][item.name])}\`**\nTier: ${String.capitalize(item.tier)} **-** ${item.category} item\n\n`;
                }
            }
        }

        const embed = {
            author: {
                name: `${user.username}'s inventory`,
                icon_url: user.avatarURL()
            },
            description: invenString,
            timestamp: new Date(),
            color: client.colors.default
        }

        msg.channel.send({ embed: embed});
        return;
    }
}