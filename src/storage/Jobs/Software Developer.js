const messages = [
    "You debugged code for 8 hours and got paid %p."
];

const failMessages = [
    "You caused more bugs than you fixed. You were only paid %p. The correct answer was %a"
]

module.exports = class {
    constructor() {
        this.name = `Software Developer`;
        this.description = `Do software development for companies that hire you`; // Description done by sycles#3388
        this.hourRequirement = 0;
        this.salary = 25000;
        this.unlockHours = 0;
    }
    
    getMessage(correct = true) {
        if (correct) return messages[Math.floor(Math.random() * messages.length)]; // Returns random message from array defined at top of file.
        return failMessages[Math.floor(Math.random() * failMessages.length)]; // Returns random message from array defined at top of file.
    }

    isUnlocked(user) { // Checks if the user can apply for this job
        const workCount = user.work.getWorkCount();
        if (workCount >= this.unlockHours) {
            return true;
        }
        return false;
    }
}