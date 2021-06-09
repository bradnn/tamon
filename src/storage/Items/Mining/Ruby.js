module.exports = class {
    constructor() {
        this.name = `Ruby`;
        this.emoji = `💎`;
        this.description = `Found from mining in deep caverns.`;
        this.category = `Mining`;
        this.tier = `rare`;

        this.display = false

        this.price = {
            buy: false,
            sell: 3000,
            worth: 3000
        }

        this.maxAmount = 0;
    }
}