module.exports = class {
    constructor() {
        this.name = `Whale`;
        this.emoji = `🐋`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
        this.tier = `rare`;

        this.display = false

        this.price = {
            buy: false,
            sell: 1000,
            worth: 1000
        }

        this.maxAmount = 0;
    }
}