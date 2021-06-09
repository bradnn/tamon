module.exports = class {
    constructor() {
        this.name = `Pickaxe`;
        this.aliases = [`pick`];
        this.emoji = `⛏`;
        this.description = `Mine ores and sell them to the shop for easy cash.`;
        this.category = `Mining`;
        this.tier = `common`;

        this.display = true

        this.price = {
            buy: 500000,
            sell: false,
            worth: 500000
        }

        this.maxAmount = 50;
    }
}