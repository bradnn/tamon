const Item = require("../../../../models/Item");


module.exports = class extends Item {
    constructor(client) {
        super(client, {
            name: `Bass`,
            aliases: [
                `Bass Fish`
            ],
            emoji: `🐟`,
            description: `A bass caught from fishing`,
            category: `Fishing`,
            tier: `uncommon`,
            display: false,
            buyPrice: false,
            sellPrice: 65,
            worth: 65,
            maxAmount: 200,
            usable: false,
            uses: false
        })
    }
}