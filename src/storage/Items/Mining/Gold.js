module.exports = class {
    constructor() {
        this.name = `Gold`;
        this.emoji = `🥇`;
        this.description = `Found from mining in deep caverns.`;
        this.category = `Mining`;
        this.tier = `uncommon`;

        this.display = false

        this.price = {
            buy: false,
            sell: 1500,
            worth: 1500
        }

        this.maxAmount = 0;
    }
}

