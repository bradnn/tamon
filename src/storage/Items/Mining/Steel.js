module.exports = class {
    constructor() {
        this.name = `Steel`;
        this.emoji = `⛓`;
        this.description = `Found from mining in deep caverns.`;
        this.category = `Mining`;
        this.tier = `uncommon`;

        this.display = false

        this.price = {
            buy: false,
            sell: 500,
            worth: 500
        }

        this.maxAmount = 0;
    }
}