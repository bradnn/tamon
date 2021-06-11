const Job = require("../../models/Job");

module.exports = class extends Job {
    constructor(client) {
        super(client, {
            name: "Voice Actor",
            description: "Do voice acting for companies that contract you.",
            messages: [ // Messages done by Cryptic#3068
                "You got payed %p for reading a super long script!",
                "The trailers racked in %p from your amazing voice.",
                "You voiced for the new Tamon Podcast and got %p.",
                "You voiced the trailer for Michael Bay's new film and got %p.",
                "The new soft drink brand payed you %p for voicing their new commercial.",
                "You did a short voicing and got payed %p.",
                "Tamon was impressed by your voice and decided to give you %p.",
                "You finished a theatre audition and got %p.",
                "You recorded a 20 minute long script for %p.",
                "Tamon was awed from listening to you! Tamon even gave you %p!"
            ],
            incorrectMessages: [
                "Youre voice cracked so much they only paid you %p. The correct answer was %a",
                "The script was so short they only paid you %p. The correct answer was %a"
            ],
            salary: 12000,
            unlockHours: 0
        });
    }
}