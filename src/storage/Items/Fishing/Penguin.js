module.exports = class {
    constructor() {
        this.name = `Penguin`;
        this.emoji = `🐧`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
        this.tier = `rare`;

        this.display = false

        this.price = {
            buy: false,
            sell: 1300,
            worth: 1300
        }

        this.maxAmount = 0;
    }
}