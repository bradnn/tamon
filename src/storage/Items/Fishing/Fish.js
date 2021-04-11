module.exports = class {
    constructor() {
        this.name = `Freshwater Fish`;
        this.emoji = `🐟`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
        this.tier = `common`;

        this.display = false

        this.price = {
            buy: false,
            sell: 400,
            worth: 400
        }

        this.maxAmount = 0;
    }
}