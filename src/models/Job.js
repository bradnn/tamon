class Job {
    constructor(client, {
        name = undefined,
        description = undefined,
        messages = new Array(),
        incorrectMessages = new Array(),
        salary = 100,
        unlockHours = 0
    })
    {
        this.client = client;
        this.job = { name, description, messages, incorrectMessages, salary, unlockHours };
    }

    get message() {
        return this.job.messages[Math.floor(Math.random() * this.job.messages.length)];
    }

    get incorrectMessage() {
        return this.job.incorrectMessages[Math.floor(Math.random() * this.job.incorrectMessages.length)];
    }

    unlocked(user) {
        const workCount = user.work.count;
        if (workCount >= this.job.unlockHours) { return true; };
        return false;
    }
}

module.exports = Job;