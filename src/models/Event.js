const Tamon = require("../client/Tamon");

/**
 * @typedef {object} Tamon
 */

class Event {
    /**
     * 
     * @param {Tamon} client 
     * @param {*} param1 
     */
    constructor(client, {
        event = null
    }) 
    {
        this.client = client;
        this.event = {event}
    }
}

module.exports = Event;