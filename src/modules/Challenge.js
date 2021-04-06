const { Client } = require("../bot");
const { words } = require("../storage/JSON/words");
const { Number } = require("./Number");
const { String } = require("./String");
const client = Client.get();

module.exports.Challenge = {
    reverse: async function (msg, title, footer) {
        const word = words[Math.floor(Math.random() * words.length)]; // Gets a random word
        const reversedWord = word.split("").reverse().join(""); // Reverse the word
        const filter = response => { // Filter to make sure its the right user responding
            return response.author.id === msg.author.id;
        }

        var response;

        await msg.channel.send({ embed: { // Send message to user with the reversed word.
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
            await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}) // Await for message from that user
            .then(collected => {
                if (String.capitalize(collected.first().content.toLowerCase()) == word) { // If the word the user typed matches the original word
                    response = { // Return correct
                        correct: true, 
                        word
                    }
                } else { // If not return incorrect
                    response = {
                        correct: false,
                        word,
                        error: "MISTYPE"
                    }
                }
            })
            .catch(collected => { // If they didn't respond return incorrect with error TIME
                response = {
                    correct: false,
                    word,
                    error: "TIME"
                }
            });
        });

        return response; // Send response
    }
}