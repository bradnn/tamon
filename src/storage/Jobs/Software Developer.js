const messages = [ // Messages done by Cryptic#3068
    "You debugged code for 8 hours and got paid %p.",
    "The trailers racked in %p from your amazing voice.",
    "You voiced for the new Tamon Podcast and got %p.",
    "You voiced the trailer for Michael Bay's new film and got %p.",
    "The new soft drink brand payed you %p for voicing their new commercial.",
    "You did a short voicing and got payed %p.",
    "Tamon was impressed by your voice and decided to give you %p.",
    "You finished a theatre audition and got %p.",
    "You recorded a 20 minute long script for %p.",
    "Tamon was awed from listening to you! Tamon even gave you %p!"
];

const failMessages = [
    "Youre voice cracked so much they only paid you %p. The correct answer was %a",
    "The script was so short they only paid you %p. The correct answer was %a"
]

module.exports = class {
    constructor() {
        this.name = `Voice Actor`;
        this.description = `Do voice acting for companies that contract you.`; // Description done by sycles#3388
        this.hourRequirement = 0;
        this.salary = 12500;
        this.unlockHours = 0;
    }
    
    getMessage(correct = true) {
        if (correct) return messages[Math.floor(Math.random() * messages.length)]; // Returns random message from array defined at top of file.
        return failMessages[Math.floor(Math.random() * failMessages.length)]; // Returns random message from array defined at top of file.
    }

    isUnlocked(user) { // Checks if the user can apply for this job
        const workCount = user.getWorkCount();
        if (workCount >= this.unlockHours) {
            return true;
        }
        return false;
    }
}