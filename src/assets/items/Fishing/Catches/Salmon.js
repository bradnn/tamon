const Item = require("../../../../models/Item");


module.exports = class extends Item {
    constructor(client) {
        super(client, {
            name: `Salmon`,
            aliases: [
                `Salmon Fish`
            ],
            emoji: `🐟`,
            description: `A salmon caught from fishing`,
            category: `Fishing`,
            tier: `common`,
            display: false,
            buyPrice: false,
            sellPrice: 25,
            worth: 25,
            maxAmount: 150,
            usable: false,
            uses: false
        })
    }
}