module.exports = class {
    constructor() {
        this.name = `Blowfish`;
        this.emoji = `🐡`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
        this.tier = `common`;

        this.display = false

        this.price = {
            buy: false,
            sell: 100,
            worth: 100
        }

        this.maxAmount = 0;
    }
}