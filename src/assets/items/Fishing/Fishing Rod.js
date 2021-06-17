const Item = require("../../../models/Item");


module.exports = class extends Item {
    constructor(client) {
        super(client, {
            name: `Fishing Rod`,
            aliases: [
                `Rod`
            ],
            emoji: `🎣`,
            description: `A fishing rod to get started on your fishing journey!`,
            category: `Fishing`,
            tier: `common`,
            display: true,
            buyPrice: 100000,
            sellPrice: false,
            worth: 100000,
            maxAmount: 50,
            usable: true,
            uses: 15
        })
    }
}