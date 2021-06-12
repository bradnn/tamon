const Event = require("../models/Event");

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            event: "ready"
        });
    }

    async run() {
        this.client.logger.ready(`Successfully started ${this.client.user.username}`)
        this.client.user.setActivity(`t!help`, { type: 'PLAYING' }); 
    }
}