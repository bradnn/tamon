const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'pet',
        this.aliases = ['pets']
    }

    async run(client, msg, args, options) {

        var profile = await User.get(msg.author);

        switch (args[0]?.toLowerCase()) {
            case "equip":
            case "set":
            case "select": {
                args.shift();
                for (var arg in args) {
                    args[arg] = args[arg].toLowerCase();
                }
                const pet = client.pets.get(args.join(' '));
                if (!pet) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You need to supply a valid pet name. \`${options.prefix}pet equip <Pet Name>\``,
                        timestamp: Date.now(),
                        footer: {
                            text: `${msg.author.username}'s pets`,
                            icon_url: msg.author.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    return;
                }
                const setActive = profile.pet().setActive(pet);
                if (setActive == "NO_PET") {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You need to supply a pet name that you own. \`${options.prefix}pet equip <Pet Name>\``,
                        timestamp: Date.now(),
                        footer: {
                            text: `${msg.author.username}'s pets`,
                            icon_url: msg.author.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    return;
                }
                profile.save();
                msg.channel.send({ embed: {
                    title: `${profile.user.username} Pet`,
                    description: `You successfully equipped ${pet.name}!`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${profile.user.username}'s pet`,
                        icon_url: profile.user.avatarURL()
                    },
                    color: client.colors.success
                }});
                return;
            }
            default: {
                let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg.author;
                profile = await User.get(user);
                const pets = profile.model.profile.pets.storage;
                var petString = ``;
        
                for (var pet in pets) {
                    pet = client.pets.get(pet.toLowerCase());
                    if (pet) {
                        petString += `${pet.emoji} **${pet.name}**: **\`${profile.model.profile.pets.storage[pet.name]}\`** (${String.capitalize(pet.tier)})\n${pet.description}\n\n`;
                    }
                }
        
                const embed = {
                    author: {
                        name: `${user.username}'s pets`,
                        icon_url: user.avatarURL()
                    },
                    description: petString,
                    footer: {
                        text: `${options.prefix}pet select <Pet Name>`
                    },
                    timestamp: new Date(),
                    color: client.colors.default
                }
        
                msg.channel.send({ embed: embed});
                break;
            }
        }
        return;
    }
}