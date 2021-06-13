const Challenge = require("../../models/Challenge");
const { capitalize } = require("../../utils/String");

module.exports = class extends Challenge {
    constructor(client) {
        super(client, {
            name: `Reverse`,
            words: [
                "Ground",
                "Medium",
                "Defend",
                "Stomach",
                "Camera",
                "Dangerous",
                "Filter",
                "Address",
                "World",
                "Expand",
                "Notice",
                "Survey",
                "Mouse",
                "Thrust",
                "Command",
                "Stubborn",
                "Stimulation",
                "Host",
                "Taste"
            ],
            prompt: `The following word is reversed, reveal the original word to earn some coins:\n**\`%w%\`**`
        });
    }

    async execute(msg, title, footer) {
        const word = this.challenge.words[Math.floor(Math.random() * this.challenge.words.length)];
        const reversed = word.split("").reverse().join("");
        const filter = response => {
            return response.author.id === msg.author.id;
        }
        var response;
        await msg.channel.send({ embed: {
            title: title,
            description: this.challenge.prompt.replace(`%w%`, reversed),
            timestamp: Date.now(),
            footer: {
                text: footer,
                icon_url: msg.author.avatarURL()
            },
            color: this.client.colors.default
        }})
        .then(async () => {
            await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time']})
            .then(collected => {
                if (capitalize(collected.first().content.toLowerCase()) == word) {
                    response = {
                        correct: true,
                        word
                    }
                } else {
                    response = {
                        correct: false,
                        word,
                        error: "MISTYPE"
                    }
                }
            })
            .catch(() => {
                response = {
                    correct: false,
                    word,
                    error: "TIME"
                }
            });
        });

        return response;
    }
}