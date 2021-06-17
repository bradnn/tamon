const Item = require("../../../../models/Item");


module.exports = class extends Item {
    constructor(client) {
        super(client, {
            name: `Worm Bait`,
            aliases: [
                `Worm`
            ],
            emoji: `🪱`,
            description: `A worm used as bait.`,
            category: `Fishing`,
            tier: `common`,
            display: true,
            buyPrice: 1250,
            sellPrice: 0,
            worth: 1250,
            maxAmount: 25,
            usable: true,
            uses: 5
        })
    }
}