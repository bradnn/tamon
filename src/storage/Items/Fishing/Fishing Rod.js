module.exports = class {
    constructor() {
        this.name = `Fishing Rod`;
        this.aliases = [`rod`];
        this.emoji = `🎣`;
        this.description = `Get some extra cash by fishing.`;
        this.category = `Fishing`;
        this.tier = `common`;

        this.display = true

        this.price = {
            buy: 100000,
            sell: false,
            worth: 100000
        }

        this.maxAmount = 50;
    }
}