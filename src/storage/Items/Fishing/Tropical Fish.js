module.exports = class {
    constructor() {
        this.name = `Tropical Fish`;
        this.emoji = `🐠`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
        this.tier = `common`;

        this.display = false

        this.price = {
            buy: false,
            sell: 700,
            worth: 700
        }

        this.maxAmount = 0;
    }
}