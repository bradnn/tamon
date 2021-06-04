module.exports = class {
    constructor() {
        this.name = `Tropical Fish`;
        this.emoji = `🐠`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
        this.tier = `uncommon`;

        this.display = false

        this.price = {
            buy: false,
            sell: 200,
            worth: 200
        }

        this.maxAmount = 0;
    }
}