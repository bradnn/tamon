module.exports = class {
    constructor() {
        this.name = `Octopus`;
        this.emoji = `🐙`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
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