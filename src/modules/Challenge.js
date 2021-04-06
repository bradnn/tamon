const { words } = require("../storage/JSON/words");
const { Number } = require("./Number");
const { String } = require("./String");

module.exports.Challenge = {
    reverse: async function (client, msg, user) {
        const word = words[Math.floor(Math.random() * words.length)];
        const reversedWord = word.split("").reverse().join("");
        const filter = response => {
            return response.author.id === msg.author.id;
        }
        const job = client.jobs.get(user.getJob());

        var response;

        await msg.channel.send({ embed: {
            title: `${job.name} Work`,
            description: `The following word is reversed, reveal the original word to earn some coins:\n**\`${reversedWord}\`**`,
            timestamp: Date.now(),
            footer: {
                text: `${user.user.username}'s work`,
                icon_url: user.user.avatarURL()
            },
            color: client.colors.default
        }})
        .then(async () => {
            await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
            .then(collected => {
                if (String.capitalize(collected.first().content.toLowerCase()) == word) {
                    msg.channel.send({ embed: {
                        title: `${job.name} Work`,
                        description: job.getMessage().replace("%p", Number.comma(user.getPay())),
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s work`,
                            icon_url: user.user.avatarURL()
                        },
                        color: client.colors.success
                    }});
                    response = {
                        correct: true,
                        word
                    }
                } else {
                    msg.channel.send({ embed: {
                        title: `${job.name} Work`,
                        description: `You got it wrong, the word was **\`${word}\`**.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s work`,
                            icon_url: user.user.avatarURL()
                        },
                        color: client.colors.invalid
                    }});
                    response = {
                        correct: false,
                        word
                    }
                }
            })
            .catch(collected => {
                msg.channel.send({ embed: {
                    title: `${job.name} Work`,
                    description: `You took too long, the word was **\`${word}\`**.`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${user.user.username}'s work`,
                        icon_url: user.user.avatarURL()
                    },
                    color: client.colors.invalid
                }});
                response = {
                    correct: false,
                    word
                }
            });
        });

        return response;
    }
}