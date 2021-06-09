module.exports = class {
    constructor() {
        this.name = `Bronze`;
        this.emoji = `🥉`;
        this.description = `Found from mining in deep caverns.`;
        this.category = `Mining`;
        this.tier = `uncommon`;

        this.display = false

        this.price = {
            buy: false,
            sell: 1000,
            worth: 1000
        }

        this.maxAmount = 0;
    }
}