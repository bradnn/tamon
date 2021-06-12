class Challenge {
    constructor(client, {
        name = null,
        words = new Array(),
        prompt = null
    })
    {
        this.client = client;
        this.challenge = {name, words, prompt};
    }
}

module.exports = Challenge;