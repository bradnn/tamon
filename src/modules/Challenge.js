const { Client } = require("../bot");
const { words } = require("../storage/JSON/words");
const { Number } = require("./Number");
const { String } = require("./String");
const client = Client.get();

module.exports.Challenge = {
    reverse: async function (msg, title, footer) {
        const word = words[Math.floor(Math.random() * words.length)];
        const reversedWord = word.split("").reverse().join("");
        const filter = response => {
            return response.author.id === msg.author.id;
        }

        var response;

        await msg.channel.send({ embed: {
            title: title,
            description: `The following word is reversed, reveal the original word to earn some coins:\n**\`${reversedWord}\`**`,
            timestamp: Date.now(),
            footer: {
                text: footer,
                icon_url: msg.author.avatarURL()
            },
            color: client.colors.default
        }})
        .then(async () => {
            await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
            .then(collected => {
                if (String.capitalize(collected.first().content.toLowerCase()) == word) {
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
            .catch(collected => {
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